import { useState } from 'react';
import { HiOutlineMagnifyingGlass, HiOutlineXMark } from 'react-icons/hi2';
import Input from '@/components/ui/Input';
import { BRANDS, FUEL_TYPES, TRANSMISSION_TYPES } from '@/constants';
import { cn } from '@/utils/helpers';

export default function CarFilters({ filters, onFilterChange, onClear, className }) {
  const [localSearch, setLocalSearch] = useState(filters.search || '');

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setLocalSearch(val);
    onFilterChange({ ...filters, search: val });
  };

  const toggleBrand = (brand) => {
    const currentBrands = filters.brands || [];
    const newBrands = currentBrands.includes(brand)
      ? currentBrands.filter((b) => b !== brand)
      : [...currentBrands, brand];
    onFilterChange({ ...filters, brands: newBrands });
  };

  const activeFilterCount = Object.keys(filters).reduce((acc, key) => {
    if (key === 'brands' && filters[key]?.length > 0) return acc + 1;
    if (key !== 'brands' && filters[key]) return acc + 1;
    return acc;
  }, 0);

  return (
    <div className={cn("bg-white dark:bg-surface-900 rounded-3xl shadow-card border border-surface-200 dark:border-surface-800 p-6", className)}>
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-surface-100 dark:border-surface-800">
        <h3 className="text-lg font-heading font-bold text-surface-900 dark:text-surface-50">Filter Catalog</h3>
        {activeFilterCount > 0 && (
          <button 
            onClick={onClear}
            className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-2">
            Search Vehicle
          </label>
          <div className="relative">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
            <Input
              type="text"
              placeholder="Search model or brand..."
              value={localSearch}
              onChange={handleSearchChange}
              className="pl-9"
            />
          </div>
        </div>

        {/* Fuel Type */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-2">
            Fuel Type
          </label>
          <div className="flex flex-wrap gap-2">
            {FUEL_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => onFilterChange({ ...filters, fuelType: filters.fuelType === type ? null : type })}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer",
                  filters.fuelType === type
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                    : "bg-surface-50 dark:bg-surface-800 border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 hover:border-surface-300 dark:hover:border-surface-600"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Transmission */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-2">
            Transmission
          </label>
          <div className="grid grid-cols-2 gap-2">
            {TRANSMISSION_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => onFilterChange({ ...filters, transmission: filters.transmission === type ? null : type })}
                className={cn(
                  "px-3 py-2 rounded-xl text-xs font-semibold transition-all border text-center cursor-pointer",
                  filters.transmission === type
                    ? "bg-surface-900 dark:bg-surface-100 text-white dark:text-surface-900 border-surface-900 dark:border-surface-100 shadow-xs"
                    : "bg-surface-50 dark:bg-surface-800 border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Brands Checklist */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-2">
            Brand Manufacturer
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-hide">
            {BRANDS.map((brand) => (
              <label key={brand} className="flex items-center cursor-pointer group py-1">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={filters.brands?.includes(brand) || false}
                  onChange={() => toggleBrand(brand)}
                />
                <div className="h-4 w-4 rounded border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 peer-checked:bg-emerald-600 peer-checked:border-emerald-600 transition-all flex items-center justify-center shrink-0">
                  <HiOutlineXMark className="h-3 w-3 text-white opacity-0 peer-checked:opacity-100 stroke-2" />
                </div>
                <span className="ml-2.5 text-xs font-medium text-surface-600 dark:text-surface-400 group-hover:text-surface-900 dark:group-hover:text-surface-100 transition-colors">
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Available Only Switch */}
        <div className="flex items-center justify-between pt-2 border-t border-surface-100 dark:border-surface-800">
          <label className="text-xs font-semibold text-surface-700 dark:text-surface-300 cursor-pointer" htmlFor="availability">
            Show Available Only
          </label>
          <button
            id="availability"
            onClick={() => onFilterChange({ ...filters, availableOnly: !filters.availableOnly })}
            className={cn(
              "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
              filters.availableOnly ? "bg-emerald-600" : "bg-surface-300 dark:bg-surface-700"
            )}
          >
            <span
              className={cn(
                "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                filters.availableOnly ? "translate-x-4" : "translate-x-0"
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
