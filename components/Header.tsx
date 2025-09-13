
import React from 'react';
import { ShipIcon } from './icons/ShipIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center">
        <ShipIcon className="h-8 w-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-slate-800 ml-3">
          AI Shipment Planning Copilot
        </h1>
      </div>
    </header>
  );
};
