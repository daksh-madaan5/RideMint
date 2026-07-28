import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'motion/react';

import { getCarReviews, deleteReview } from '@/firebase/reviews';
import { useAuth } from '@/hooks/useAuth';

import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import Button from '@/components/ui/Button';
import StarRating from '@/components/ui/StarRating';
import Skeleton from '@/components/ui/Skeleton';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function ReviewSection({ carId }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews', carId],
    queryFn: () => getCarReviews(carId),
  });

  const deleteMutation = useMutation({
    mutationFn: (reviewId) => deleteReview(reviewId, carId),
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews', carId]);
      queryClient.invalidateQueries(['car', carId]); // Invalidate car to update average rating
      toast.success('Review deleted successfully');
      setReviewToDelete(null);
    },
    onError: () => {
      toast.error('Failed to delete review');
      setReviewToDelete(null);
    }
  });

  const hasUserReviewed = reviews.some(r => r.userId === user?.uid);
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const getRatingCount = (stars) => reviews.filter(r => r.rating === stars).length;

  const handleEdit = (review) => {
    setEditingReview(review);
    setIsWritingReview(true);
  };

  const handleFormSuccess = () => {
    setIsWritingReview(false);
    setEditingReview(null);
    queryClient.invalidateQueries(['reviews', carId]);
    queryClient.invalidateQueries(['car', carId]);
  };

  const confirmDelete = () => {
    if (reviewToDelete) {
      deleteMutation.mutate(reviewToDelete.id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
        <div className="flex flex-col items-center justify-center md:border-r border-gray-200 dark:border-gray-700">
          <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
            {averageRating}
          </div>
          <StarRating rating={Number(averageRating)} size="lg" className="mb-2" />
          <p className="text-gray-500">Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</p>
        </div>

        <div className="col-span-2 space-y-2">
          {[5, 4, 3, 2, 1].map(stars => {
            const count = getRatingCount(stars);
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={stars} className="flex items-center gap-4">
                <span className="w-16 text-sm text-gray-600 dark:text-gray-400 font-medium">{stars} stars</span>
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-10 text-sm text-gray-500 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Customer Reviews</h3>
        {user && !hasUserReviewed && !isWritingReview && (
          <Button onClick={() => setIsWritingReview(true)}>Write a Review</Button>
        )}
      </div>

      {/* Form Area */}
      <AnimatePresence>
        {isWritingReview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-1 pb-6">
              <ReviewForm 
                carId={carId} 
                existingReview={editingReview}
                onSuccess={handleFormSuccess}
                onCancel={() => {
                  setIsWritingReview(false);
                  setEditingReview(null);
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-gray-500 mb-4">No reviews yet for this car.</p>
            {user && !isWritingReview && (
              <Button variant="outline" onClick={() => setIsWritingReview(true)}>
                Be the first to review
              </Button>
            )}
          </div>
        ) : (
          reviews.map(review => (
            <ReviewCard 
              key={review.id} 
              review={review} 
              currentUserId={user?.uid}
              onEdit={() => handleEdit(review)}
              onDelete={() => setReviewToDelete(review)}
            />
          ))
        )}
      </div>

      <ConfirmDialog
        isOpen={!!reviewToDelete}
        onClose={() => setReviewToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete Review"
        confirmVariant="danger"
      />
    </div>
  );
}
