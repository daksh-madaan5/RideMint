import React, { useState } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import clsx from 'clsx';

export const StarRating = ({
  rating = 0,
  max = 5,
  mode = 'display',
  onChange,
  reviewCount,
  showLabel = false,
  className,
  size = 'md'
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const currentRating = hoverRating || rating;

  const sizeClasses = {
    sm: 'text-sm gap-0.5',
    md: 'text-base gap-1',
    lg: 'text-xl gap-1',
  };

  const handleMouseEnter = (index) => {
    if (mode === 'input') setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (mode === 'input') setHoverRating(0);
  };

  const handleClick = (index) => {
    if (mode === 'input' && onChange) {
      onChange(index);
    }
  };

  return (
    <div className={clsx("flex items-center", className)}>
      <div 
        className={clsx("flex text-[#fbbf24]", sizeClasses[size], mode === 'input' && "cursor-pointer")}
        onMouseLeave={handleMouseLeave}
      >
        {Array.from({ length: max }).map((_, i) => {
          const index = i + 1;
          return (
            <div
              key={i}
              onMouseEnter={() => handleMouseEnter(index)}
              onClick={() => handleClick(index)}
              className={clsx("transition-transform", mode === 'input' && "hover:scale-110")}
            >
              {currentRating >= index ? (
                <FaStar />
              ) : currentRating >= index - 0.5 ? (
                <FaStarHalfAlt />
              ) : (
                <FaRegStar />
              )}
            </div>
          );
        })}
      </div>
      
      {(showLabel || reviewCount !== undefined) && (
        <div className="ml-2 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          {showLabel && <span className="font-medium text-gray-700 dark:text-gray-300">{rating.toFixed(1)}</span>}
          {reviewCount !== undefined && <span>({reviewCount})</span>}
        </div>
      )}
    </div>
  );
};

export default StarRating;
