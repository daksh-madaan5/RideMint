import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getListingStatusAfterOwnerEdit,
  getReactivatedListingState,
  hasMaterialListingChanges,
} from '../src/features/listings/listingPolicy.js';
import {
  dedupeListingImages,
  getListingImageUrls,
} from '../src/features/listings/listingImages.js';

const approvedListing = {
  listingStatus: 'approved',
  make: 'Honda',
  model: 'City',
  pricePerDay: 3500,
  availabilityStatus: 'available',
  images: [{ assetId: 'asset-1' }],
};

test('availability-only changes keep an approved listing approved', () => {
  const next = { ...approvedListing, availabilityStatus: 'unavailable' };
  assert.equal(hasMaterialListingChanges(approvedListing, next), false);
  assert.equal(getListingStatusAfterOwnerEdit(approvedListing, next), 'approved');
});

test('material changes return an approved listing to pending', () => {
  const next = { ...approvedListing, pricePerDay: 3800 };
  assert.equal(hasMaterialListingChanges(approvedListing, next), true);
  assert.equal(getListingStatusAfterOwnerEdit(approvedListing, next), 'pending');
});

test('editing a rejected listing resubmits it as pending', () => {
  const rejected = { ...approvedListing, listingStatus: 'rejected' };
  assert.equal(getListingStatusAfterOwnerEdit(rejected, { ...rejected, description: 'Updated description' }), 'pending');
});

test('pending material edits remain pending', () => {
  const pending = { ...approvedListing, listingStatus: 'pending' };
  assert.equal(getListingStatusAfterOwnerEdit(pending, { ...pending, model: 'City ZX' }), 'pending');
});

test('reactivation returns an inactive listing to pending and available', () => {
  const inactive = {
    ...approvedListing,
    listingStatus: 'inactive',
    availabilityStatus: 'unavailable',
  };
  assert.deepEqual(getReactivatedListingState(inactive), {
    listingStatus: 'pending',
    availabilityStatus: 'available',
  });
});

test('reactivation rejects listings that are not inactive', () => {
  assert.throws(
    () => getReactivatedListingState(approvedListing),
    /Only inactive listings can be reactivated/
  );
});

test('listing images retain distinct Cloudinary results and remove duplicate URLs', () => {
  const first = { url: 'https://example.test/one.jpg', assetId: 'asset-1', publicId: 'cars/one' };
  const second = { url: 'https://example.test/two.jpg', assetId: 'asset-2', publicId: 'cars/two' };
  const duplicateUrl = { ...second, assetId: 'asset-3', publicId: 'cars/two-copy' };

  assert.deepEqual(dedupeListingImages([first, second, duplicateUrl]), [first, second]);
});

test('listing image URLs support metadata objects and legacy single-image fields', () => {
  assert.deepEqual(
    getListingImageUrls({
      images: [
        { url: 'https://example.test/one.jpg' },
        { url: 'https://example.test/two.jpg' },
      ],
    }),
    ['https://example.test/one.jpg', 'https://example.test/two.jpg']
  );
  assert.deepEqual(
    getListingImageUrls({ image: 'https://example.test/legacy.jpg' }),
    ['https://example.test/legacy.jpg']
  );
});
