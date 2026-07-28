import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useQuery } from '@tanstack/react-query';
import { 
  HiOutlineHeart, 
  HiOutlineChevronRight,
  HiOutlineCheck,
  HiOutlineMapPin,
  HiOutlineCalendar,
  HiOutlineUserGroup,
  HiOutlineAdjustmentsHorizontal,
  HiStar
} from 'react-icons/hi2';
import { getCarById } from '@/firebase/cars';
import { getCarReviews } from '@/firebase/reviews';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import { formatPrice, getCarImages, getCarFuel } from '@/utils/helpers';

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeImage, setActiveImage] = useState(0);

  const { data: car, isLoading, error } = useQuery({
    queryKey: ['car', id],
    queryFn: () => getCarById(id)
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => getCarReviews(id),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950 pt-24 pb-12 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 bg-surface-200 dark:bg-surface-800 rounded w-1/3 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="h-[450px] bg-surface-200 dark:bg-surface-800 rounded-2xl" />
            <div className="space-y-6">
              <div className="h-12 bg-surface-200 dark:bg-surface-800 rounded w-3/4" />
              <div className="h-8 bg-surface-200 dark:bg-surface-800 rounded w-1/4" />
              <div className="h-32 bg-surface-200 dark:bg-surface-800 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950 px-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-4">Car not found</h2>
          <p className="text-surface-600 dark:text-surface-400 mb-6">The vehicle you are looking for does not exist or has been removed.</p>
          <Button onClick={() => navigate('/cars')}>Back to Catalog</Button>
        </div>
      </div>
    );
  }

  const carImages = getCarImages(car);
  const fuelType = getCarFuel(car);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-surface-50 dark:bg-surface-950 pt-24 pb-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-surface-500 dark:text-surface-400 mb-8 font-medium">
          <Link to="/" className="hover:text-surface-900 dark:hover:text-surface-100 transition-colors">Home</Link>
          <HiOutlineChevronRight className="h-4 w-4 mx-2 text-surface-400" />
          <Link to="/cars" className="hover:text-surface-900 dark:hover:text-surface-100 transition-colors">Cars</Link>
          <HiOutlineChevronRight className="h-4 w-4 mx-2 text-surface-400" />
          <span className="text-surface-900 dark:text-surface-100 font-semibold">{car.brand} {car.model}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-surface-100 dark:bg-surface-900 relative border border-surface-200 dark:border-surface-800 shadow-card">
              <img 
                src={carImages[activeImage] || carImages[0]} 
                alt={`${car.brand} ${car.model}`}
                className="w-full h-full object-cover transition-all duration-300"
              />
              
              {!car.available && (
                <div className="absolute top-4 left-4 bg-danger text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md uppercase tracking-wider">
                  Currently Rented
                </div>
              )}
            </div>
            
            {carImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {carImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImage === idx 
                        ? 'border-primary-900 dark:border-surface-100 shadow-sm' 
                        : 'border-surface-200 dark:border-surface-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Vehicle Info */}
          <div>
            <div className="flex justify-between items-start mb-4 gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-heading font-bold text-surface-900 dark:text-surface-50 tracking-tight mb-2">
                  {car.brand} {car.model}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-surface-600 dark:text-surface-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <HiStar className="h-5 w-5 text-amber-500" />
                    <span className="font-semibold text-surface-900 dark:text-surface-100">{car.rating || '4.5'}</span>
                    <span>({reviews.length} reviews)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <HiOutlineMapPin className="h-5 w-5 text-surface-400" />
                    {car.location || 'San Francisco, CA'}
                  </span>
                </div>
              </div>
              <button 
                aria-label="Toggle Favorite"
                className="p-3 bg-white dark:bg-surface-900 rounded-full shadow-subtle border border-surface-200 dark:border-surface-800 text-surface-600 dark:text-surface-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                <HiOutlineHeart className="h-5 w-5" />
              </button>
            </div>

            {/* Price Box */}
            <div className="my-6 py-6 border-y border-surface-200 dark:border-surface-800">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl sm:text-4xl font-heading font-bold text-surface-900 dark:text-surface-50">
                  {formatPrice(car.pricePerDay || 0)}
                </span>
                <span className="text-sm font-medium text-surface-500 dark:text-surface-400">/ day</span>
              </div>
              <p className="text-xs text-surface-500 dark:text-surface-400">Includes taxes & free cancellation up to 48h before pickup.</p>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              <div className="bg-white dark:bg-surface-900 p-4 rounded-xl border border-surface-200 dark:border-surface-800 flex flex-col items-center justify-center text-center">
                <HiOutlineCalendar className="h-5 w-5 text-surface-500 mb-1" />
                <span className="text-xs text-surface-500 font-medium">Year</span>
                <span className="font-semibold text-surface-900 dark:text-surface-100">{car.year}</span>
              </div>
              <div className="bg-white dark:bg-surface-900 p-4 rounded-xl border border-surface-200 dark:border-surface-800 flex flex-col items-center justify-center text-center">
                <HiOutlineUserGroup className="h-5 w-5 text-surface-500 mb-1" />
                <span className="text-xs text-surface-500 font-medium">Capacity</span>
                <span className="font-semibold text-surface-900 dark:text-surface-100">{car.seats || 4} Seats</span>
              </div>
              <div className="bg-white dark:bg-surface-900 p-4 rounded-xl border border-surface-200 dark:border-surface-800 flex flex-col items-center justify-center text-center">
                <HiOutlineAdjustmentsHorizontal className="h-5 w-5 text-surface-500 mb-1" />
                <span className="text-xs text-surface-500 font-medium">Transmission</span>
                <span className="font-semibold text-surface-900 dark:text-surface-100">{car.transmission || 'Automatic'}</span>
              </div>
              <div className="bg-white dark:bg-surface-900 p-4 rounded-xl border border-surface-200 dark:border-surface-800 flex flex-col items-center justify-center text-center">
                <span className="text-base font-bold text-surface-500 mb-1">⛽</span>
                <span className="text-xs text-surface-500 font-medium">Fuel Type</span>
                <span className="font-semibold text-surface-900 dark:text-surface-100">{fuelType}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-heading font-bold text-surface-900 dark:text-surface-50 mb-2">About Vehicle</h3>
              <p className="text-surface-600 dark:text-surface-400 text-sm leading-relaxed">
                {car.description || `Experience the thrill of driving the ${car.brand} ${car.model}. This premium vehicle offers unmatched comfort, advanced safety features, and incredible performance.`}
              </p>
            </div>

            {/* Features List */}
            <div className="mb-8">
              <h3 className="text-lg font-heading font-bold text-surface-900 dark:text-surface-50 mb-3">Key Features</h3>
              <div className="grid grid-cols-2 gap-3">
                {(car.features || ['Bluetooth', 'Backup Camera', 'Leather Seats', 'Navigation System', 'Apple CarPlay', 'Heated Seats']).map((feature, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-surface-700 dark:text-surface-300">
                    <div className="h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <HiOutlineCheck className="h-3 w-3" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking CTA */}
            <div className="flex gap-4">
              <Button 
                as={Link} 
                to={`/booking/${car.id}`} 
                size="lg" 
                fullWidth
                disabled={!car.available}
              >
                {car.available ? 'Rent This Vehicle' : 'Currently Unavailable'}
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 pt-12 border-t border-surface-200 dark:border-surface-800">
          <h2 className="text-2xl font-heading font-bold text-surface-900 dark:text-surface-50 mb-6">Customer Reviews</h2>
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white dark:bg-surface-900 p-6 rounded-2xl border border-surface-200 dark:border-surface-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center font-bold text-surface-700 dark:text-surface-300">
                        {review.userName?.[0] || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-surface-900 dark:text-surface-100 text-sm">{review.userName || 'User'}</p>
                        <p className="text-xs text-surface-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <HiStar key={i} className={`h-4 w-4 ${i < review.rating ? '' : 'text-surface-300 dark:text-surface-700'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-surface-600 dark:text-surface-400 text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-surface-900 p-8 rounded-2xl text-center border border-surface-200 dark:border-surface-800 max-w-lg mx-auto">
              <p className="text-surface-500 dark:text-surface-400 text-sm mb-4">No reviews yet for this vehicle.</p>
              {user ? (
                <Button variant="outline" size="sm">Write First Review</Button>
              ) : (
                <p className="text-xs text-surface-500"><Link to="/login" className="text-primary-600 underline">Log in</Link> to share your review.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
