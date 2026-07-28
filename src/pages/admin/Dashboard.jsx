import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { HiTruck, HiCalendarDays, HiCurrencyDollar, HiUsers, HiArrowRight } from 'react-icons/hi2';
import { useQuery } from '@tanstack/react-query';
import { getCars } from '@/firebase/cars';
import { getAllBookings } from '@/firebase/bookings';
import { getAllUsers } from '@/firebase/users';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { formatPrice, formatDate } from '@/utils/helpers';

const STATS_CARDS = [
  {
    id: 'cars',
    label: 'Total Cars',
    icon: HiTruck,
    color: 'blue',
    gradient: 'from-blue-500/10 to-cyan-500/10',
    iconColor: 'text-blue-600',
  },
  {
    id: 'bookings',
    label: 'Active Bookings',
    icon: HiCalendarDays,
    color: 'green',
    gradient: 'from-green-500/10 to-emerald-500/10',
    iconColor: 'text-green-600',
  },
  {
    id: 'revenue',
    label: 'Total Revenue',
    icon: HiCurrencyDollar,
    color: 'amber',
    gradient: 'from-amber-500/10 to-orange-500/10',
    iconColor: 'text-amber-600',
  },
  {
    id: 'users',
    label: 'Total Users',
    icon: HiUsers,
    color: 'purple',
    gradient: 'from-purple-500/10 to-fuchsia-500/10',
    iconColor: 'text-purple-600',
  },
];

export default function Dashboard() {
  const { data: cars, isLoading: loadingCars } = useQuery({
    queryKey: ['admin-cars'],
    queryFn: getCars,
  });

  const { data: bookings, isLoading: loadingBookings } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: getAllBookings,
  });

  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getAllUsers,
  });

  const isLoading = loadingCars || loadingBookings || loadingUsers;

  const totalCars = cars?.length || 0;
  const activeBookings = bookings?.filter(b => b.status === 'confirmed' || b.status === 'pending').length || 0;
  const totalRevenue = bookings?.filter(b => b.status === 'completed').reduce((sum, b) => sum + (b.totalPrice || 0), 0) || 0;
  const totalUsers = users?.length || 0;

  const recentBookings = bookings?.slice(0, 5) || [];
  const recentUsers = users?.slice(0, 5) || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'confirmed': return 'primary';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
          <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {STATS_CARDS.map((stat, idx) => {
          const Icon = stat.icon;
          let value = 0;
          let prefix = '';
          if (stat.id === 'cars') value = totalCars;
          if (stat.id === 'bookings') value = activeBookings;
          if (stat.id === 'revenue') { value = totalRevenue; prefix = '$'; }
          if (stat.id === 'users') value = totalUsers;

          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className={`p-6 bg-gradient-to-br ${stat.gradient} border-transparent`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      {stat.label}
                    </p>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                      {prefix && <span className="mr-1">{prefix}</span>}
                      <AnimatedCounter value={value} />
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm ${stat.iconColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <Card className="flex flex-col">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Bookings</h2>
            <Link to="/admin/bookings" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1">
              View All <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-0 overflow-x-auto">
            {recentBookings.length > 0 ? (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Customer</th>
                    <th className="px-6 py-4 font-medium">Car</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900 dark:text-white">{booking.customerName}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {booking.carSnapshot?.brand} {booking.carSnapshot?.model}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {formatPrice(booking.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No recent bookings found.
              </div>
            )}
          </div>
        </Card>

        {/* Recent Users */}
        <Card className="flex flex-col">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Users</h2>
            <Link to="/admin/users" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1">
              View All <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-0 overflow-x-auto">
            {recentUsers.length > 0 ? (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">User</th>
                    <th className="px-6 py-4 font-medium">Joined</th>
                    <th className="px-6 py-4 font-medium">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {recentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt={user.name} className="w-8 h-8 rounded-full object-cover bg-gray-100" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-bold">
                            {user.name?.charAt(0) || 'U'}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{user.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={user.role === 'admin' ? 'purple' : 'default'}>
                          {user.role || 'user'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No recent users found.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
