import { motion } from 'motion/react';
import { Link } from 'react-router';

const brands = [
  'BMW', 'Mercedes-Benz', 'Audi', 'Tesla', 'Porsche', 'Toyota', 
  'Lamborghini', 'Ferrari', 'Range Rover', 'Volvo', 'Honda', 'Ford'
];

export default function PopularBrands() {
  return (
    <section className="py-20 lg:py-32 bg-surface-900 border-y border-surface-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-white">Popular Brands</h2>
          <p className="text-surface-400 text-lg mt-4 max-w-2xl mx-auto">Browse our collection by your favorite manufacturers</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {brands.map((brand, i) => (
            <Link 
              key={brand} 
              to={`/cars?brand=${brand}`}
              className="group block"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-surface-950 border border-surface-800 group-hover:border-primary-500/50 rounded-2xl p-6 text-center transition-all duration-300 relative overflow-hidden h-full flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/5 transition-colors"></div>
                <span className="text-lg font-bold font-heading text-surface-300 group-hover:text-white transition-colors relative z-10 group-hover:drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]">
                  {brand}
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
