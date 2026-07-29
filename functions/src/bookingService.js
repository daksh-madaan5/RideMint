import { createHash } from 'node:crypto';
import { FieldValue } from 'firebase-admin/firestore';
import {
  BookingDomainError,
  buildListingSnapshot,
  buildPricingSnapshot,
  lockIdFor,
  todayIsoDate,
  validateRentalPeriod,
} from './bookingDomain.js';

const REQUEST_ID_PATTERN = /^[A-Za-z0-9_-]{16,64}$/;
const DOCUMENT_ID_PATTERN = /^[^/]{1,1500}$/;

export class BookingServiceError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'BookingServiceError';
    this.code = code;
  }
}

function fail(code, message) {
  throw new BookingServiceError(code, message);
}

function normalizeDomainError(error) {
  if (error instanceof BookingDomainError) {
    throw new BookingServiceError(error.code, error.message);
  }
  throw error;
}

function requireDocumentId(value, fieldName) {
  if (typeof value !== 'string' || !DOCUMENT_ID_PATTERN.test(value)) {
    fail('invalid-argument', `${fieldName} is invalid.`);
  }
  return value;
}

function requireRequestId(value) {
  if (typeof value !== 'string' || !REQUEST_ID_PATTERN.test(value)) {
    fail('invalid-argument', 'requestId must contain 16 to 64 URL-safe characters.');
  }
  return value;
}

function bookingIdFor(customerId, requestId) {
  return createHash('sha256')
    .update(`${customerId}:${requestId}`)
    .digest('hex')
    .slice(0, 40);
}

function rentalPeriod(pickupDate, returnDate, now) {
  try {
    return validateRentalPeriod(pickupDate, returnDate, {
      today: todayIsoDate(now),
    });
  } catch (error) {
    return normalizeDomainError(error);
  }
}

function pricingSnapshot(pricePerDay, rentalDays) {
  try {
    return buildPricingSnapshot(pricePerDay, rentalDays);
  } catch (error) {
    return normalizeDomainError(error);
  }
}

function requireAvailableListing(snapshot) {
  if (!snapshot.exists) fail('not-found', 'The requested listing does not exist.');
  const listing = snapshot.data();
  if (listing.listingStatus !== 'approved') {
    fail('failed-precondition', 'The listing is not approved for booking.');
  }
  if (listing.availabilityStatus !== 'available') {
    fail('failed-precondition', 'The listing is not currently available.');
  }
  return listing;
}

export async function requestBookingRecord({
  db,
  customerId,
  data,
  now = new Date(),
}) {
  if (!customerId) fail('unauthenticated', 'Sign in to request a booking.');
  const listingId = requireDocumentId(data?.listingId, 'listingId');
  const requestId = requireRequestId(data?.requestId);
  const period = rentalPeriod(data?.pickupDate, data?.returnDate, now);
  const bookingId = bookingIdFor(customerId, requestId);
  const bookingRef = db.collection('rentalBookings').doc(bookingId);
  const listingRef = db.collection('vehicleListings').doc(listingId);

  return db.runTransaction(async (transaction) => {
    const [existingBooking, listingSnapshot] = await Promise.all([
      transaction.get(bookingRef),
      transaction.get(listingRef),
    ]);

    if (existingBooking.exists) {
      const existing = existingBooking.data();
      if (
        existing.customerId === customerId
        && existing.listingId === listingId
        && existing.pickupDate === period.pickupDate
        && existing.returnDate === period.returnDate
      ) {
        return { bookingId, status: existing.status, idempotent: true };
      }
      fail('already-exists', 'This request ID has already been used.');
    }

    const listing = requireAvailableListing(listingSnapshot);
    if (listing.ownerId === customerId) {
      fail('failed-precondition', 'You cannot request your own listing.');
    }

    const pricing = pricingSnapshot(listing.pricePerDay, period.rentalDays);
    const timestamp = FieldValue.serverTimestamp();
    transaction.create(bookingRef, {
      customerId,
      ownerId: listing.ownerId,
      listingId,
      listingSnapshot: buildListingSnapshot(listing),
      pricingSnapshot: pricing,
      pickupDate: period.pickupDate,
      returnDate: period.returnDate,
      status: 'pending',
      createdAt: timestamp,
      updatedAt: timestamp,
      confirmedAt: null,
      cancelledAt: null,
      rejectedAt: null,
    });

    return { bookingId, status: 'pending', idempotent: false };
  });
}

export async function respondToBookingRecord({
  db,
  ownerId,
  data,
  now = new Date(),
}) {
  if (!ownerId) fail('unauthenticated', 'Sign in to respond to a booking.');
  const bookingId = requireDocumentId(data?.bookingId, 'bookingId');
  if (!['accept', 'reject'].includes(data?.decision)) {
    fail('invalid-argument', 'decision must be accept or reject.');
  }

  const bookingRef = db.collection('rentalBookings').doc(bookingId);

  return db.runTransaction(async (transaction) => {
    const bookingSnapshot = await transaction.get(bookingRef);
    if (!bookingSnapshot.exists) fail('not-found', 'The booking request does not exist.');
    const booking = bookingSnapshot.data();

    if (booking.ownerId !== ownerId) {
      fail('permission-denied', 'Only the listing owner can respond to this request.');
    }
    if (booking.status !== 'pending') {
      fail('failed-precondition', 'This booking request has already been resolved.');
    }

    const listingRef = db.collection('vehicleListings').doc(booking.listingId);
    const listingSnapshot = await transaction.get(listingRef);
    if (
      !listingSnapshot.exists
      || listingSnapshot.data().ownerId !== ownerId
      || booking.ownerId !== ownerId
    ) {
      fail('permission-denied', 'Listing ownership no longer matches this booking.');
    }

    const timestamp = FieldValue.serverTimestamp();
    if (data.decision === 'reject') {
      transaction.update(bookingRef, {
        status: 'rejected',
        rejectedAt: timestamp,
        updatedAt: timestamp,
      });
      return { bookingId, status: 'rejected' };
    }

    requireAvailableListing(listingSnapshot);

    const period = rentalPeriod(booking.pickupDate, booking.returnDate, now);
    const lockRefs = period.rentalDates.map((date) =>
      db.collection('bookingLocks').doc(lockIdFor(booking.listingId, date))
    );
    const lockSnapshots = await Promise.all(lockRefs.map((ref) => transaction.get(ref)));
    if (lockSnapshots.some((snapshot) => snapshot.exists)) {
      fail('already-exists', 'The requested dates are no longer available.');
    }

    lockRefs.forEach((lockRef, index) => {
      transaction.create(lockRef, {
        listingId: booking.listingId,
        bookingId,
        rentalDate: period.rentalDates[index],
        createdAt: timestamp,
      });
    });
    transaction.update(bookingRef, {
      status: 'confirmed',
      confirmedAt: timestamp,
      updatedAt: timestamp,
    });

    return { bookingId, status: 'confirmed' };
  });
}

export async function cancelBookingRecord({
  db,
  customerId,
  data,
  now = new Date(),
}) {
  if (!customerId) fail('unauthenticated', 'Sign in to cancel a booking.');
  const bookingId = requireDocumentId(data?.bookingId, 'bookingId');
  const bookingRef = db.collection('rentalBookings').doc(bookingId);

  return db.runTransaction(async (transaction) => {
    const bookingSnapshot = await transaction.get(bookingRef);
    if (!bookingSnapshot.exists) fail('not-found', 'The booking does not exist.');
    const booking = bookingSnapshot.data();

    if (booking.customerId !== customerId) {
      fail('permission-denied', 'You can cancel only your own booking.');
    }
    if (!['pending', 'confirmed'].includes(booking.status)) {
      fail('failed-precondition', 'This booking can no longer be cancelled.');
    }

    const timestamp = FieldValue.serverTimestamp();
    if (booking.status === 'pending') {
      transaction.update(bookingRef, {
        status: 'cancelled',
        cancelledAt: timestamp,
        updatedAt: timestamp,
      });
      return { bookingId, status: 'cancelled' };
    }

    if (booking.pickupDate <= todayIsoDate(now)) {
      fail('failed-precondition', 'A confirmed booking cannot be cancelled after pickup begins.');
    }

    const period = rentalPeriod(booking.pickupDate, booking.returnDate, now);
    const lockRefs = period.rentalDates.map((date) =>
      db.collection('bookingLocks').doc(lockIdFor(booking.listingId, date))
    );
    const lockSnapshots = await Promise.all(lockRefs.map((ref) => transaction.get(ref)));

    lockSnapshots.forEach((lockSnapshot) => {
      if (lockSnapshot.exists && lockSnapshot.data().bookingId === bookingId) {
        transaction.delete(lockSnapshot.ref);
      }
    });
    transaction.update(bookingRef, {
      status: 'cancelled',
      cancelledAt: timestamp,
      updatedAt: timestamp,
    });

    return { bookingId, status: 'cancelled' };
  });
}
