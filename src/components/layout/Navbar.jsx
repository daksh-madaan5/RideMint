import { useState, useContext, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import {
  HiBars3,
  HiXMark,
  HiMagnifyingGlass,
  HiSun,
  HiMoon,
  HiUser,
  HiArrowRightOnRectangle,
  HiHeart,
  HiCalendarDays,
  HiCog6Tooth,
  HiChevronDown,
} from 'react-icons/hi2';
import { AuthContext } from '@/context/AuthContext';
import { ThemeContext } from '@/context/ThemeContext';
import Avatar from '@/components/ui/Avatar';
import { NAV_LINKS } from '@/constants';

/**
 * Premium sticky Navbar with blur background, mobile drawer, user dropdown, and theme toggle.
 */
export default function Navbar() {
  const { user, userProfile, logout, isAdmin } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const userMenuRef = useRef(null);

  // Track scroll for background blur
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-surface-950/80 backdrop-blur-xl border-b border-surface-800/50 shadow-lg'
          : 'bg-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">DF</span>
            </div>
            <span className="text-xl font-heading font-bold text-surface-100 group-hover:text-primary-400 transition-colors">
              Drive<span className="text-primary-400">Fleet</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  clsx(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'text-primary-400 bg-primary-500/10'
                      : 'text-surface-300 hover:text-surface-100 hover:bg-surface-800/50'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">


            {/* Theme Toggle */}
            <motion.button
              whileTap={{ scale: 0.9, rotate: 180 }}
              onClick={toggleTheme}
              className="p-2 rounded-xl text-surface-400 hover:text-surface-100 hover:bg-surface-800/50 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <HiSun className="h-5 w-5" />
              ) : (
                <HiMoon className="h-5 w-5" />
              )}
            </motion.button>

            {/* Auth Section */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-surface-800/50 transition-colors"
                >
                  <Avatar
                    src={user.photoURL || userProfile?.photo}
                    name={user.displayName || userProfile?.name || 'User'}
                    size="sm"
                  />
                  <HiChevronDown
                    className={clsx(
                      'h-4 w-4 text-surface-400 transition-transform hidden sm:block',
                      userMenuOpen && 'rotate-180'
                    )}
                  />
                </button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 glass-strong rounded-2xl shadow-2xl overflow-hidden"
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-surface-700/50">
                        <p className="text-sm font-medium text-surface-100 truncate">
                          {user.displayName || userProfile?.name}
                        </p>
                        <p className="text-xs text-surface-400 truncate">
                          {user.email}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <DropdownItem
                          icon={HiUser}
                          label="My Profile"
                          onClick={() => {
                            navigate('/profile');
                            setUserMenuOpen(false);
                          }}
                        />
                        <DropdownItem
                          icon={HiHeart}
                          label="Favorites"
                          onClick={() => {
                            navigate('/favorites');
                            setUserMenuOpen(false);
                          }}
                        />
                        <DropdownItem
                          icon={HiCalendarDays}
                          label="My Bookings"
                          onClick={() => {
                            navigate('/bookings');
                            setUserMenuOpen(false);
                          }}
                        />
                        {isAdmin && (
                          <DropdownItem
                            icon={HiCog6Tooth}
                            label="Admin Dashboard"
                            onClick={() => {
                              navigate('/admin');
                              setUserMenuOpen(false);
                            }}
                          />
                        )}
                      </div>

                      {/* Logout */}
                      <div className="border-t border-surface-700/50 py-1">
                        <DropdownItem
                          icon={HiArrowRightOnRectangle}
                          label="Sign Out"
                          onClick={handleLogout}
                          danger
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-surface-300 hover:text-surface-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-surface-400 hover:text-surface-100 hover:bg-surface-800/50 transition-colors"
            >
              {mobileOpen ? (
                <HiXMark className="h-6 w-6" />
              ) : (
                <HiBars3 className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden bg-surface-950/95 backdrop-blur-xl border-t border-surface-800/50"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    clsx(
                      'block px-4 py-3 rounded-xl text-sm font-medium transition-all',
                      isActive
                        ? 'text-primary-400 bg-primary-500/10'
                        : 'text-surface-300 hover:bg-surface-800/50'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}



              {/* Mobile Auth */}
              {!user && (
                <div className="pt-2 border-t border-surface-800/50 flex gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-surface-300 bg-surface-800/50 rounded-xl"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center px-4 py-2.5 text-sm font-medium bg-primary-600 text-white rounded-xl"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/**
 * Dropdown menu item sub-component.
 */
function DropdownItem({ icon: Icon, label, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
        danger
          ? 'text-danger hover:bg-danger/10'
          : 'text-surface-300 hover:bg-surface-700/50 hover:text-surface-100'
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
