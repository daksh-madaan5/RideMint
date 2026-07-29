const DAY_MS = 24 * 60 * 60 * 1000;
export const MAX_RENTAL_DAYS = 30;

export function toIsoDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function rentalDaysBetween(pickupDate, returnDate) {
  if (!(pickupDate instanceof Date) || !(returnDate instanceof Date)) return 0;
  const pickup = Date.UTC(
    pickupDate.getFullYear(),
    pickupDate.getMonth(),
    pickupDate.getDate()
  );
  const returned = Date.UTC(
    returnDate.getFullYear(),
    returnDate.getMonth(),
    returnDate.getDate()
  );
  return (returned - pickup) / DAY_MS;
}

export function validateBookingDates(pickupDate, returnDate) {
  if (!pickupDate || !returnDate) return 'Select both pickup and return dates.';

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const pickup = new Date(pickupDate);
  pickup.setHours(0, 0, 0, 0);
  const rentalDays = rentalDaysBetween(pickupDate, returnDate);

  if (pickup < today) return 'Pickup date cannot be in the past.';
  if (rentalDays < 1) return 'Return date must be after pickup date.';
  if (rentalDays > MAX_RENTAL_DAYS) {
    return `Rental duration cannot exceed ${MAX_RENTAL_DAYS} days.`;
  }
  return '';
}

export function canCancelBooking(booking, today = toIsoDate(new Date())) {
  if (booking.status === 'pending') return true;
  return booking.status === 'confirmed' && booking.pickupDate > today;
}

export function bookingStatusVariant(status) {
  return {
    pending: 'warning',
    confirmed: 'success',
    rejected: 'danger',
    cancelled: 'default',
    completed: 'primary',
  }[status] || 'default';
}
