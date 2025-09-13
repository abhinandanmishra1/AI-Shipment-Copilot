import React from 'react';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Loader2 } from 'lucide-react';
import type { ShipmentRoute } from '../types';

interface RouteTabsProps {
  routes: ShipmentRoute[];
  selectedRoute: ShipmentRoute | null;
  onSelectRoute: (route: ShipmentRoute) => void;
  loadingStatus?: Record<string, boolean>;
}

export const RouteTabs: React.FC<RouteTabsProps> = ({ routes, selectedRoute, onSelectRoute, loadingStatus = {} }) => {
  return (
    <Tabs value={selectedRoute?.route_name || ''} className="w-full">
      <TabsList className="grid w-full grid-cols-5 h-auto p-1">
      {routes.map((route) => {
        const isLoading = loadingStatus[route.route_name] ?? false;
        return (
            <TabsTrigger
            key={route.route_name}
              value={route.route_name}
            onClick={() => onSelectRoute(route)}
            disabled={isLoading}
              className="flex items-center gap-2 text-xs py-2 px-3 data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
              <span className="truncate">{route.route_name.replace('Route ', '')}</span>
            {isLoading && (
                <Loader2 className="h-3 w-3 animate-spin" />
            )}
            </TabsTrigger>
        )
      })}
      </TabsList>
    </Tabs>
  );
};