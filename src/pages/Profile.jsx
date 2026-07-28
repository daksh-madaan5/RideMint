import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { HiOutlineUser, HiOutlineEnvelope, HiOutlineCalendar } from 'react-icons/hi2';

import { useAuth } from '@/hooks/useAuth';
import { getUserProfile, updateUserProfile } from '@/firebase/users';
import { getUserBookings } from '@/firebase/bookings';
import { getUserReviews } from '@/firebase/reviews';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Skeleton from '@/components/ui/Skeleton';
import { getInitials, formatDate, getCarImage } from '@/utils/helpers';

export default function Profile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile', user?.uid],
    queryFn: () => getUserProfile(user?.uid),
    enabled: !!user?.uid,
    onSuccess: (data) => {
      reset({ name: data?.name });
    }
  });

  const { data: bookings = [], isLoading: isBookingsLoading } = useQuery({
    queryKey: ['bookings', user?.uid],
    queryFn: () => getUserBookings(user?.uid),
    enabled: !!user?.uid,
  });

  const { data: reviews = [], isLoading: isReviewsLoading } = useQuery({
    queryKey: ['reviews', 'user', user?.uid],
    queryFn: () => getUserReviews(user?.uid),
    enabled: !!user?.uid,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data) => updateUserProfile(user.uid, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['profile', user?.uid]);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    },
    onError: () => {
      toast.error('Failed to update profile');
    }
  });

  const onSubmit = (data) => {
    updateProfileMutation.mutate(data);
  };

  const isLoading = isProfileLoading || isBookingsLoading || isReviewsLoading;
  const recentBookings = [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
  const favoritesCount = profile?.favorites?.length || 0;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <Skeleton className="h-48 w-full rounded-2xl mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-heading font-bold text-surface-900 dark:text-surface-50 tracking-tight mb-8">My Account</h1>

        {/* Profile Header */}
        <Card className="p-6 sm:p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-24 bg-surface-900 dark:bg-surface-800" />
          <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 pt-10">
            <div className="w-28 h-28 rounded-full bg-white dark:bg-surface-900 border-4 border-white dark:border-surface-900 shadow-card flex items-center justify-center text-3xl font-heading font-bold text-surface-900 dark:text-surface-100 overflow-hidden shrink-0">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                getInitials(profile?.name || user?.email || '?')
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-heading font-bold text-surface-900 dark:text-surface-50">{profile?.name || 'RideMint customer'}</h2>
              <div className="flex flex-col md:flex-row gap-2 md:gap-6 mt-2 text-sm text-surface-500 dark:text-surface-400 font-medium">
                <span className="flex items-center justify-center md:justify-start gap-1.5">
                  <HiOutlineEnvelope className="w-4 h-4 text-surface-400" />
                  {user?.email}
                </span>
                <span className="flex items-center justify-center md:justify-start gap-1.5">
                  <HiOutlineCalendar className="w-4 h-4 text-surface-400" />
                  Member since {formatDate(profile?.createdAt || user?.metadata?.creationTime)}
                </span>
              </div>
            </div>
            
            <Button 
              variant={isEditing ? 'outline' : 'secondary'}
              size="sm"
              onClick={() => {
                if (isEditing) {
                  reset({ name: profile?.name });
                  setIsEditing(false);
                } else {
                  setIsEditing(true);
                }
              }}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 text-center">
            <div className="text-3xl font-heading font-bold text-surface-900 dark:text-surface-50 mb-1">{bookings.length}</div>
            <div className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Total Bookings</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-heading font-bold text-surface-900 dark:text-surface-50 mb-1">{reviews.length}</div>
            <div className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Reviews Written</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-heading font-bold text-surface-900 dark:text-surface-50 mb-1">{favoritesCount}</div>
            <div className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Saved Favorites</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Edit Profile Form */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h3 className="text-lg font-heading font-bold text-surface-900 dark:text-surface-50 mb-4 flex items-center gap-2">
                <HiOutlineUser className="w-5 h-5 text-surface-500" /> Personal Details
              </h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Full Name"
                  {...register('name', { required: 'Name is required' })}
                  disabled={!isEditing}
                  error={errors.name?.message}
                />
                
                <Input
                  label="Email Address"
                  value={user?.email || ''}
                  disabled
                  helperText="Email address cannot be changed"
                />

                {isEditing && (
                  <Button 
                    type="submit" 
                    className="w-full"
                    loading={updateProfileMutation.isPending}
                  >
                    Save Changes
                  </Button>
                )}
              </form>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h3 className="text-lg font-heading font-bold text-surface-900 dark:text-surface-50 mb-4">Recent Bookings</h3>
              
              {recentBookings.length === 0 ? (
                <div className="text-center py-10 text-surface-500 dark:text-surface-400 text-sm">
                  No rental history found.
                </div>
              ) : (
                <div className="space-y-4">
                  {recentBookings.map(booking => (
                    <div key={booking.id} className="flex items-center gap-4 p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-800">
                      <div className="w-20 h-14 rounded-lg bg-surface-200 dark:bg-surface-800 overflow-hidden shrink-0">
                        <img 
                          src={getCarImage(booking.carSnapshot)} 
                          alt="Vehicle" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading font-bold text-surface-900 dark:text-surface-100 text-sm truncate">
                          {booking.carSnapshot?.brand} {booking.carSnapshot?.model}
                        </h4>
                        <p className="text-xs text-surface-500 mt-0.5">
                          {formatDate(booking.pickupDate)}
                        </p>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-surface-200 dark:bg-surface-800 text-surface-700 dark:text-surface-300 rounded-full capitalize">
                        {booking.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
