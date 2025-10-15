import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Button } from './ui/button';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative h-9 w-9 rounded-full"
      aria-label="Toggle theme"
    >
      <Sun className={`h-5 w-5 rotate-0 scale-100 transition-all ${isDark ? 'rotate-90 scale-0' : ''}`} />
      <Moon className={`absolute h-5 w-5 rotate-90 scale-0 transition-all ${isDark ? 'rotate-0 scale-100' : ''}`} />
    </Button>
  );
};

export default ThemeToggle;
