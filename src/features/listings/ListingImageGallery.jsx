import { useEffect, useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import IconButton from '@/components/ui/IconButton';
import VehicleImage from '@/features/cars/VehicleImage';
import { getListingImageUrls } from './listingImages';

export default function ListingImageGallery({ listing, alt, compact = false, eager = false }) {
  const images = getListingImageUrls(listing);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [listing?.id]);

  const activeIndex = Math.min(currentIndex, Math.max(images.length - 1, 0));
  const showControls = images.length > 1;

  const showPrevious = () => {
    setCurrentIndex((index) => (index - 1 + images.length) % images.length);
  };

  const showNext = () => {
    setCurrentIndex((index) => (index + 1) % images.length);
  };

  return (
    <div className="min-w-0">
      <div className="relative">
        <VehicleImage
          src={images[activeIndex]}
          alt={`${alt}, image ${activeIndex + 1} of ${Math.max(images.length, 1)}`}
          eager={eager}
          className="rounded-[var(--radius-card)] border border-[var(--border)]"
        />
        {showControls && (
          <>
            <IconButton
              label="Show previous vehicle image"
              size="sm"
              onClick={showPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-[var(--surface-elevated)] shadow-[var(--shadow-subtle)]"
            >
              <HiChevronLeft className="h-5 w-5" aria-hidden="true" />
            </IconButton>
            <IconButton
              label="Show next vehicle image"
              size="sm"
              onClick={showNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[var(--surface-elevated)] shadow-[var(--shadow-subtle)]"
            >
              <HiChevronRight className="h-5 w-5" aria-hidden="true" />
            </IconButton>
            <span className="absolute bottom-2 right-2 rounded-[var(--radius-control)] bg-[var(--navigation)] px-2 py-1 text-xs font-medium text-[var(--navigation-text)]">
              {activeIndex + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {showControls && !compact && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Vehicle image thumbnails">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              aria-label={`Show vehicle image ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => setCurrentIndex(index)}
              className={`focus-ring shrink-0 overflow-hidden rounded-[var(--radius-control)] border bg-[var(--surface-subtle)] ${
                index === activeIndex ? 'border-[var(--primary)]' : 'border-[var(--border)]'
              }`}
            >
              <img src={image} alt="" className="h-16 w-24 object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
