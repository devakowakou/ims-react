import React from 'react';

const Logo = ({ className = "h-8 w-8", showText = true }) => {
  return (
    <div className="flex items-center gap-2">
      <svg 
        className={className} 
        viewBox="0 0 512 512" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Circle */}
        <circle cx="256" cy="256" r="256" fill="url(#gradient1)"/>
        
        {/* Gradient Definition */}
        <defs>
          <linearGradient id="gradient1" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#667eea"/>
            <stop offset="100%" stopColor="#764ba2"/>
          </linearGradient>
          <linearGradient id="gradient2" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f093fb"/>
            <stop offset="100%" stopColor="#f5576c"/>
          </linearGradient>
        </defs>
        
        {/* Box/Package Icon */}
        <g transform="translate(128, 128)">
          {/* Main Box */}
          <path d="M128 40 L256 100 L256 220 L128 280 L0 220 L0 100 Z" fill="white" opacity="0.9"/>
          <path d="M128 40 L256 100 L256 220 L128 280 Z" fill="white" opacity="0.7"/>
          <path d="M128 40 L0 100 L0 220 L128 280 Z" fill="white" opacity="0.5"/>
          
          {/* Top Lines */}
          <line x1="128" y1="40" x2="128" y2="160" stroke="url(#gradient2)" strokeWidth="8" strokeLinecap="round"/>
          <line x1="0" y1="100" x2="128" y2="40" stroke="white" strokeWidth="6" strokeLinecap="round"/>
          <line x1="256" y1="100" x2="128" y2="40" stroke="white" strokeWidth="6" strokeLinecap="round"/>
          
          {/* IMS Text */}
          <text x="128" y="200" fontFamily="Arial, sans-serif" fontSize="60" fontWeight="bold" fill="url(#gradient2)" textAnchor="middle">IMS</text>
        </g>
      </svg>
      {showText && <span className="font-semibold text-lg">IMS</span>}
    </div>
  );
};

export default Logo;
