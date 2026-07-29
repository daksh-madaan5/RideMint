import { useEffect, useRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { addDays, format, startOfDay } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';
import { HiCalendarDays } from 'react-icons/hi2';
import 'react-day-picker/style.css';

export default function DateRangePicker({
  pickupDate,
  returnDate,
  onPickupChange,
  onReturnChange,
  maxRentalDays = 30,
  disabled = false,
}) {
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
  const latestReturnDate = addDays(pickupDate || today, maxRentalDays);

  const handleSelect = (range) => {
    if (disabled) return;
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
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`Choose rental dates. Pickup ${pickupText}. Return ${returnText}.`}
        className={clsx(
          'focus-ring flex w-full overflow-hidden rounded-[var(--radius-control)] border text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60',
          isOpen 
            ? 'border-[var(--primary)] bg-[var(--surface)]'
            : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)]'
        )}
      >
        <div className="flex flex-1 flex-col justify-center px-4 py-3 sm:px-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Pickup</span>
          <div className="mt-1 flex items-center text-sm font-medium text-[var(--text-primary)]">
            <HiCalendarDays className="mr-2 h-5 w-5 text-[var(--primary)]" aria-hidden="true" />
            {pickupText}
          </div>
        </div>
        <div className="w-px bg-[var(--border)]" />
        <div className="flex flex-1 flex-col justify-center px-4 py-3 sm:px-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Return</span>
          <div className="mt-1 flex items-center text-sm font-medium text-[var(--text-primary)]">
            <HiCalendarDays className="mr-2 h-5 w-5 text-[var(--primary)]" aria-hidden="true" />
            {returnText}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full z-50 mt-2 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-raised)]"
            role="dialog"
            aria-label="Rental date calendar"
          >
            <style>{`
              .rdp-root {
                --rdp-accent-color: var(--primary);
                --rdp-background-color: var(--primary-subtle);
                --rdp-outline: 2px solid var(--rdp-accent-color);
                --rdp-outline-selected: 2px solid var(--text-primary);
                margin: 0;
              }
            `}</style>
            <DayPicker
              mode="range"
              selected={{ from: pickupDate, to: returnDate }}
              onSelect={handleSelect}
              disabled={[
                { before: today },
                { after: latestReturnDate },
              ]}
              modifiers={{
                start: pickupDate,
                end: returnDate,
              }}
              className="rdp-root"
              autoFocus
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
