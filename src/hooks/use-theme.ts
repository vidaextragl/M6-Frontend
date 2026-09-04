import { useContext } from 'react';
import { ThemeContext } from '../context/theme-context-definition';

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }

  return context;
}