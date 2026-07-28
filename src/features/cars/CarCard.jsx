import { Link } from 'react-router';
import { motion } from 'motion/react';
import { 
  HiOutlineHeart, 
  HiHeart, 
  HiStar, 
  HiOutlineUserGroup, 
  HiOutlineAdjustmentsHorizontal, 
  HiOutlineMapPin,
  HiOutlineCheckCircle
} from 'react-icons/hi2';
import Button from '@/components/ui/Button';
import { formatPrice, getCarImage, getCarFuel } from '@/utils/helpers';
import { useAuth } from '@/hooks/useAuth';

export default function CarCard({ car, onFavoriteToggle, isFavorite = false }) {
  const { user } = useAuth();
  const carImage = getCarImage(car);
  const fuelType = getCarFuel(car);

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group bg-white dark:bg-surface-900 rounded-3xl border border-surface-200 dark:border-surface-800 shadow-card hover:shadow-card-hover overflow-hidden transition-all duration-300 flex flex-col h-full"
    >
      {/* Car Image & Badges Banner */}
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-100 dark:bg-surface-800">
        <img 
          src={carImage} 
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Zoomcar-Style Rating Overlay (Top Left) */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 bg-surface-950/85 backdrop-blur-md text-xs font-semibold rounded-full shadow-sm text-white border border-white/10">
          <HiStar className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
          <span>{car.rating || '4.8'}</span>
          <span className="text-surface-400 text-[10px]">({car.reviewCount || 34}+ trips)</span>
        </div>

        {/* Favorite Button (Top Right) */}
        {user && onFavoriteToggle && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onFavoriteToggle(car.id);
            }}
            aria-label="Toggle Favorite"
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-surface-900/90 backdrop-blur-md shadow-xs hover:bg-white dark:hover:bg-surface-800 transition-colors cursor-pointer"
          >
            {isFavorite ? (
              <HiHeart className="h-5 w-5 text-red-500 fill-red-500" />
            ) : (
              <HiOutlineHeart className="h-5 w-5 text-surface-600 dark:text-surface-300" />
            )}
          </button>
        )}

        {/* Fuel Badge (Bottom Left) */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2.5 py-0.5 bg-white/90 dark:bg-surface-900/90 backdrop-blur-md text-[11px] font-semibold rounded-md shadow-xs text-surface-800 dark:text-surface-200 border border-surface-200/50 dark:border-surface-700/50">
            {fuelType}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        {/* Location Subtitle */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
          <HiOutlineMapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{car.location || 'San Francisco, CA'} · Free Delivery</span>
        </div>

        {/* Vehicle Title */}
        <h3 className="text-lg sm:text-xl font-heading font-bold text-surface-900 dark:text-surface-50 line-clamp-1 tracking-tight mb-2">
          {car.brand} {car.model} <span className="text-sm font-medium text-surface-400">({car.year})</span>
        </h3>

        {/* Spec Chips (Zoomcar Style) */}
        <div className="flex flex-wrap gap-2 my-3">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-surface-600 dark:text-surface-300 bg-surface-100 dark:bg-surface-800 px-2.5 py-1 rounded-md">
            <HiOutlineAdjustmentsHorizontal className="h-3.5 w-3.5 text-surface-400" />
            <span>{car.transmission || 'Automatic'}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-surface-600 dark:text-surface-300 bg-surface-100 dark:bg-surface-800 px-2.5 py-1 rounded-md">
            <HiOutlineUserGroup className="h-3.5 w-3.5 text-surface-400" />
            <span>{car.seats || 5} Seats</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-md">
            <HiOutlineCheckCircle className="h-3.5 w-3.5 text-emerald-500" />
            <span>Zero Deposit</span>
          </div>
        </div>

        {/* Price & Booking Footer */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-surface-100 dark:border-surface-800">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-heading font-bold text-surface-900 dark:text-surface-50">
                {formatPrice(car.pricePerDay || 0)}
              </span>
              <span className="text-xs font-medium text-surface-500 dark:text-surface-400">/day</span>
            </div>
            <p className="text-[10px] font-medium text-surface-400">Taxes included</p>
          </div>
          <Button 
            as={Link} 
            to={`/cars/${car.id}`} 
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
          >
            Book Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
