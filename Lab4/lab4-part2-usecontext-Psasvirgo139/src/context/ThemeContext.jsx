import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { themes, STORAGE_KEY } from '../data/themeConfig';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // Read mode from localStorage or default to 'system'
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved || 'system';
  });

  // Track system preference
  const [systemPrefersDark, setSystemPrefersDark] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setSystemPrefersDark(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  // Compute resolvedTheme
  const resolvedTheme = useMemo(() => {
    if (mode === 'system') {
      return systemPrefersDark ? 'dark' : 'light';
    }
    return mode;
  }, [mode, systemPrefersDark]);

  // Retrieve colors matching resolved theme
  const colors = useMemo(() => {
    return themes[resolvedTheme];
  }, [resolvedTheme]);

  // Set mode & write to localStorage
  const changeMode = (newMode) => {
    setMode(newMode);
    localStorage.setItem(STORAGE_KEY, newMode);
  };

  const contextValue = useMemo(() => {
    return {
      mode,
      resolvedTheme,
      colors,
      changeMode,
    };
  }, [mode, resolvedTheme, colors]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
