
import React from 'react';

export const ShipIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 4-7-4Z" />
    <path d="M2 12V7l3.5 2 3.5-2 3.5 2 3.5-2 3.5 2v5" />
    <path d="M12 22V8" />
    <path d="M6 12v10" />
    <path d="M18 12v10" />
  </svg>
);
