import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { HiStar } from 'react-icons/hi2';
import { clsx } from 'clsx';

import { addReview, updateReview } from '@/firebase/reviews';
import { useAuth } from '@/hooks/useAuth';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function ReviewForm({ carId, existingReview, onSuccess, onCancel }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm({
    defaultValues: {
      comment: existingReview?.comment || '',
    }
  });

  const commentValue = watch('comment');

  const mutation = useMutation({
    mutationFn: (data) => {
      const reviewData = {
        rating,
        comment: data.comment,
        carId,
        userId: user.uid,
        userSnapshot: {
          name: user.displayName || 'Anonymous',
          avatar: user.photoURL || null,
        }
      };

      if (existingReview) {
        return updateReview(existingReview.id, reviewData, carId);
      }
      return addReview(reviewData);
    },
    onSuccess: () => {
      toast.success(existingReview ? 'Review updated!' : 'Review posted!');
      if (onSuccess) onSuccess();
    },
    onError: (err) => {
      toast.error('Failed to post review: ' + err.message);
    }
  });

  const onSubmit = (data) => {
    if (rating === 0) {
      toast.error('Please select a star rating');
      return;
    }
    mutation.mutate(data);
  };

  return (
    <Card className="p-6 border-primary-100 dark:border-primary-900">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col items-center sm:items-start gap-2 mb-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Your Rating
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="p-1 focus:outline-none transition-transform hover:scale-110"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
              >
                <HiStar 
                  className={clsx(
                    "w-8 h-8 transition-colors",
                    (hoveredRating || rating) >= star 
                      ? "text-yellow-400" 
                      : "text-gray-200 dark:text-gray-700"
                  )} 
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Your Review
          </label>
          <textarea
            id="comment"
            rows={4}
            className={clsx(
              "w-full rounded-lg border px-4 py-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:outline-none transition-shadow resize-y",
              errors.comment 
                ? "border-red-500 focus:ring-red-200 dark:focus:ring-red-900" 
                : "border-gray-300 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-100 dark:focus:border-primary-500 dark:focus:ring-primary-900/30"
            )}
            placeholder="Tell others about your experience with this car..."
            {...register('comment', { 
              required: 'Review comment is required',
              minLength: { value: 10, message: 'Review must be at least 10 characters' }
            })}
          />
          {errors.comment && (
            <p className="mt-1 text-sm text-red-500">{errors.comment.message}</p>
          )}
          <div className="mt-1 text-xs text-gray-500 text-right">
            {commentValue?.length || 0} characters
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            isLoading={mutation.isPending}
            disabled={rating === 0 || mutation.isPending}
          >
            {existingReview ? 'Update Review' : 'Post Review'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
