import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2/options';
import {
  BookingServiceError,
  cancelBookingRecord,
  requestBookingRecord,
  respondToBookingRecord,
} from './src/bookingService.js';

initializeApp();
setGlobalOptions({
  region: 'asia-south1',
  maxInstances: 10,
});

const db = getFirestore();

function requireAuthenticatedUid(request) {
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError('unauthenticated', 'Authentication is required.');
  }
  return uid;
}

function asCallable(handler) {
  return onCall(async (request) => {
    try {
      return await handler(request);
    } catch (error) {
      if (error instanceof HttpsError) {
        throw error;
      }
      if (error instanceof BookingServiceError) {
        throw new HttpsError(error.code, error.message);
      }
      console.error('Secure booking callable failed.', error);
      throw new HttpsError('internal', 'The booking service could not complete the request.');
    }
  });
}

export const requestBooking = asCallable((request) =>
  requestBookingRecord({
    db,
    customerId: requireAuthenticatedUid(request),
    data: request.data,
  })
);

export const respondToBooking = asCallable((request) =>
  respondToBookingRecord({
    db,
    ownerId: requireAuthenticatedUid(request),
    data: request.data,
  })
);

export const cancelBooking = asCallable((request) =>
  cancelBookingRecord({
    db,
    customerId: requireAuthenticatedUid(request),
    data: request.data,
  })
);
