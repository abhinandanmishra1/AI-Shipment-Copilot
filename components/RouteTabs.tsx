import React from 'react';
import type { ShipmentRoute } from '../types';

interface RouteTabsProps {
  routes: ShipmentRoute[];
  selectedRoute: ShipmentRoute | null;
  onSelectRoute: (route: ShipmentRoute) => void;
  loadingStatus?: Record<string, boolean>;
}

export const RouteTabs: React.FC<RouteTabsProps> = ({ routes, selectedRoute, onSelectRoute, loadingStatus = {} }) => {
  return (
    <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
      {routes.map((route) => {
        const isLoading = loadingStatus[route.route_name] ?? false;
        return (
          <button
            key={route.route_name}
            onClick={() => onSelectRoute(route)}
            disabled={isLoading}
            className={`
              ${selectedRoute?.route_name === route.route_name
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }
              flex items-center gap-2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm focus:outline-none transition-colors duration-200 disabled:opacity-50
            `}
            aria-current={selectedRoute?.route_name === route.route_name ? 'page' : undefined}
          >
            <span>{route.route_name}</span>
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            )}
          </button>
        )
      })}
    </nav>
  );
};