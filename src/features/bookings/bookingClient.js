import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from 'firebase/functions';
import { app } from '@/firebase/config';
import {
  BOOKING_PREVIEW_MESSAGE,
  isLocalSecureBooking,
} from './bookingMode';

let localFunctions;

export class BookingClientError extends Error {
  constructor(message, code = 'booking/unavailable') {
    super(message);
    this.name = 'BookingClientError';
    this.code = code;
  }
}

function getLocalFunctions() {
  if (!isLocalSecureBooking) {
    throw new BookingClientError(BOOKING_PREVIEW_MESSAGE);
  }

  if (!localFunctions) {
    localFunctions = getFunctions(app, 'asia-south1');
    connectFunctionsEmulator(localFunctions, '127.0.0.1', 5001);
  }
  return localFunctions;
}

function safeCallableError(error) {
  const code = typeof error?.code === 'string'
    ? error.code.replace(/^functions\//, '')
    : 'internal';
  const messages = {
    unauthenticated: 'Sign in to continue.',
    'invalid-argument': 'Check the booking details and try again.',
    'failed-precondition': error?.message || 'This booking action is no longer available.',
    'permission-denied': 'You do not have permission to perform this booking action.',
    'not-found': 'The requested booking or listing was not found.',
    'already-exists': error?.message || 'Those dates are no longer available.',
  };
  return new BookingClientError(
    messages[code] || 'The booking service could not complete the request.',
    `booking/${code}`
  );
}

async function callBookingFunction(name, data) {
  try {
    const callable = httpsCallable(getLocalFunctions(), name);
    const result = await callable(data);
    return result.data;
  } catch (error) {
    if (error instanceof BookingClientError) throw error;
    throw safeCallableError(error);
  }
}

export function requestBooking({
  listingId,
  pickupDate,
  returnDate,
  requestId = crypto.randomUUID(),
}) {
  return callBookingFunction('requestBooking', {
    listingId,
    pickupDate,
    returnDate,
    requestId,
  });
}

export function respondToBooking({ bookingId, decision }) {
  return callBookingFunction('respondToBooking', { bookingId, decision });
}

export function cancelSecureBooking(bookingId) {
  return callBookingFunction('cancelBooking', { bookingId });
}
