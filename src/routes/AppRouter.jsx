import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router';
import RootLayout from '@/components/layout/RootLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import Spinner from '@/components/ui/Spinner';

/* ============================================
   Lazy-loaded Pages (Code Splitting)
   ============================================ */

// Public pages
const Home = lazy(() => import('@/pages/Home'));
const Cars = lazy(() => import('@/pages/Cars'));
const CarDetails = lazy(() => import('@/pages/CarDetails'));
const Login = lazy(() => import('@/pages/auth/Login'));
const Register = lazy(() => import('@/pages/auth/Register'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Protected pages
const Booking = lazy(() => import('@/pages/Booking'));
const BookingHistory = lazy(() => import('@/pages/BookingHistory'));
const Favorites = lazy(() => import('@/pages/Favorites'));
const Profile = lazy(() => import('@/pages/Profile'));

// Admin pages
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const ManageCars = lazy(() => import('@/pages/admin/ManageCars'));
const CarForm = lazy(() => import('@/pages/admin/CarForm'));
const ManageBookings = lazy(() => import('@/pages/admin/ManageBookings'));
const ManageUsers = lazy(() => import('@/pages/admin/ManageUsers'));

/**
 * Page-level loading fallback.
 */
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Spinner size="lg" />
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
        {/* Public Layout Routes */}
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/cars/:id" element={<CarDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected User Routes */}
          <Route
            path="/booking/:carId"
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <BookingHistory />
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
          <Route path="/admin/cars" element={<ManageCars />} />
          <Route path="/admin/cars/new" element={<CarForm />} />
          <Route path="/admin/cars/edit/:id" element={<CarForm />} />
          <Route path="/admin/bookings" element={<ManageBookings />} />
          <Route path="/admin/users" element={<ManageUsers />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
