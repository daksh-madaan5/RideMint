export const BOOKING_PREVIEW_MESSAGE =
  'Online booking is not enabled in this portfolio demo.';

const requestedMode = import.meta.env.VITE_BOOKING_MODE;
const emulatorFlagEnabled = import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true';
const localHostname =
  typeof window !== 'undefined'
  && ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);

export const isLocalSecureBooking =
  import.meta.env.DEV
  && requestedMode === 'local-secure'
  && emulatorFlagEnabled
  && localHostname;

export const bookingMode = isLocalSecureBooking ? 'local-secure' : 'preview';
