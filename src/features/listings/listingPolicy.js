export const MATERIAL_LISTING_FIELDS = [
  'make',
  'model',
  'year',
  'category',
  'city',
  'transmission',
  'fuelType',
  'seats',
  'pricePerDay',
  'description',
  'images',
];

function valuesDiffer(left, right) {
  return JSON.stringify(left ?? null) !== JSON.stringify(right ?? null);
}

export function hasMaterialListingChanges(current, next) {
  return MATERIAL_LISTING_FIELDS.some((field) => valuesDiffer(current?.[field], next?.[field]));
}

export function getListingStatusAfterOwnerEdit(current, next) {
  const materialChange = hasMaterialListingChanges(current, next);
  if (materialChange && ['approved', 'rejected', 'inactive'].includes(current.listingStatus)) {
    return 'pending';
  }
  return current.listingStatus;
}

export function getReactivatedListingState(current) {
  if (current?.listingStatus !== 'inactive') {
    throw new Error('Only inactive listings can be reactivated.');
  }
  return {
    listingStatus: 'pending',
    availabilityStatus: 'available',
  };
}
