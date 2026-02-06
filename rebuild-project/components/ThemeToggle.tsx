'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const ThemeToggle = ({ isScrolled }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`${isScrolled ? 'text-foreground/80' : 'text-foreground/80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] dark:drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]'} p-2 rounded-full hover:bg-gold/20 transition-colors duration-300 relative`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <MoonIcon className="w-5 h-5" />
      ) : (
        <SunIcon className="w-5 h-5" />
      )}
    </button>
  );
};

export default ThemeToggle;