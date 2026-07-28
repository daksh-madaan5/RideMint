import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { toast } from 'react-toastify';

import { getUserProfile, toggleFavorite } from '@/firebase/users';
import { getCarById } from '@/firebase/cars';
import { useAuth } from '@/hooks/useAuth';

import CarCard from '@/features/cars/CarCard';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Button from '@/components/ui/Button';

export default function Favorites() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile', user?.uid],
    queryFn: () => getUserProfile(user?.uid),
    enabled: !!user?.uid,
  });

  const favoriteCarIds = profile?.favorites || [];

  const { data: favoriteCars = [], isLoading: isCarsLoading } = useQuery({
    queryKey: ['favoriteCars', favoriteCarIds],
    queryFn: async () => {
      if (favoriteCarIds.length === 0) return [];
      const promises = favoriteCarIds.map(id => getCarById(id));
      return Promise.all(promises);
    },
    enabled: favoriteCarIds.length > 0,
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: (carId) => toggleFavorite(user.uid, carId),
    onSuccess: (_, carId) => {
      queryClient.invalidateQueries(['profile', user?.uid]);
      // The favorite cars query will automatically re-run if favoriteCarIds changes
      toast.success('Removed from favorites');
    },
    onError: () => {
      toast.error('Failed to update favorites');
    }
  });

  const handleToggleFavorite = (e, carId) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavoriteMutation.mutate(carId);
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Favorites', path: '/favorites' },
  ];

  const isLoading = isProfileLoading || isCarsLoading;

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} className="mb-6" />
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Favorites</h1>
        {!isLoading && favoriteCars.length > 0 && (
          <span className="text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-medium">
            {favoriteCars.length} {favoriteCars.length === 1 ? 'car' : 'cars'}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded-xl" />
          ))}
        </div>
      ) : favoriteCars.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <EmptyState
            title="No favorites yet"
            description="Cars you save will appear here. Start exploring to build your dream garage."
            action={
              <Link to="/cars">
                <Button>Browse Cars</Button>
              </Link>
            }
          />
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          {favoriteCars.map(car => (
            <motion.div
              key={car.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              layout
            >
              <CarCard 
                car={car}
                isFavorite={true}
                onToggleFavorite={(e) => handleToggleFavorite(e, car.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
