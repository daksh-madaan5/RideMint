import { useContext, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { clsx } from 'clsx';
import {
  HiArrowRightOnRectangle,
  HiBars3,
  HiCalendarDays,
  HiChevronDown,
  HiCog6Tooth,
  HiInboxStack,
  HiPlusCircle,
  HiRectangleStack,
} from 'react-icons/hi2';
import { AuthContext } from '@/context/AuthContext';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Drawer from '@/components/ui/Drawer';
import RideMintLogo from '@/components/brand/RideMintLogo';

const customerLinks = [
  { label: 'Home', path: '/' },
  { label: 'Explore cars', path: '/cars' },
  { label: 'About', path: '/about' },
];

export default function Navbar() {
  const { user, userProfile, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const accountRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    setAccountOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--dark-border)] bg-[var(--dark-surface)] text-[var(--dark-text-primary)]">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex h-16 max-w-[var(--content-customer)] items-center justify-between px-4 sm:px-6 lg:h-[4.5rem] lg:px-8"
      >
        <Link to="/" className="focus-ring-dark inline-flex items-center gap-2 rounded-lg" aria-label="RideMint home">
          <span className="hidden md:block">
            <RideMintLogo variant="default" onDark />
          </span>
          <span className="md:hidden">
            <RideMintLogo variant="compact" onDark />
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {customerLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                clsx(
                  'focus-ring-dark rounded-[var(--radius-control)] px-4 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-white/10 text-[var(--dark-text-primary)]' : 'text-[var(--dark-text-secondary)] hover:bg-white/5 hover:text-[var(--dark-text-primary)]'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
          {user && (
            <NavLink
              to="/list-your-car"
              className={({ isActive }) =>
                clsx(
                  'focus-ring-dark rounded-[var(--radius-control)] px-4 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-white/10 text-[var(--dark-text-primary)]' : 'text-[var(--dark-text-secondary)] hover:bg-white/5 hover:text-[var(--dark-text-primary)]'
                )
              }
            >
              List your car
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="relative hidden md:block" ref={accountRef}>
              <button
                type="button"
                onClick={() => setAccountOpen((open) => !open)}
                className="focus-ring-dark flex items-center gap-2 rounded-[var(--radius-control)] p-1.5 text-[var(--dark-text-primary)] hover:bg-white/5"
                aria-expanded={accountOpen}
                aria-haspopup="menu"
              >
                <Avatar
                  src={user.photoURL || userProfile?.photo}
                  name={user.displayName || userProfile?.name || 'Customer'}
                  size="sm"
                />
                <span className="max-w-28 truncate text-sm">
                  {user.displayName || userProfile?.name || 'Account'}
                </span>
                <HiChevronDown className={clsx('h-4 w-4 transition-transform', accountOpen && 'rotate-180')} />
              </button>
              {accountOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] py-1 text-[var(--text-primary)] shadow-[var(--shadow-raised)]"
                >
                  <AccountAction
                    icon={HiCalendarDays}
                    label="My bookings"
                    onClick={() => {
                      navigate('/my-bookings');
                      setAccountOpen(false);
                    }}
                  />
                  <AccountAction
                    icon={HiInboxStack}
                    label="Booking requests"
                    onClick={() => {
                      navigate('/booking-requests');
                      setAccountOpen(false);
                    }}
                  />
                  <AccountAction
                    icon={HiRectangleStack}
                    label="My listings"
                    onClick={() => {
                      navigate('/my-listings');
                      setAccountOpen(false);
                    }}
                  />
                  {isAdmin && (
                    <AccountAction
                      icon={HiCog6Tooth}
                      label="Admin dashboard"
                      onClick={() => {
                        navigate('/admin');
                        setAccountOpen(false);
                      }}
                    />
                  )}
                  <div className="my-1 border-t border-[var(--border)]" />
                  <AccountAction icon={HiArrowRightOnRectangle} label="Sign out" onClick={handleLogout} />
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button as={Link} to="/login" variant="ghost" size="sm" className="focus-ring-dark text-[var(--dark-text-secondary)] hover:bg-white/5 hover:text-[var(--dark-text-primary)]">
                Sign in
              </Button>
              <Button as={Link} to="/register" size="sm" className="focus-ring-dark bg-[var(--dark-action)] text-[var(--dark-action-text)] hover:bg-[var(--dark-action-hover)]">
                Create account
              </Button>
            </div>
          )}

          <button
            type="button"
            className="focus-ring-dark rounded-[var(--radius-control)] p-2 text-[var(--dark-text-secondary)] hover:bg-white/5 hover:text-[var(--dark-text-primary)] md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
          >
            <HiBars3 className="h-6 w-6" />
          </button>
        </div>
      </nav>

      <Drawer isOpen={mobileOpen} onClose={closeMobile} title="Menu">
        <nav aria-label="Mobile navigation" className="space-y-1">
          {customerLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              onClick={closeMobile}
              className={({ isActive }) =>
                clsx(
                  'focus-ring block rounded-[var(--radius-control)] px-4 py-3 text-sm font-medium',
                  isActive ? 'bg-[var(--primary-subtle)] text-[var(--primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)]'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
          {user && (
            <NavLink
              to="/list-your-car"
              onClick={closeMobile}
              className={({ isActive }) =>
                clsx(
                  'focus-ring block rounded-[var(--radius-control)] px-4 py-3 text-sm font-medium',
                  isActive ? 'bg-[var(--primary-subtle)] text-[var(--primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)]'
                )
              }
            >
              List your car
            </NavLink>
          )}
        </nav>
        <div className="mt-6 border-t border-[var(--border)] pt-6">
          {user ? (
            <div className="space-y-2">
              <Button as={Link} to="/my-bookings" onClick={closeMobile} variant="secondary" fullWidth>
                My bookings
              </Button>
              <Button as={Link} to="/booking-requests" onClick={closeMobile} variant="secondary" fullWidth icon={HiInboxStack}>
                Booking requests
              </Button>
              <Button as={Link} to="/my-listings" onClick={closeMobile} variant="secondary" fullWidth icon={HiRectangleStack}>
                My listings
              </Button>
              <Button as={Link} to="/list-your-car" onClick={closeMobile} fullWidth icon={HiPlusCircle}>
                List your car
              </Button>
              {isAdmin && (
                <Button as={Link} to="/admin" onClick={closeMobile} variant="secondary" fullWidth>
                  Admin dashboard
                </Button>
              )}
              <Button onClick={handleLogout} variant="ghost" fullWidth>Sign out</Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Button as={Link} to="/login" onClick={closeMobile} variant="secondary" fullWidth>Sign in</Button>
              <Button as={Link} to="/register" onClick={closeMobile} fullWidth>Create account</Button>
            </div>
          )}
        </div>
      </Drawer>
    </header>
  );
}

function AccountAction({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text-primary)]"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </button>
  );
}
