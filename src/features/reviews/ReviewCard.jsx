import React from 'react';
import { motion } from 'motion/react';
import { HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2';

import StarRating from '@/components/ui/StarRating';
import { formatDate, getInitials } from '@/utils/helpers';

export default function ReviewCard({ review, currentUserId, onEdit, onDelete }) {
  const isOwner = currentUserId === review.userId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow relative group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold overflow-hidden shrink-0">
            {review.userSnapshot?.avatar ? (
              <img src={review.userSnapshot.avatar} alt={review.userSnapshot.name} className="w-full h-full object-cover" />
            ) : (
              getInitials(review.userSnapshot?.name || 'Anonymous')
            )}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {review.userSnapshot?.name || 'Anonymous User'}
            </h4>
            <div className="text-xs text-gray-500 mt-0.5">
              {formatDate(review.createdAt)}
              {review.updatedAt && review.updatedAt !== review.createdAt && ' (edited)'}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <StarRating rating={review.rating} size="sm" />
          
          {isOwner && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={onEdit}
                className="p-1.5 text-gray-500 hover:text-primary-600 bg-gray-100 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-md transition-colors"
                title="Edit Review"
              >
                <HiOutlinePencilSquare className="w-4 h-4" />
              </button>
              <button 
                onClick={onDelete}
                className="p-1.5 text-gray-500 hover:text-red-600 bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
                title="Delete Review"
              >
                <HiOutlineTrash className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
        {review.comment}
      </p>
    </motion.div>
  );
}
