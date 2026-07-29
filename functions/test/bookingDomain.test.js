import assert from 'node:assert/strict';
import test from 'node:test';
import {
  BookingDomainError,
  buildPricingSnapshot,
  lockIdFor,
  parseIsoDate,
  validateRentalPeriod,
} from '../src/bookingDomain.js';

test('strict ISO dates reject impossible calendar dates', () => {
  assert.throws(
    () => parseIsoDate('2026-02-30', 'pickupDate'),
    (error) => error instanceof BookingDomainError && error.code === 'invalid-argument'
  );
});

test('half-open rental periods exclude the return date', () => {
  const period = validateRentalPeriod('2026-08-10', '2026-08-13', {
    today: '2026-08-01',
  });

  assert.equal(period.rentalDays, 3);
  assert.deepEqual(period.rentalDates, [
    '2026-08-10',
    '2026-08-11',
    '2026-08-12',
  ]);
});

test('past pickup dates are rejected against a UTC calendar date', () => {
  assert.throws(
    () => validateRentalPeriod('2026-07-31', '2026-08-01', { today: '2026-08-01' }),
    /Pickup date cannot be in the past/
  );
});

test('return date must be after pickup date', () => {
  assert.throws(
    () => validateRentalPeriod('2026-08-10', '2026-08-10', { today: '2026-08-01' }),
    /Return date must be after pickup date/
  );
});

test('rental duration cannot exceed 30 days', () => {
  assert.throws(
    () => validateRentalPeriod('2026-08-01', '2026-09-01', { today: '2026-08-01' }),
    /cannot exceed 30 days/
  );
});

test('pricing uses integer INR daily price without client fees', () => {
  assert.deepEqual(buildPricingSnapshot(3200, 3), {
    pricePerDay: 3200,
    rentalDays: 3,
    baseAmount: 9600,
    totalAmount: 9600,
    currency: 'INR',
  });
});

test('lock IDs are deterministic per listing and reserved date', () => {
  assert.equal(lockIdFor('listing-a', '2026-08-10'), 'listing-a_2026-08-10');
});
