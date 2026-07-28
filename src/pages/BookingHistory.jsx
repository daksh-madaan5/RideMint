import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-toastify';
import { Link } from 'react-router';
import { clsx } from 'clsx';
import { HiOutlineCalendar, HiOutlineCreditCard } from 'react-icons/hi2';

import { getUserBookings, updateBookingStatus } from '@/firebase/bookings';
import { useAuth } from '@/hooks/useAuth';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

import { formatPrice, formatDate } from '@/utils/helpers';

export default function BookingHistory() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('all');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings', user?.uid],
    queryFn: () => getUserBookings(user?.uid),
    enabled: !!user?.uid,
  });

  const cancelMutation = useMutation({
    mutationFn: (bookingId) => updateBookingStatus(bookingId, 'cancelled'),
    onMutate: async (bookingId) => {
      await queryClient.cancelQueries({ queryKey: ['bookings', user?.uid] });
      const previousBookings = queryClient.getQueryData(['bookings', user?.uid]);
      queryClient.setQueryData(['bookings', user?.uid], (old) => 
        old?.map(booking => 
          booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
        )
      );
      return { previousBookings };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['bookings', user?.uid], context.previousBookings);
      toast.error('Failed to cancel booking.');
    },
    onSuccess: () => {
      toast.success('Booking cancelled successfully.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', user?.uid] });
    },
  });

  const handleCancelClick = (booking) => {
    setBookingToCancel(booking);
    setCancelModalOpen(true);
  };

  const confirmCancel = () => {
    if (bookingToCancel) {
      cancelMutation.mutate(bookingToCancel.id);
      setCancelModalOpen(false);
      setBookingToCancel(null);
    }
  };

  const tabs = [
    { id: 'all', label: 'All Bookings' },
    { id: 'active', label: 'Active' }, // pending or confirmed
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  const filteredBookings = bookings
    .filter(booking => {
      if (activeTab === 'all') return true;
      if (activeTab === 'active') return ['pending', 'confirmed'].includes(booking.status);
      return booking.status === activeTab;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-10 w-24 rounded-full" />
          <Skeleton className="h-10 w-24 rounded-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      <div className="flex overflow-x-auto pb-2 mb-6 gap-2 hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              "px-4 py-2 rounded-full whitespace-nowrap transition-colors",
              activeTab === tab.id 
                ? "bg-primary-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filteredBookings.length === 0 ? (
        <EmptyState 
          title="No bookings found"
          description={activeTab === 'all' ? "You haven't made any bookings yet." : `No ${activeTab} bookings found.`}
          action={
            <Link to="/cars">
              <Button>Browse Cars</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredBookings.map((booking) => (
              <motion.div
                key={booking.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              >
                <Card className="flex flex-col md:flex-row overflow-hidden hover:shadow-md transition-shadow">
                  <div className="w-full md:w-64 h-48 md:h-auto bg-gray-100 dark:bg-gray-800 relative">
                    {booking.carSnapshot?.image ? (
                      <img 
                        src={booking.carSnapshot.image} 
                        alt={`${booking.carSnapshot.brand} ${booking.carSnapshot.model}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    <div className="absolute top-3 right-3 md:hidden">
                       <Badge variant={getStatusBadgeVariant(booking.status)} className="capitalize">
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold">
                          {booking.carSnapshot?.brand} {booking.carSnapshot?.model}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                           <HiOutlineCalendar className="w-4 h-4" />
                           {formatDate(booking.pickupDate)} - {formatDate(booking.returnDate)}
                        </p>
                      </div>
                      <div className="hidden md:block">
                        <Badge variant={getStatusBadgeVariant(booking.status)} className="capitalize">
                          {booking.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-4 justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">Total Price</span>
                        <span className="text-lg font-semibold flex items-center gap-1">
                           {formatPrice(booking.totalPrice)}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Link to={`/cars/${booking.carId}`}>
                          <Button variant="outline" size="sm">View Car</Button>
                        </Link>
                        {['pending', 'confirmed'].includes(booking.status) && (
                          <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => handleCancelClick(booking)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <ConfirmDialog
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={confirmCancel}
        title="Cancel Booking"
        message={`Are you sure you want to cancel your booking for the ${bookingToCancel?.carSnapshot?.brand} ${bookingToCancel?.carSnapshot?.model}? This action cannot be undone.`}
        confirmText="Yes, Cancel Booking"
        confirmVariant="danger"
      />
    </div>
  );
}
