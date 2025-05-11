import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context
const ThemeContext = createContext();

// Theme options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

/**
 * Theme Provider Component - Manages theme state and provides theme-related methods
 */
export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or default to system preference
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || THEMES.SYSTEM;
  });

  // Track whether the theme has been initialized
  const [initialized, setInitialized] = useState(false);

  // State to track if the current effective theme is dark
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Get system preference for dark mode
  const getSystemThemePreference = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? THEMES.DARK 
      : THEMES.LIGHT;
  };

  // Get the effective theme (resolving system preference)
  const getEffectiveTheme = () => {
    return theme === THEMES.SYSTEM ? getSystemThemePreference() : theme;
  };

  // Update the theme
  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === THEMES.SYSTEM) {
        applyTheme(getSystemThemePreference());
      }
    };

    // Set up the listener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    // Clean up the listener
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [theme]);

  // Apply the theme to the document
  const applyTheme = (activeTheme) => {
    const isDark = activeTheme === THEMES.DARK;
    
    // Update the document
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    setIsDarkMode(isDark);
  };

  // Initialize theme on mount and when theme changes
  useEffect(() => {
    const effectiveTheme = getEffectiveTheme();
    applyTheme(effectiveTheme);
    setInitialized(true);
  }, [theme]);

  // Create the context value object
  const contextValue = {
    theme,
    isDarkMode,
    initialized,
    setTheme: updateTheme,
    toggleTheme: () => {
      const newTheme = isDarkMode ? THEMES.LIGHT : THEMES.DARK;
      updateTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to use the theme context
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;