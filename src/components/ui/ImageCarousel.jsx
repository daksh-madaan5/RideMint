import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';
import { HiChevronLeft, HiChevronRight, HiPhoto } from 'react-icons/hi2';

export default function ImageCarousel({ images = [], alt = 'Image' }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState({});

  if (!images || images.length === 0) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800 sm:h-96">
        <HiPhoto className="mb-2 h-12 w-12" />
        <span className="text-sm">No images available</span>
      </div>
    );
  }

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  const handleImageError = (index) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-900 sm:aspect-[16/9]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 h-full w-full"
          >
            {imageErrors[currentIndex] ? (
              <div className="flex h-full w-full flex-col items-center justify-center bg-gray-200 text-gray-400 dark:bg-gray-800">
                <HiPhoto className="mb-2 h-12 w-12" />
                <span className="text-sm">Image failed to load</span>
              </div>
            ) : (
              <img
                src={images[currentIndex]}
                alt={`${alt} - view ${currentIndex + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
                onError={() => handleImageError(currentIndex)}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 opacity-0 shadow-lg backdrop-blur-sm transition-all hover:bg-white group-hover:opacity-100 dark:bg-black/50 dark:text-white dark:hover:bg-black/80"
              aria-label="Previous image"
            >
              <HiChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 opacity-0 shadow-lg backdrop-blur-sm transition-all hover:bg-white group-hover:opacity-100 dark:bg-black/50 dark:text-white dark:hover:bg-black/80"
              aria-label="Next image"
            >
              <HiChevronRight className="h-6 w-6" />
            </button>
            <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex w-full gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={clsx(
                'relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-xl transition-all',
                currentIndex === idx ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-indigo-400 dark:ring-offset-gray-900' : 'opacity-70 hover:opacity-100'
              )}
            >
              {imageErrors[idx] ? (
                <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-800">
                  <HiPhoto className="h-6 w-6 text-gray-400" />
                </div>
              ) : (
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={() => handleImageError(idx)}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
