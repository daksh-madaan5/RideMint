import React from 'react';
import { clsx } from 'clsx';
import { HiCheck, HiXMark } from 'react-icons/hi2';

import Modal from '@/components/ui/Modal';
import StarRating from '@/components/ui/StarRating';
import { formatPrice } from '@/utils/helpers';
import Button from '@/components/ui/Button';

export default function CompareModal({ cars = [], isOpen, onClose }) {
  if (!cars || cars.length < 2) return null;

  // Determine winners for specific metrics
  const getWinner = (metric) => {
    let bestVal = null;
    let bestIndex = -1;

    cars.forEach((car, index) => {
      let val = car[metric];
      if (val === undefined || val === null) return;
      
      if (metric === 'pricePerDay') {
        // Lower is better
        if (bestVal === null || val < bestVal) {
          bestVal = val;
          bestIndex = index;
        }
      } else if (['rating', 'seats'].includes(metric)) {
        // Higher is better
        if (bestVal === null || val > bestVal) {
          bestVal = val;
          bestIndex = index;
        }
      }
    });

    return bestIndex;
  };

  const winners = {
    pricePerDay: getWinner('pricePerDay'),
    rating: getWinner('rating'),
    seats: getWinner('seats'),
  };

  const attributes = [
    { key: 'pricePerDay', label: 'Price / Day', format: (v) => formatPrice(v) },
    { key: 'brand', label: 'Brand', format: (v) => v },
    { key: 'model', label: 'Model', format: (v) => v },
    { key: 'year', label: 'Year', format: (v) => v },
    { key: 'fuelType', label: 'Fuel', format: (v) => <span className="capitalize">{v}</span> },
    { key: 'transmission', label: 'Transmission', format: (v) => <span className="capitalize">{v}</span> },
    { key: 'seats', label: 'Seats', format: (v) => `${v} Seats` },
    { key: 'rating', label: 'Rating', format: (v) => <div className="flex items-center gap-1"><StarRating rating={v || 0} size="sm" /> <span className="text-sm">({v || 0})</span></div> },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title="Compare Cars">
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[600px]">
          {/* Header Row (Images & Titles) */}
          <div className="flex mb-6 gap-4">
            <div className="w-32 shrink-0"></div> {/* Empty space for labels */}
            {cars.map((car) => (
              <div key={car.id} className="flex-1 text-center">
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-3">
                  {car.images?.[0] ? (
                    <img src={car.images[0]} alt={car.model} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
                  )}
                </div>
                <h4 className="font-bold text-lg">{car.brand}</h4>
                <p className="text-sm text-gray-500">{car.model}</p>
              </div>
            ))}
          </div>

          {/* Comparison Rows */}
          <div className="space-y-0 text-sm md:text-base">
            {attributes.map((attr, idx) => (
              <div 
                key={attr.key} 
                className={clsx(
                  "flex items-center py-4 gap-4",
                  idx % 2 === 0 ? "bg-gray-50 dark:bg-gray-800/30 rounded-lg px-2" : "px-2"
                )}
              >
                <div className="w-32 shrink-0 font-medium text-gray-500 dark:text-gray-400">
                  {attr.label}
                </div>
                {cars.map((car, carIdx) => {
                  const isWinner = winners[attr.key] === carIdx;
                  return (
                    <div 
                      key={`${car.id}-${attr.key}`} 
                      className={clsx(
                        "flex-1 text-center font-medium",
                        isWinner ? "text-green-600 dark:text-green-400 flex items-center justify-center gap-1" : "text-gray-900 dark:text-white"
                      )}
                    >
                      {attr.format(car[attr.key])}
                      {isWinner && <HiCheck className="w-4 h-4" />}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end">
        <Button variant="outline" onClick={onClose}>Close Comparison</Button>
      </div>
    </Modal>
  );
}
