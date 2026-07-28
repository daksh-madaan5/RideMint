import { useState } from 'react';
import { motion } from 'motion/react';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { getAllBookings, updateBookingStatus } from '@/firebase/bookings';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Pagination from '@/components/ui/Pagination';
import { formatPrice, formatDate } from '@/utils/helpers';
import useDebounce from '@/hooks/useDebounce';

const STATUS_TABS = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

export default function ManageBookings() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [activeTab, setActiveTab] = useState('All');
  const [page, setPage] = useState(1);
  
  const itemsPerPage = 10;

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: getAllBookings,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateBookingStatus(id, status),
    onSuccess: () => {
      toast.success('Booking status updated');
      queryClient.invalidateQueries(['admin-bookings']);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update status');
    }
  });

  const filteredBookings = bookings.filter(booking => {
    const searchStr = `${booking.customerName || ''} ${booking.carSnapshot?.brand || ''} ${booking.carSnapshot?.model || ''}`.toLowerCase();
    const matchesSearch = searchStr.includes(debouncedSearch.toLowerCase());
    const matchesTab = activeTab === 'All' ? true : booking.status.toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesTab;
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleStatusChange = (bookingId, newStatus) => {
    statusMutation.mutate({ id: bookingId, status: newStatus });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'success';
      case 'confirmed': return 'primary';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Bookings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">View and manage all customer reservations.</p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col gap-6 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-100 dark:border-gray-800 hide-scrollbar">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setPage(1); }}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab 
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative max-w-md w-full">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              placeholder="Search customer or car..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No bookings found</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              There are no bookings matching your current filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Car</th>
                  <th className="px-6 py-4 font-medium">Dates</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {paginatedBookings.map((booking, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={booking.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{booking.customerName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{booking.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{booking.carSnapshot?.brand} {booking.carSnapshot?.model}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      <div>{formatDate(booking.startDate)}</div>
                      <div className="text-xs text-gray-400">to {formatDate(booking.endDate)}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {formatPrice(booking.totalPrice)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Select 
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        disabled={statusMutation.isPending}
                        className="min-w-[120px] text-sm py-1.5"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </Select>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination 
              currentPage={page} 
              totalPages={totalPages} 
              onPageChange={setPage} 
            />
          </div>
        )}
      </Card>
    </div>
  );
}
