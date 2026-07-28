import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { 
  HiOutlineMapPin, 
  HiOutlineCalendar, 
  HiOutlineMagnifyingGlass, 
  HiOutlineSparkles,
  HiOutlineBolt,
  HiOutlineShieldCheck
} from 'react-icons/hi2';

const CATEGORIES = [
  { label: 'All Fleets', value: '' },
  { label: 'SUVs & 4x4', value: 'SUV' },
  { label: 'Luxury Class', value: 'Luxury' },
  { label: 'EV & Hybrid', value: 'Electric' },
  { label: 'Sports Coupe', value: 'Petrol' }
];

export default function HeroSection() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('San Francisco, CA');
  const [pickupDate, setPickupDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set('search', location.split(',')[0]);
    navigate(`/cars?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center pt-24 pb-16 overflow-hidden bg-surface-50 dark:bg-surface-950">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-60"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center">
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 text-xs font-semibold text-surface-700 dark:text-surface-300 mb-6 shadow-xs"
        >
          <HiOutlineSparkles className="w-4 h-4 text-emerald-500" />
          <span>Self-Drive Car Rentals & Supercar Fleet</span>
        </motion.div>

        {/* Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-heading font-bold text-center text-surface-900 dark:text-surface-50 tracking-tight leading-[1.1] mb-4 max-w-4xl"
        >
          Never Stop Driving. <br className="hidden sm:inline" />
          <span className="text-emerald-600 dark:text-emerald-400">Rent Supercars Anywhere.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-base sm:text-xl text-center text-surface-600 dark:text-surface-400 max-w-2xl mb-10 leading-relaxed"
        >
          Book self-drive luxury cars by the hour or day. Unlimited miles, zero deposit, and keyless delivery.
        </motion.p>

        {/* Zoomcar-Inspired Interactive Search Bar */}
        <motion.form 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSearch}
          className="w-full max-w-4xl bg-white dark:bg-surface-900 rounded-3xl border border-surface-200 dark:border-surface-800 shadow-card p-3 sm:p-4 mb-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 divide-y md:divide-y-0 md:divide-x divide-surface-200 dark:divide-surface-800">
            {/* Pick-up City */}
            <div className="flex items-center gap-3 p-3">
              <HiOutlineMapPin className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-surface-500 mb-0.5">
                  Pick-up Location
                </label>
                <select 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-surface-900 dark:text-surface-100 focus:outline-none cursor-pointer"
                >
                  <option value="San Francisco, CA" className="bg-white dark:bg-surface-900">San Francisco, CA</option>
                  <option value="Los Angeles, CA" className="bg-white dark:bg-surface-900">Los Angeles, CA</option>
                  <option value="New York, NY" className="bg-white dark:bg-surface-900">New York, NY</option>
                  <option value="Miami, FL" className="bg-white dark:bg-surface-900">Miami, FL</option>
                  <option value="Chicago, IL" className="bg-white dark:bg-surface-900">Chicago, IL</option>
                </select>
              </div>
            </div>

            {/* Start Date */}
            <div className="flex items-center gap-3 p-3 pt-4 md:pt-3">
              <HiOutlineCalendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-surface-500 mb-0.5">
                  Start Date
                </label>
                <input 
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-surface-900 dark:text-surface-100 focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* End Date & Submit CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-3 p-3 pt-4 md:pt-3">
              <div className="flex items-center gap-3 flex-1 min-w-0 w-full sm:w-auto">
                <HiOutlineCalendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-surface-500 mb-0.5">
                    End Date
                  </label>
                  <input 
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-surface-900 dark:text-surface-100 focus:outline-none cursor-pointer"
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-2xl transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <HiOutlineMagnifyingGlass className="w-4 h-4 stroke-2" />
                <span>Find Cars</span>
              </button>
            </div>
          </div>
        </motion.form>

        {/* Category Quick Chips */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mb-12"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() => navigate(cat.value ? `/cars?fuelType=${cat.value}` : '/cars')}
              className="px-4 py-2 rounded-full bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 text-xs sm:text-sm font-semibold text-surface-700 dark:text-surface-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all shadow-xs cursor-pointer"
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Trust Badges */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full text-center"
        >
          <div className="flex items-center justify-center gap-3 p-3 rounded-2xl bg-white/60 dark:bg-surface-900/60 border border-surface-200/60 dark:border-surface-800/60">
            <HiOutlineBolt className="w-5 h-5 text-emerald-500" />
            <span className="text-xs sm:text-sm font-semibold text-surface-800 dark:text-surface-200">Instant Keyless Unlock</span>
          </div>
          <div className="flex items-center justify-center gap-3 p-3 rounded-2xl bg-white/60 dark:bg-surface-900/60 border border-surface-200/60 dark:border-surface-800/60">
            <HiOutlineShieldCheck className="w-5 h-5 text-emerald-500" />
            <span className="text-xs sm:text-sm font-semibold text-surface-800 dark:text-surface-200">Full Comprehensive Cover</span>
          </div>
          <div className="flex items-center justify-center gap-3 p-3 rounded-2xl bg-white/60 dark:bg-surface-900/60 border border-surface-200/60 dark:border-surface-800/60">
            <HiOutlineSparkles className="w-5 h-5 text-emerald-500" />
            <span className="text-xs sm:text-sm font-semibold text-surface-800 dark:text-surface-200">Zero Security Deposit</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
