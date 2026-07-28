import { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router';
import { clsx } from 'clsx';
import { motion } from 'motion/react';
import {
  HiHome,
  HiTruck,
  HiCalendarDays,
  HiUsers,
  HiBars3,
  HiXMark,
  HiArrowLeftOnRectangle,
  HiChartBar,
} from 'react-icons/hi2';
import { useAuth } from '@/hooks/useAuth';

const sidebarLinks = [
  { label: 'Dashboard', path: '/admin', icon: HiChartBar, end: true },
  { label: 'Manage Cars', path: '/admin/cars', icon: HiTruck },
  { label: 'Bookings', path: '/admin/bookings', icon: HiCalendarDays },
  { label: 'Users', path: '/admin/users', icon: HiUsers },
];

/**
 * Admin layout with sidebar navigation and top bar.
 */
export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-surface-950 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-surface-900/95 backdrop-blur-xl',
          'border-r border-surface-800/50 flex flex-col transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-surface-800/50">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">DF</span>
            </div>
            <span className="text-lg font-heading font-bold text-surface-100">
              Admin
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-surface-400 hover:bg-surface-800"
          >
            <HiXMark className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary-600/15 text-primary-400 shadow-sm'
                    : 'text-surface-400 hover:text-surface-100 hover:bg-surface-800/50'
                )
              }
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="px-3 py-4 border-t border-surface-800/50 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-surface-400 hover:text-surface-100 hover:bg-surface-800/50 transition-colors"
          >
            <HiHome className="h-5 w-5" />
            Back to Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-danger hover:bg-danger/10 transition-colors"
          >
            <HiArrowLeftOnRectangle className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-surface-950/80 backdrop-blur-xl border-b border-surface-800/50 flex items-center justify-between px-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl text-surface-400 hover:bg-surface-800/50"
          >
            <HiBars3 className="h-5 w-5" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-surface-200">
                {user?.displayName || userProfile?.name}
              </p>
              <p className="text-xs text-surface-500">Administrator</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-primary-600/20 flex items-center justify-center text-primary-400 font-semibold text-sm">
              {(user?.displayName || userProfile?.name || 'A').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
