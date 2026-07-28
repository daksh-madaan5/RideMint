import { z } from 'zod';
import {
  FUEL_TYPES,
  LISTING_CATEGORIES,
  SUPPORTED_LOCATIONS,
  TRANSMISSION_TYPES,
} from '@/constants';
export { MATERIAL_LISTING_FIELDS } from './listingPolicy';

export const LISTING_STATUSES = ['pending', 'approved', 'rejected', 'inactive'];
export const AVAILABILITY_STATUSES = ['available', 'unavailable'];

const currentYear = new Date().getFullYear();

export const listingSchema = z.object({
  make: z.string().trim().min(2, 'Enter the vehicle make.').max(50, 'Keep the make under 50 characters.'),
  model: z.string().trim().min(1, 'Enter the vehicle model.').max(60, 'Keep the model under 60 characters.'),
  year: z.coerce.number().int().min(1990, 'Year must be 1990 or later.').max(currentYear + 1, `Year cannot be later than ${currentYear + 1}.`),
  category: z.enum(LISTING_CATEGORIES, { message: 'Choose a category.' }),
  city: z.enum(SUPPORTED_LOCATIONS, { message: 'Choose a supported city.' }),
  transmission: z.enum(TRANSMISSION_TYPES, { message: 'Choose a transmission.' }),
  fuelType: z.enum(FUEL_TYPES, { message: 'Choose a fuel type.' }),
  seats: z.coerce.number().int().min(2, 'A vehicle needs at least 2 seats.').max(10, 'Seats cannot exceed 10.'),
  pricePerDay: z.coerce.number().positive('Enter a positive daily price.').max(100000, 'Daily price must be ₹1,00,000 or less.'),
  description: z.string().trim().min(80, 'Add at least 80 characters.').max(1200, 'Keep the description under 1,200 characters.'),
  availabilityStatus: z.enum(AVAILABILITY_STATUSES).default('available'),
});

export const LISTING_FORM_OPTIONS = {
  categories: LISTING_CATEGORIES,
  cities: SUPPORTED_LOCATIONS,
  transmissions: TRANSMISSION_TYPES,
  fuelTypes: FUEL_TYPES,
};

export const LISTING_STATUS_COPY = {
  pending: 'Waiting for administrator review.',
  approved: 'Visible to customers.',
  rejected: 'Changes are required before approval.',
  inactive: 'Hidden from customers. Reactivate to submit it for review again.',
};
