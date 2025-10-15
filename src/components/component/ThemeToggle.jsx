import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { isDarkTheme, toggleTheme } = useTheme();

  return (
    <div className={`theme-toggle ${isDarkTheme ? 'dark' : ''}`} onClick={toggleTheme}>
      <div className="toggle-track">
        <div className="toggle-thumb"></div>
      </div>
      <div className="toggle-label">{isDarkTheme ? 'Dark Mode' : 'Light Mode'}</div>
    </div>
  );
};

export default ThemeToggle;
