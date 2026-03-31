import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadSettings } from '../utils/storage';

const ThemeContext = createContext();

export const darkTheme = {
  isDark: true,
  colors: {
    primary: '#C9A84C',
    secondary: '#4CAF82',
    background: '#0F0D0A',
    card: '#18150F',
    cardBorder: '#2A261C',
    text: '#F5EDD6',
    textSecondary: '#9E8E6A',
    textMuted: '#5A4F35',
    accent: '#C9A84C',
    success: '#4CAF82',
    warning: '#E6A817',
    error: '#D95F4B',
    border: '#2E2920',
    dim: '#1E1B14',
  },
};

export const lightTheme = {
  isDark: false,
  colors: {
    primary: '#8B6914',
    secondary: '#2E7D4F',
    background: '#F5F0E8',
    card: '#FFFFFF',
    cardBorder: '#E5DDD0',
    text: '#2C2416',
    textSecondary: '#6B5D45',
    textMuted: '#9A8A72',
    accent: '#8B6914',
    success: '#2E7D4F',
    warning: '#B8860B',
    error: '#C94B35',
    border: '#E5DDD0',
    dim: '#EDE6DA',
  },
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(darkTheme);
  const [settings, setSettings] = useState({ theme: 'dark', soundEnabled: true, hapticEnabled: true });

  useEffect(() => {
    let isMounted = true;

    loadSettings().then(s => {
      if (!isMounted) return;

      setSettings(prev => {
        const unchanged =
          prev.theme === s.theme &&
          prev.soundEnabled === s.soundEnabled &&
          prev.hapticEnabled === s.hapticEnabled;
        return unchanged ? prev : s;
      });

      const nextTheme = s.theme === 'light' ? lightTheme : darkTheme;
      setTheme(prev => (prev === nextTheme ? prev : nextTheme));
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme.isDark ? lightTheme : darkTheme;
    setTheme(newTheme);
  };

  const updateTheme = (themeName) => {
    setTheme(themeName === 'light' ? lightTheme : darkTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, updateTheme, settings, setSettings }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
