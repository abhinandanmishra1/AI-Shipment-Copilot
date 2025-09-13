
import React from 'react';

export const BoatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M3 20h18L18 8H6L3 20z" />
    <path d="M12 4v4" />
    <path d="M6 8h12" />
  </svg>
);
