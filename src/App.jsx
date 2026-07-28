import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import AppRouter from '@/routes/AppRouter';
import ToastViewport from '@/components/ui/Toast';

/**
 * Root application component.
 * Wraps the app with Auth, Theme providers and global Toast container.
 */
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRouter />
        <ToastViewport />
      </AuthProvider>
    </ThemeProvider>
  );
}
