// context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
  setTheme: (theme: string) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<string>('light');

  // Apply theme to DOM - REMOVES OLD THEME COMPLETELY
  const applyTheme = (themeName: string) => {
    console.log('🔄 Applying theme:', themeName);
    
    // Remove ALL theme classes first
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.removeAttribute('data-theme');
    
    // Then apply the new theme
    if (themeName === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      console.log('🌙 Dark mode applied');
    } else if (themeName === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');
      console.log('☀️ Light mode applied');
    } else if (themeName === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
        console.log('🌙 System dark mode applied');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.setAttribute('data-theme', 'light');
        console.log('☀️ System light mode applied');
      }
    }
    
    // Save to localStorage
    localStorage.setItem('theme', themeName);
  };

  // Get user theme from API
  const fetchUserTheme = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        const savedTheme = localStorage.getItem('theme') || 'light';
        console.log('📦 No token, using saved theme:', savedTheme);
        setTheme(savedTheme);
        applyTheme(savedTheme);
        return;
      }

      console.log('🔑 Fetching user theme from API...');
      const response = await axios.get(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success && response.data.data) {
        const userData = response.data.data;
        const userTheme = userData.theme || 'light';
        
        console.log('✅ User theme from API:', userTheme);
        
        // REMOVE OLD THEME and apply new
        setTheme(userTheme);
        applyTheme(userTheme);
        localStorage.setItem('theme', userTheme);
      } else {
        const savedTheme = localStorage.getItem('theme') || 'light';
        console.log('⚠️ API error, using saved theme:', savedTheme);
        setTheme(savedTheme);
        applyTheme(savedTheme);
      }
    } catch (error) {
      console.error('❌ Error fetching user theme:', error);
      const savedTheme = localStorage.getItem('theme') || 'light';
      console.log('📦 Error, using saved theme:', savedTheme);
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  };

  // Update user theme in database - REMOVES OLD THEME AND ADDS NEW
  const updateUserTheme = async (newTheme: string) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('ℹ️ No token, theme saved locally only');
        return;
      }

      console.log('📤 Updating user theme in database to:', newTheme);
      
      const response = await axios.patch(
        `${API_URL}/api/auth/update-profile`,
        { theme: newTheme },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        console.log('✅ Theme updated in database successfully');
        
        // Verify the update
        const userResponse = await axios.get(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (userResponse.data.success && userResponse.data.data) {
          const updatedTheme = userResponse.data.data.theme;
          console.log('🔄 Verified theme from database:', updatedTheme);
          
          // Ensure local state matches database
          if (updatedTheme !== newTheme) {
            console.log('⚠️ Theme mismatch, syncing with database:', updatedTheme);
            setTheme(updatedTheme);
            applyTheme(updatedTheme);
            localStorage.setItem('theme', updatedTheme);
          }
        }
      } else {
        console.error('❌ Failed to update theme in database:', response.data.message);
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        applyTheme(savedTheme);
      }
    } catch (error) {
      console.error('❌ Error updating user theme:', error);
      const savedTheme = localStorage.getItem('theme') || 'light';
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  };

  // Set theme - REMOVES OLD AND ADDS NEW
  const handleSetTheme = async (newTheme: string) => {
    console.log('🎯 Setting theme to:', newTheme);
    
    // REMOVE OLD THEME and apply new immediately
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update in database
    await updateUserTheme(newTheme);
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    handleSetTheme(newTheme);
  };

  // Check if dark mode is active
  const isDark = theme === 'dark' || 
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Listen for system theme changes if system theme is selected
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        console.log('🔄 System theme changed:', e.matches ? 'dark' : 'light');
        // REMOVE OLD THEME
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.removeAttribute('data-theme');
        
        if (e.matches) {
          document.documentElement.classList.add('dark');
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.classList.add('light');
          document.documentElement.setAttribute('data-theme', 'light');
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Initial load - only once
  useEffect(() => {
    fetchUserTheme();
  }, []);

  console.log('🏷️ Current theme state:', { theme, isDark });

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: handleSetTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};