import { lazy, Suspense } from 'react';
import { Navigate, Routes, Route } from 'react-router';
import RootLayout from '@/components/layout/RootLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

/* ============================================
   Lazy-loaded Pages (Code Splitting)
   ============================================ */

// Public pages
const Home = lazy(() => import('@/pages/Home'));
const Cars = lazy(() => import('@/pages/Cars'));
const CarDetails = lazy(() => import('@/pages/CarDetails'));
const About = lazy(() => import('@/pages/About'));
const Login = lazy(() => import('@/pages/auth/Login'));
const Register = lazy(() => import('@/pages/auth/Register'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const DesignSystem = lazy(() => import('@/pages/DesignSystem'));

// Protected pages
const Booking = lazy(() => import('@/pages/Booking'));
const BookingHistory = lazy(() => import('@/pages/BookingHistory'));
const BookingRequests = lazy(() => import('@/pages/BookingRequests'));
const Favorites = lazy(() => import('@/pages/Favorites'));
const Profile = lazy(() => import('@/pages/Profile'));
const ListYourCar = lazy(() => import('@/pages/ListYourCar'));
const MyListings = lazy(() => import('@/pages/MyListings'));

// Admin pages
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const ManageBookings = lazy(() => import('@/pages/admin/ManageBookings'));
const ManageUsers = lazy(() => import('@/pages/admin/ManageUsers'));
const ModerateListings = lazy(() => import('@/pages/admin/ModerateListings'));

/**
 * Page-level loading fallback.
 */
function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-[var(--background)]">
      <div className="flex items-center gap-3 text-sm font-medium text-[var(--text-secondary)]" role="status">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--border-strong)] border-t-[var(--primary)]" aria-hidden="true" />
        Loading page…
      </div>
    </div>
  );
}

/**
 * Main application router with layout routes, protected routes, and admin routes.
 */
export default function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/design-system" element={<DesignSystem />} />

        {/* Public Layout Routes */}
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/cars/:carId" element={<CarDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected User Routes */}
          <Route path="/booking/:carId" element={<Booking />} />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <BookingHistory />
              </ProtectedRoute>
            }
          />
          <Route path="/bookings" element={<Navigate to="/my-bookings" replace />} />
          <Route
            path="/booking-requests"
            element={
              <ProtectedRoute>
                <BookingRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/list-your-car"
            element={
              <ProtectedRoute>
                <ListYourCar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/list-your-car/:listingId"
            element={
              <ProtectedRoute>
                <ListYourCar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-listings"
            element={
              <ProtectedRoute>
                <MyListings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin Layout Routes */}
        <Route
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/cars" element={<Navigate to="/admin/listings" replace />} />
          <Route path="/admin/cars/new" element={<Navigate to="/admin/listings" replace />} />
          <Route path="/admin/cars/edit/:id" element={<Navigate to="/admin/listings" replace />} />
          <Route path="/admin/bookings" element={<ManageBookings />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/listings" element={<ModerateListings />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
