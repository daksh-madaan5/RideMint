import React from 'react';
import { HiChevronLeft, HiChevronRight, HiEllipsisHorizontal } from 'react-icons/hi2';
import clsx from 'clsx';

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className
}) => {
  const getPages = () => {
    const delta = typeof window !== 'undefined' && window.innerWidth < 640 ? 1 : 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    range.forEach(i => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <nav className={clsx('flex items-center justify-center space-x-1', className)} aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
        aria-label="Previous page"
      >
        <HiChevronLeft className="h-5 w-5" />
      </button>
      
      {getPages().map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <div className="flex h-9 w-9 items-center justify-center text-gray-400">
              <HiEllipsisHorizontal className="h-5 w-5" />
            </div>
          ) : (
            <button
              onClick={() => onPageChange(page)}
              aria-current={currentPage === page ? 'page' : undefined}
              className={clsx(
                'flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors',
                currentPage === page
                  ? 'bg-primary text-white'
                  : 'border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
              )}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
        aria-label="Next page"
      >
        <HiChevronRight className="h-5 w-5" />
      </button>
    </nav>
  );
};

export default Pagination;
