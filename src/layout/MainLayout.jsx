import React from 'react';
import ThemeToggle from '../components/ThemeToggle';

const MainLayout = ({ children }) => {
  return (
    <div>
      <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 50 }}>
        <ThemeToggle />
      </div>
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
