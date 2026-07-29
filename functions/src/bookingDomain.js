const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 24 * 60 * 60 * 1000;
export const MAX_RENTAL_DAYS = 30;

export class BookingDomainError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'BookingDomainError';
    this.code = code;
  }
}

export function todayIsoDate(now = new Date()) {
  if (!(now instanceof Date) || Number.isNaN(now.getTime())) {
    throw new BookingDomainError('internal', 'The server clock is unavailable.');
  }
  return now.toISOString().slice(0, 10);
}

export function parseIsoDate(value, fieldName) {
  if (typeof value !== 'string' || !ISO_DATE_PATTERN.test(value)) {
    throw new BookingDomainError(
      'invalid-argument',
      `${fieldName} must use YYYY-MM-DD format.`
    );
  }

  const [year, month, day] = value.split('-').map(Number);
  const timestamp = Date.UTC(year, month - 1, day);
  const parsed = new Date(timestamp);

  if (
    parsed.getUTCFullYear() !== year
    || parsed.getUTCMonth() !== month - 1
    || parsed.getUTCDate() !== day
  ) {
    throw new BookingDomainError('invalid-argument', `${fieldName} is not a valid calendar date.`);
  }

  return timestamp;
}

export function validateRentalPeriod(
  pickupDate,
  returnDate,
  { today = todayIsoDate() } = {}
) {
  const pickupTimestamp = parseIsoDate(pickupDate, 'pickupDate');
  const returnTimestamp = parseIsoDate(returnDate, 'returnDate');
  const todayTimestamp = parseIsoDate(today, 'today');
  const rentalDays = (returnTimestamp - pickupTimestamp) / DAY_MS;

  if (pickupTimestamp < todayTimestamp) {
    throw new BookingDomainError('invalid-argument', 'Pickup date cannot be in the past.');
  }
  if (rentalDays < 1) {
    throw new BookingDomainError('invalid-argument', 'Return date must be after pickup date.');
  }
  if (rentalDays > MAX_RENTAL_DAYS) {
    throw new BookingDomainError(
      'invalid-argument',
      `Rental duration cannot exceed ${MAX_RENTAL_DAYS} days.`
    );
  }

  return {
    pickupDate,
    returnDate,
    rentalDays,
    rentalDates: Array.from({ length: rentalDays }, (_, index) =>
      new Date(pickupTimestamp + index * DAY_MS).toISOString().slice(0, 10)
    ),
  };
}

export function buildPricingSnapshot(pricePerDay, rentalDays) {
  if (!Number.isSafeInteger(pricePerDay) || pricePerDay <= 0) {
    throw new BookingDomainError(
      'failed-precondition',
      'The listing does not have a valid integer INR daily price.'
    );
  }

  const baseAmount = pricePerDay * rentalDays;
  if (!Number.isSafeInteger(baseAmount)) {
    throw new BookingDomainError('failed-precondition', 'The calculated booking amount is invalid.');
  }

  return {
    pricePerDay,
    rentalDays,
    baseAmount,
    totalAmount: baseAmount,
    currency: 'INR',
  };
}

export function buildListingSnapshot(listing) {
  const imageUrl = Array.isArray(listing.images) ? listing.images[0]?.url : '';
  return {
    make: listing.make,
    model: listing.model,
    year: listing.year,
    city: listing.city,
    imageUrl: typeof imageUrl === 'string' ? imageUrl : '',
  };
}

export function lockIdFor(listingId, rentalDate) {
  return `${listingId}_${rentalDate}`;
}
