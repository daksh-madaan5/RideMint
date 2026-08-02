export function getListingImageUrl(image) {
  if (typeof image === 'string') return image.trim();
  if (!image || typeof image !== 'object') return '';
  return (image.url || image.secureUrl || image.secure_url || '').trim();
}

export function dedupeListingImages(images = []) {
  const seenUrls = new Set();
  const seenAssetIds = new Set();
  const seenPublicIds = new Set();

  return images.filter((image) => {
    const url = getListingImageUrl(image);
    if (!url || seenUrls.has(url)) return false;

    const assetId = typeof image === 'object' ? image.assetId : '';
    const publicId = typeof image === 'object' ? image.publicId : '';
    if ((assetId && seenAssetIds.has(assetId)) || (publicId && seenPublicIds.has(publicId))) {
      return false;
    }

    seenUrls.add(url);
    if (assetId) seenAssetIds.add(assetId);
    if (publicId) seenPublicIds.add(publicId);
    return true;
  });
}

export function getListingImageUrls(listing) {
  const images = Array.isArray(listing?.images) ? listing.images : [];
  const urls = dedupeListingImages(images).map(getListingImageUrl);

  if (urls.length > 0) return urls;

  const legacyUrl = getListingImageUrl(listing?.image || listing?.imageUrl);
  return legacyUrl ? [legacyUrl] : [];
}
