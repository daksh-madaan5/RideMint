import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import {
  getListingStatusAfterOwnerEdit,
  getReactivatedListingState,
  MATERIAL_LISTING_FIELDS,
} from './listingPolicy';

const listingsCollection = collection(db, 'vehicleListings');

const editableFields = [
  ...MATERIAL_LISTING_FIELDS,
  'availabilityStatus',
];

function pickEditableFields(values) {
  return Object.fromEntries(
    editableFields
      .filter((field) => values[field] !== undefined)
      .map((field) => [field, values[field]])
  );
}

export async function createVehicleListing({ user, userProfile, values, images }) {
  if (!user?.uid) throw new Error('You must be signed in to create a listing.');

  const listing = {
    ...pickEditableFields(values),
    images,
    ownerId: user.uid,
    ownerSnapshot: {
      displayName: userProfile?.name || user.displayName || 'RideMint member',
      photoURL: userProfile?.photo || user.photoURL || '',
      emailVerified: Boolean(user.emailVerified),
    },
    listingStatus: 'pending',
    availabilityStatus: values.availabilityStatus || 'available',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const result = await addDoc(listingsCollection, listing);
  return result.id;
}

export async function getOwnerListings(ownerId) {
  if (!ownerId) return [];
  const snapshot = await getDocs(query(listingsCollection, where('ownerId', '==', ownerId)));
  return snapshot.docs
    .map((listing) => ({ id: listing.id, ...listing.data() }))
    .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
}

export async function getOwnerListingById(listingId, ownerId) {
  if (!listingId || !ownerId) return null;
  const snapshot = await getDoc(doc(db, 'vehicleListings', listingId));
  if (!snapshot.exists()) return null;
  const listing = { id: snapshot.id, ...snapshot.data() };
  if (listing.ownerId !== ownerId) throw new Error('You cannot edit this listing.');
  return listing;
}

export async function updateOwnListing({ listingId, ownerId, current, values, images }) {
  if (!current || current.ownerId !== ownerId) throw new Error('You cannot edit this listing.');

  const next = { ...pickEditableFields(values), images };
  const listingStatus = getListingStatusAfterOwnerEdit(current, next);

  await updateDoc(doc(db, 'vehicleListings', listingId), {
    ...next,
    listingStatus,
    updatedAt: serverTimestamp(),
  });
}

export async function deactivateOwnListing({ listingId, ownerId, current }) {
  if (!current || current.ownerId !== ownerId) throw new Error('You cannot deactivate this listing.');
  await updateDoc(doc(db, 'vehicleListings', listingId), {
    listingStatus: 'inactive',
    updatedAt: serverTimestamp(),
  });
}

export async function reactivateOwnListing({ listingId, ownerId, current }) {
  if (!current || current.ownerId !== ownerId) throw new Error('You cannot reactivate this listing.');
  const reactivatedState = getReactivatedListingState(current);
  await updateDoc(doc(db, 'vehicleListings', listingId), {
    ...reactivatedState,
    updatedAt: serverTimestamp(),
  });
}

export async function getApprovedPublicListings() {
  const publicQuery = query(
    listingsCollection,
    where('listingStatus', '==', 'approved'),
    where('availabilityStatus', '==', 'available')
  );
  const snapshot = await getDocs(publicQuery);
  return snapshot.docs.map((listing) => ({ id: listing.id, ...listing.data() }));
}

export async function getApprovedPublicListingById(listingId) {
  const snapshot = await getDoc(doc(db, 'vehicleListings', listingId));
  if (!snapshot.exists()) return null;
  const listing = { id: snapshot.id, ...snapshot.data() };
  return listing.listingStatus === 'approved' && listing.availabilityStatus === 'available'
    ? listing
    : null;
}

export async function getPendingListings() {
  const snapshot = await getDocs(query(listingsCollection, where('listingStatus', '==', 'pending')));
  return snapshot.docs
    .map((listing) => ({ id: listing.id, ...listing.data() }))
    .sort((a, b) => (a.createdAt?.toMillis?.() || 0) - (b.createdAt?.toMillis?.() || 0));
}

export async function moderateListing({ listingId, adminId, decision, rejectionReason = '' }) {
  if (!['approved', 'rejected'].includes(decision)) throw new Error('Invalid moderation decision.');
  if (decision === 'rejected' && !rejectionReason.trim()) throw new Error('Add a rejection reason.');

  await updateDoc(doc(db, 'vehicleListings', listingId), {
    listingStatus: decision,
    rejectionReason: decision === 'rejected' ? rejectionReason.trim() : null,
    moderatedBy: adminId,
    moderatedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export function listingToCatalogVehicle(listing) {
  return {
    ...listing,
    source: 'firestore-listing',
    brand: listing.make,
    image: listing.images?.[0]?.url,
    available: listing.availabilityStatus === 'available',
    branch: {
      name: listing.pickupArea
        ? `${listing.pickupArea}, ${listing.city}`
        : `${listing.city} pickup arranged with the host`,
      city: listing.city,
      address: listing.pickupArea || null,
      operatingHours: null,
    },
    specifications: [
      `${listing.year} model year`,
      `${listing.seats} seats`,
      `${listing.transmission} transmission`,
    ],
  };
}
