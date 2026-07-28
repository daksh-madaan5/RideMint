import React from 'react';
import { Link, useLocation } from 'react-router';
import { HiChevronRight, HiHome } from 'react-icons/hi2';
import clsx from 'clsx';

export const Breadcrumbs = ({ items, className }) => {
  const location = useLocation();
  
  const pathnames = location.pathname.split('/').filter((x) => x);
  
  const breadcrumbItems = items || [
    { label: <HiHome className="h-4 w-4" />, path: '/' },
    ...pathnames.map((name, index) => {
      const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
      const label = name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
      return { label, path: routeTo };
    })
  ];

  return (
    <nav className={clsx("flex", className)} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          return (
            <li key={item.path} className="inline-flex items-center">
              {index > 0 && (
                <HiChevronRight className="mx-1 h-4 w-4 text-gray-400 md:mx-2" />
              )}
              {isLast ? (
                <span className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
