import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import AppRouter from '@/routes/AppRouter';

/**
 * Root application component.
 * Wraps the app with Auth, Theme providers and global Toast container.
 */
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRouter />
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastClassName="!bg-surface-800 !text-surface-100 !rounded-xl !shadow-2xl !border !border-surface-700/50"
        />
      </AuthProvider>
    </ThemeProvider>
  );
}
