import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';
import { HiMagnifyingGlass, HiXMark } from 'react-icons/hi2';

export default function SearchBar({ value, onChange, onSearch, placeholder = 'Search...', suggestions = [] }) {
  const [localValue, setLocalValue] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (onChange) onChange(localValue);
    }, 300);
    return () => clearTimeout(handler);
  }, [localValue, onChange]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    setLocalValue('');
    if (onChange) onChange('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(localValue);
      setIsFocused(false);
    }
  };

  const showSuggestions = isFocused && localValue.length > 0 && suggestions.length > 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      <div className={clsx(
        "relative flex w-full items-center overflow-hidden rounded-2xl border transition-all duration-300",
        isFocused 
          ? "border-indigo-500 bg-white shadow-lg ring-4 ring-indigo-500/10 dark:border-indigo-500 dark:bg-gray-900" 
          : "border-gray-200 bg-gray-50 hover:bg-white dark:border-gray-800 dark:bg-gray-900/50 dark:hover:bg-gray-900"
      )}>
        <div className="flex h-12 w-12 items-center justify-center text-gray-400">
          <HiMagnifyingGlass className="h-5 w-5" />
        </div>
        <input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="h-12 flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-500 focus:outline-none dark:text-white"
        />
        <AnimatePresence>
          {localValue && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="mr-2 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            >
              <HiXMark className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white/90 shadow-xl backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/90"
          >
            <ul className="max-h-72 overflow-y-auto py-2">
              {suggestions.map((suggestion, index) => (
                <li key={index}>
                  <button
                    onClick={() => {
                      setLocalValue(suggestion);
                      if (onSearch) onSearch(suggestion);
                      setIsFocused(false);
                    }}
                    className="flex w-full items-center px-4 py-3 text-left text-sm text-gray-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                  >
                    <HiMagnifyingGlass className="mr-3 h-4 w-4 text-gray-400" />
                    {suggestion}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
