import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { isDarkTheme, toggleTheme } = useTheme();

  return (
    <button 
      className={`theme-toggle ${isDarkTheme ? 'dark' : 'light'}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDarkTheme ? 'light' : 'dark'} theme`}
    >
      <span className="toggle-track">
        <span className="toggle-thumb">
          {isDarkTheme ? '🌙' : '☀️'}
        </span>
      </span>
      <span className="toggle-label">
        {isDarkTheme ? 'Dark Mode' : 'Light Mode'}
      </span>
    </button>
  );
};

export default ThemeToggle;