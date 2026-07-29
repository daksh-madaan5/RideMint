import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { toast } from 'react-toastify';
import { addDays } from 'date-fns';

import { getCarById } from '@/firebase/cars';
import { BOOKING_PREVIEW_MESSAGE } from '@/features/bookings/bookingMode';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import DateRangePicker from '@/components/ui/DateRangePicker';
import StarRating from '@/components/ui/StarRating';

import { formatPrice, calculateRentalDays } from '@/utils/helpers';

export default function Booking() {
  const { carId } = useParams();
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 1),
  });

  const { data: car, isLoading, error } = useQuery({
    queryKey: ['car', carId],
    queryFn: () => getCarById(carId),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-6 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        Error loading car details. Please try again.
      </div>
    );
  }

  const rentalDays = calculateRentalDays(dateRange.from, dateRange.to);
  const basePrice = rentalDays > 0 ? car.pricePerDay * rentalDays : 0;

  const handleConfirmBooking = () => {
    if (!dateRange.from || !dateRange.to) {
      toast.error('Please select valid pickup and return dates.');
      return;
    }
    if (rentalDays < 1) {
      toast.error('Minimum rental period is 1 day.');
      return;
    }

    toast.info(BOOKING_PREVIEW_MESSAGE);
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Explore Cars', path: '/cars' },
    { label: `${car.brand} ${car.model}`, path: `/cars/${car.id}` },
    { label: 'Booking', path: `/booking/${car.id}` },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <Breadcrumbs items={breadcrumbItems} className="mb-6" />
      
      <h1 className="text-3xl font-bold mb-2">Booking estimate</h1>
      <p className="mb-8 text-sm text-gray-600 dark:text-gray-400">
        Select dates to preview an estimated rental amount. No booking or availability hold will be created.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Summary & Dates */}
        <div className="space-y-6">
          <Card className="p-6 overflow-hidden">
            <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 mb-6">
              {car.images && car.images.length > 0 ? (
                <img 
                  src={car.images[0]} 
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-400">
                  No Image Available
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="text-2xl font-semibold">{car.brand} {car.model}</h2>
                <p className="text-gray-500 dark:text-gray-400">{car.year}</p>
              </div>
              <div className="text-right">
                <StarRating rating={car.rating || 0} size="sm" />
                <span className="text-sm text-gray-500">({car.reviewCount || 0} reviews)</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Select Dates</h3>
            <DateRangePicker 
              date={dateRange}
              onDateChange={setDateRange}
              minDate={new Date()}
              className="w-full"
            />
            {rentalDays > 0 && (
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Booking for {rentalDays} {rentalDays === 1 ? 'day' : 'days'}
              </p>
            )}
          </Card>
        </div>

        {/* Right Column: Price Breakdown */}
        <div>
          <Card className="p-6 sticky top-24">
            <h3 className="text-xl font-semibold mb-6">Estimated price</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>{formatPrice(car.pricePerDay)} × {rentalDays} {rentalDays === 1 ? 'day' : 'days'}</span>
                <span>{formatPrice(basePrice)}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-8">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Estimated total</span>
                <span className="text-primary-600 dark:text-primary-400">{formatPrice(basePrice)}</span>
              </div>
            </div>

            <Button 
              className="w-full py-4 text-lg"
              onClick={handleConfirmBooking}
              disabled={rentalDays < 1}
            >
              Booking preview only
            </Button>
            <p className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">
              {BOOKING_PREVIEW_MESSAGE}
            </p>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
