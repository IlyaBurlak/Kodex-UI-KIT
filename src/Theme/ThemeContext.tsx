import { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: (next?: boolean) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('app-theme');
      return (saved as Theme) ?? 'light';
    } catch (err) {
      console.error('Failed to read app-theme from localStorage', err);
      return 'light';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('app-theme', theme);
    } catch (err) {
      console.error('Failed to save app-theme to localStorage', err);
    }
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('theme-dark');
    } else {
      root.classList.remove('theme-dark');
    }
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);

  const toggleTheme = (next?: boolean) => {
    if (typeof next === 'boolean') {
      setThemeState(next ? 'dark' : 'light');
    } else {
      setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
