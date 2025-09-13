
import React from 'react';

export const PlaneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M2 21h20L12 2 2 21z" transform="rotate(-45 12 12)"/>
    <line x1="12" y1="12" x2="6" y2="18"/>
    <line x1="12" y1="12" x2="18" y2="18"/>
  </svg>
);
