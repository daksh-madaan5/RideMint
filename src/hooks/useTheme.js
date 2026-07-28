import { useContext } from 'react';
import { ThemeContext } from '@/context/ThemeContext';

/**
 * Convenience hook for accessing theme context.
 * @returns {{ theme: string, toggleTheme: Function }}
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
