import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Link } from 'react-router';
import { HiStar } from 'react-icons/hi2';

const featuredCars = [
  { id: 1, brand: 'Tesla', model: 'Model S Plaid', price: 199, rating: 4.9, fuel: 'Electric', transmission: 'Auto' },
  { id: 2, brand: 'BMW', model: 'M8 Competition', price: 249, rating: 4.8, fuel: 'Petrol', transmission: 'Auto' },
  { id: 3, brand: 'Porsche', model: '911 Carrera', price: 299, rating: 5.0, fuel: 'Petrol', transmission: 'Auto' },
  { id: 4, brand: 'Mercedes-Benz', model: 'G-Class', price: 349, rating: 4.7, fuel: 'Petrol', transmission: 'Auto' },
  { id: 5, brand: 'Audi', model: 'RS e-tron GT', price: 229, rating: 4.9, fuel: 'Electric', transmission: 'Auto' },
  { id: 6, brand: 'Range Rover', model: 'Sport', price: 189, rating: 4.6, fuel: 'Hybrid', transmission: 'Auto' },
];

function FeaturedCarCard({ car }) {
  return (
    <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-3xl overflow-hidden hover:border-primary-500/30 transition-all duration-300 group shadow-sm">
      <div className="h-48 bg-surface-100 dark:bg-surface-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-surface-950/80 backdrop-blur px-2 py-1 rounded-full flex items-center gap-1 text-sm border border-surface-200 dark:border-white/10 shadow-sm">
          <HiStar className="text-yellow-500 w-4 h-4" />
          <span className="text-surface-900 dark:text-white font-medium">{car.rating}</span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-surface-900 dark:text-white flex items-center gap-2">
              {car.brand} {car.model}
            </h3>
            <div className="text-sm text-surface-500 flex gap-3 mt-1">
              <span>{car.fuel}</span>
              <span>•</span>
              <span>{car.transmission}</span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-end mt-6 pt-4 border-t border-surface-100 dark:border-surface-800">
          <div>
            <span className="text-2xl font-bold text-surface-900 dark:text-white">${car.price}</span>
            <span className="text-surface-500 text-sm">/day</span>
          </div>
          <Link to={`/cars/${car.id}`} className="px-4 py-2 bg-surface-100 dark:bg-white/5 hover:bg-primary-900 hover:text-white dark:hover:bg-primary-500 text-surface-900 dark:text-white text-sm font-medium rounded-full transition-colors border border-transparent">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedCars() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="py-20 lg:py-32 bg-surface-50 dark:bg-surface-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-surface-900 dark:text-white">Featured Vehicles</h2>
          <p className="text-surface-600 dark:text-surface-400 text-lg mt-4 max-w-2xl mx-auto">Hand-picked luxury cars for your next adventure</p>
        </div>

        <motion.div 
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featuredCars.map((car) => (
            <motion.div key={car.id} variants={itemVariants}>
              <FeaturedCarCard car={car} />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 text-center">
          <Link to="/cars" className="inline-flex items-center gap-2 px-8 py-3 bg-white dark:bg-surface-900 text-surface-900 dark:text-white border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 font-medium rounded-xl transition-colors shadow-sm">
            View All Cars
          </Link>
        </div>
      </div>
    </section>
  );
}
