import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router';
import { clsx } from 'clsx';
import {
  HiArrowLeftOnRectangle,
  HiBars3,
  HiCalendarDays,
  HiChartBar,
  HiClipboardDocumentCheck,
  HiHome,
  HiTruck,
  HiUsers,
  HiXMark,
} from 'react-icons/hi2';
import RideMintLogo from '@/components/brand/RideMintLogo';
import Avatar from '@/components/ui/Avatar';
import IconButton from '@/components/ui/IconButton';
import { useAuth } from '@/hooks/useAuth';

const sidebarLinks = [
  { label: 'Dashboard', path: '/admin', icon: HiChartBar, end: true },
  { label: 'Manage cars', path: '/admin/cars', icon: HiTruck },
  { label: 'Listing moderation', path: '/admin/listings', icon: HiClipboardDocumentCheck },
  { label: 'Bookings', path: '/admin/bookings', icon: HiCalendarDays },
  { label: 'Users', path: '/admin/users', icon: HiUsers },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const adminName = user?.displayName || userProfile?.name || 'Administrator';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close admin navigation"
          className="fixed inset-0 z-40 bg-[color-mix(in_srgb,var(--navigation)_38%,transparent)] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[var(--border)] bg-[var(--surface)] transition-transform duration-[var(--duration-normal)] lg:sticky lg:top-0 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-[var(--border)] px-4">
          <Link
            to="/"
            aria-label="Return to the RideMint customer site"
            className="focus-ring inline-flex items-center gap-3 rounded-[var(--radius-control)]"
          >
            <RideMintLogo variant="compact" />
            <span className="font-heading text-sm font-semibold">Admin</span>
          </Link>
          <IconButton label="Close admin navigation" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <HiXMark className="h-5 w-5" aria-hidden="true" />
          </IconButton>
        </div>

        <nav aria-label="Administrator navigation" className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                clsx(
                  'focus-ring flex h-10 items-center gap-3 rounded-[var(--radius-control)] px-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[var(--primary-subtle)] text-[var(--primary)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text-primary)]'
                )
              }
            >
              <link.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-1 border-t border-[var(--border)] p-3">
          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="focus-ring flex h-10 items-center gap-3 rounded-[var(--radius-control)] px-3 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text-primary)]"
          >
            <HiHome className="h-5 w-5" aria-hidden="true" />
            Back to RideMint
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="focus-ring flex h-10 w-full items-center gap-3 rounded-[var(--radius-control)] px-3 text-sm text-[var(--danger)] hover:bg-[var(--danger-subtle)]"
          >
            <HiArrowLeftOnRectangle className="h-5 w-5" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4 lg:px-6">
          <div className="flex items-center gap-1 lg:hidden">
            <IconButton label="Open admin navigation" onClick={() => setSidebarOpen(true)}>
              <HiBars3 className="h-5 w-5" aria-hidden="true" />
            </IconButton>
            <Link
              to="/"
              aria-label="Back to RideMint"
              className="focus-ring inline-flex h-10 items-center gap-2 rounded-[var(--radius-control)] px-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text-primary)]"
            >
              <HiHome className="h-5 w-5" aria-hidden="true" />
              <span className="hidden sm:inline">RideMint</span>
            </Link>
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-medium">RideMint administration</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">{adminName}</p>
              <p className="text-xs text-[var(--text-tertiary)]">Administrator</p>
            </div>
            <Avatar
              src={user?.photoURL || userProfile?.photo}
              name={adminName}
              size="sm"
            />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[var(--content-admin)]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
