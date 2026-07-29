import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { isLocalSecureBooking } from './bookingMode';

function requireLocalSecureMode() {
  if (!isLocalSecureBooking) {
    throw new Error('Secure booking records are available only in the local emulator environment.');
  }
}

async function getParticipantBookings(field, uid) {
  requireLocalSecureMode();
  if (!uid) return [];

  const snapshot = await getDocs(query(
    collection(db, 'rentalBookings'),
    where(field, '==', uid),
    orderBy('createdAt', 'desc')
  ));

  return snapshot.docs.map((booking) => ({
    id: booking.id,
    ...booking.data(),
  }));
}

export function getCustomerRentalBookings(customerId) {
  return getParticipantBookings('customerId', customerId);
}

export function getHostRentalBookings(ownerId) {
  return getParticipantBookings('ownerId', ownerId);
}

export async function getAdminRentalBookings({ isAdmin = false } = {}) {
  requireLocalSecureMode();
  if (!isAdmin) {
    throw new Error('An authenticated administrator profile is required.');
  }

  const snapshot = await getDocs(query(
    collection(db, 'rentalBookings'),
    orderBy('createdAt', 'desc')
  ));

  return snapshot.docs.map((booking) => ({
    id: booking.id,
    ...booking.data(),
  }));
}
