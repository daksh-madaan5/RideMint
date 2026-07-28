import React, { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, startOfDay } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';
import { HiCalendarDays } from 'react-icons/hi2';
import 'react-day-picker/style.css';

export default function DateRangePicker({ pickupDate, returnDate, onPickupChange, onReturnChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const today = startOfDay(new Date());

  const handleSelect = (range) => {
    if (!range) {
      onPickupChange(undefined);
      onReturnChange(undefined);
      return;
    }
    
    if (range.from) {
      onPickupChange(range.from);
    }
    
    if (range.to) {
      onReturnChange(range.to);
      setIsOpen(false);
    } else {
      onReturnChange(undefined);
    }
  };

  const displayFormat = 'MMM dd, yyyy';
  const pickupText = pickupDate ? format(pickupDate, displayFormat) : 'Add dates';
  const returnText = returnDate ? format(returnDate, displayFormat) : 'Add dates';

  return (
    <div ref={containerRef} className="relative w-full max-w-lg">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "flex cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300",
          isOpen 
            ? "border-indigo-500 bg-white shadow-lg ring-4 ring-indigo-500/10 dark:border-indigo-500 dark:bg-gray-900" 
            : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600"
        )}
      >
        <div className="flex flex-1 flex-col justify-center px-4 py-3 sm:px-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Pickup</span>
          <div className="mt-1 flex items-center text-sm font-medium text-gray-900 dark:text-gray-100">
            <HiCalendarDays className="mr-2 h-5 w-5 text-gray-400" />
            {pickupText}
          </div>
        </div>
        <div className="w-px bg-gray-200 dark:bg-gray-700" />
        <div className="flex flex-1 flex-col justify-center px-4 py-3 sm:px-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Return</span>
          <div className="mt-1 flex items-center text-sm font-medium text-gray-900 dark:text-gray-100">
            <HiCalendarDays className="mr-2 h-5 w-5 text-gray-400" />
            {returnText}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full z-50 mt-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-900"
          >
            <style>{`
              .rdp-root {
                --rdp-accent-color: #6366f1; /* indigo-500 */
                --rdp-background-color: #e0e7ff; /* indigo-100 */
                --rdp-accent-color-dark: #4f46e5; /* indigo-600 */
                --rdp-background-color-dark: #3730a3; /* indigo-800 */
                --rdp-outline: 2px solid var(--rdp-accent-color);
                --rdp-outline-selected: 2px solid rgba(0, 0, 0, 0.75);
                margin: 0;
              }
              .dark .rdp-root {
                --rdp-accent-color: #818cf8; /* indigo-400 */
                --rdp-background-color: #312e81; /* indigo-900 */
              }
            `}</style>
            <DayPicker
              mode="range"
              selected={{ from: pickupDate, to: returnDate }}
              onSelect={handleSelect}
              disabled={[
                { before: today }
              ]}
              modifiers={{
                start: pickupDate,
                end: returnDate,
              }}
              className="rdp-root"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
