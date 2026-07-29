import { useEffect, useId, useRef, useState } from 'react';
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
  const [activeField, setActiveField] = useState('pickup');
  const containerRef = useRef(null);
  const pickupButtonRef = useRef(null);
  const returnButtonRef = useRef(null);
  const calendarId = useId();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key !== 'Escape') return;
      setIsOpen(false);
      const activeButton = activeField === 'pickup' ? pickupButtonRef : returnButtonRef;
      activeButton.current?.focus();
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [activeField]);

  const today = startOfDay(new Date());
  const latestReturnDate = addDays(pickupDate || today, maxRentalDays);

  const openCalendar = (field) => {
    setActiveField(field);
    setIsOpen(true);
  };

  const handleSelect = (_range, selectedDate) => {
    if (disabled) return;

    if (activeField === 'pickup') {
      onPickupChange(selectedDate);
      const returnRemainsValid = returnDate
        && returnDate > selectedDate
        && returnDate <= addDays(selectedDate, maxRentalDays);
      if (!returnRemainsValid) onReturnChange(undefined);
      setActiveField('return');
      return;
    }

    onReturnChange(selectedDate);
    setIsOpen(false);
    returnButtonRef.current?.focus();
  };

  const displayFormat = 'MMM dd, yyyy';
  const pickupText = pickupDate ? format(pickupDate, displayFormat) : 'Add dates';
  const returnText = returnDate ? format(returnDate, displayFormat) : 'Add dates';

  return (
    <div ref={containerRef} className="relative w-full max-w-lg">
      <div
        className={clsx(
          'flex w-full overflow-hidden rounded-[var(--radius-control)] border bg-[var(--surface)] transition-colors',
          disabled && 'opacity-60',
          isOpen
            ? 'border-[var(--primary)] bg-[var(--surface)]'
            : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)]'
        )}
      >
        <button
          ref={pickupButtonRef}
          type="button"
          onClick={() => openCalendar('pickup')}
          disabled={disabled}
          aria-expanded={isOpen && activeField === 'pickup'}
          aria-haspopup="dialog"
          aria-controls={calendarId}
          aria-label={`Choose pickup date. Current pickup ${pickupText}.`}
          className={clsx(
            'focus-ring flex flex-1 flex-col justify-center px-4 py-3 text-left transition-colors disabled:cursor-not-allowed sm:px-6',
            isOpen && activeField === 'pickup' && 'bg-[var(--primary-subtle)]'
          )}
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Pickup</span>
          <div className="mt-1 flex items-center text-sm font-medium text-[var(--text-primary)]">
            <HiCalendarDays className="mr-2 h-5 w-5 text-[var(--primary)]" aria-hidden="true" />
            {pickupText}
          </div>
        </button>
        <div className="w-px bg-[var(--border)]" />
        <button
          ref={returnButtonRef}
          type="button"
          onClick={() => openCalendar('return')}
          disabled={disabled}
          aria-expanded={isOpen && activeField === 'return'}
          aria-haspopup="dialog"
          aria-controls={calendarId}
          aria-label={`Choose return date. Current return ${returnText}.`}
          className={clsx(
            'focus-ring flex flex-1 flex-col justify-center px-4 py-3 text-left transition-colors disabled:cursor-not-allowed sm:px-6',
            isOpen && activeField === 'return' && 'bg-[var(--primary-subtle)]'
          )}
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Return</span>
          <div className="mt-1 flex items-center text-sm font-medium text-[var(--text-primary)]">
            <HiCalendarDays className="mr-2 h-5 w-5 text-[var(--primary)]" aria-hidden="true" />
            {returnText}
          </div>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={calendarId}
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
              key={activeField}
              mode="range"
              selected={{ from: pickupDate, to: returnDate }}
              onSelect={handleSelect}
              disabled={activeField === 'pickup'
                ? [{ before: today }]
                : [
                    { before: addDays(pickupDate || today, 1) },
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
