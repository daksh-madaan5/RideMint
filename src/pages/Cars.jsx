import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useQuery } from '@tanstack/react-query';
import { HiOutlineAdjustmentsHorizontal, HiOutlineViewColumns, HiOutlineBars4 } from 'react-icons/hi2';
import { getCars } from '@/firebase/cars';
import CarCard from '@/features/cars/CarCard';
import CarFilters from '@/features/cars/CarFilters';
import Button from '@/components/ui/Button';

export default function Cars() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [view, setView] = useState('grid');
  
  // Initialize filters from URL
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    brands: searchParams.getAll('brand') || [],
    fuelType: searchParams.get('fuelType') || null,
    transmission: searchParams.get('transmission') || null,
    availableOnly: searchParams.get('available') === 'true',
    sortBy: searchParams.get('sort') || 'recommended'
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.fuelType) params.set('fuelType', filters.fuelType);
    if (filters.transmission) params.set('transmission', filters.transmission);
    if (filters.availableOnly) params.set('available', 'true');
    if (filters.sortBy !== 'recommended') params.set('sort', filters.sortBy);
    filters.brands.forEach(brand => params.append('brand', brand));
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const { data: cars, isLoading } = useQuery({
    queryKey: ['cars', filters],
    queryFn: () => getCars(filters)
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      brands: [],
      fuelType: null,
      transmission: null,
      availableOnly: false,
      sortBy: 'recommended'
    });
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 md:mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-surface-900 dark:text-surface-50 tracking-tight mb-3"
          >
            Explore Our Fleet
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg text-surface-600 dark:text-surface-400 max-w-2xl leading-relaxed"
          >
            Find the perfect vehicle for your next journey. From high-performance coupes to luxury SUVs, choose your drive.
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24">
              <CarFilters 
                filters={filters} 
                onFilterChange={handleFilterChange} 
                onClear={clearFilters} 
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full">
            {/* Top Bar */}
            <div className="bg-white dark:bg-surface-900 rounded-2xl p-4 border border-surface-200 dark:border-surface-800 flex flex-wrap items-center justify-between gap-4 mb-8 shadow-sm">
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="lg:hidden flex items-center gap-2"
                  onClick={() => setIsMobileFiltersOpen(true)}
                >
                  <HiOutlineAdjustmentsHorizontal className="h-4 w-4" />
                  Filters
                </Button>
                <span className="text-sm text-surface-600 dark:text-surface-400 font-medium">
                  {isLoading ? 'Loading catalog...' : `${cars?.length || 0} vehicles available`}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <select 
                  className="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-surface-100 text-xs sm:text-sm rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 block px-3 py-2"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange({ ...filters, sortBy: e.target.value })}
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>

                <div className="hidden sm:flex items-center bg-surface-100 dark:bg-surface-800 p-1 rounded-xl">
                  <button 
                    onClick={() => setView('grid')}
                    aria-label="Grid view"
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${view === 'grid' ? 'bg-white dark:bg-surface-900 shadow-sm text-surface-900 dark:text-surface-100' : 'text-surface-500 hover:text-surface-900 dark:hover:text-surface-100'}`}
                  >
                    <HiOutlineViewColumns className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => setView('list')}
                    aria-label="List view"
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${view === 'list' ? 'bg-white dark:bg-surface-900 shadow-sm text-surface-900 dark:text-surface-100' : 'text-surface-500 hover:text-surface-900 dark:hover:text-surface-100'}`}
                  >
                    <HiOutlineBars4 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Grid */}
            {isLoading ? (
              <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white dark:bg-surface-900 rounded-2xl h-[380px] border border-surface-200 dark:border-surface-800" />
                ))}
              </div>
            ) : cars?.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 max-w-md mx-auto">
                <div className="text-5xl mb-3">🚗</div>
                <h3 className="text-lg font-heading font-bold text-surface-900 dark:text-surface-50 mb-1">No vehicles matched</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 mb-6">Try adjusting your filters or search keywords.</p>
                <Button onClick={clearFilters} variant="outline" size="sm">Reset All Filters</Button>
              </div>
            ) : (
              <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {cars?.map((car, index) => (
                  <motion.div
                    key={car.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <CarCard car={car} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-full max-w-xs bg-white dark:bg-surface-900 z-50 overflow-y-auto p-5 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-surface-200 dark:border-surface-800">
                <h2 className="text-lg font-heading font-bold text-surface-900 dark:text-surface-50">Filter Catalog</h2>
                <button onClick={() => setIsMobileFiltersOpen(false)} className="p-1 text-surface-400 hover:text-surface-900 dark:hover:text-surface-100 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              <CarFilters 
                filters={filters} 
                onFilterChange={handleFilterChange} 
                onClear={clearFilters} 
                className="border-none shadow-none px-0"
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
