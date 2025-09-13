import React from "react";
import { Ship, Plane, Truck, MapPin } from "lucide-react";
import { ports } from "../data/routes";

interface RouteMapProps {
  origin: string;
  destination: string;
  selectedRoute?: any;
}

export function RouteMap({ origin, destination, selectedRoute }: RouteMapProps) {
  // In a real implementation, this would use a mapping library like react-leaflet or react-simple-maps
  // For this demo, we'll create a simplified visual representation
  
  // Find origin and destination coordinates (simplified)
  const originPort = ports.find(p => p.name.toLowerCase().includes(origin.toLowerCase()));
  const destPort = ports.find(p => p.name.toLowerCase().includes(destination.toLowerCase()));
  
  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'ocean':
        return <Ship className="text-blue-600" />;
      case 'air':
        return <Plane className="text-purple-600" />;
      case 'rail':
        return <Truck className="text-amber-600" />;
      case 'truck':
        return <Truck className="text-green-600" />;
      default:
        return <MapPin />;
    }
  };
  
  return (
    <div className="w-full h-full relative bg-blue-50 rounded-lg overflow-hidden">
      {/* World Map Background (simplified) */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1080&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
      
      {/* Map Content */}
      <div className="absolute inset-0 p-6 flex flex-col">
        <div className="flex-1 relative">
          {/* Origin Point */}
          {originPort && (
            <div 
              className="absolute w-4 h-4 bg-blue-600 rounded-full shadow-md"
              style={{
                left: `${((originPort.coordinates[0] + 180) / 360) * 100}%`,
                top: `${((90 - originPort.coordinates[1]) / 180) * 100}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs font-medium shadow-sm">
                {origin}
              </div>
            </div>
          )}
          
          {/* Destination Point */}
          {destPort && (
            <div 
              className="absolute w-4 h-4 bg-red-600 rounded-full shadow-md"
              style={{
                left: `${((destPort.coordinates[0] + 180) / 360) * 100}%`,
                top: `${((90 - destPort.coordinates[1]) / 180) * 100}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs font-medium shadow-sm">
                {destination}
              </div>
            </div>
          )}
          
          {/* Route Path */}
          {selectedRoute && originPort && destPort && (
            <svg 
              className="absolute inset-0 w-full h-full" 
              style={{ pointerEvents: 'none' }}
            >
              {selectedRoute.segments.map((segment: any, index: number) => {
                // In a real implementation, we would use actual segment coordinates
                // For this demo, we'll use a simplified approach
                
                const startX = index === 0 
                  ? ((originPort.coordinates[0] + 180) / 360) * 100
                  : ((ports[0].coordinates[0] + 180) / 360) * 100;
                
                const startY = index === 0
                  ? ((90 - originPort.coordinates[1]) / 180) * 100
                  : ((90 - ports[0].coordinates[1]) / 180) * 100;
                
                const endX = index === selectedRoute.segments.length - 1
                  ? ((destPort.coordinates[0] + 180) / 360) * 100
                  : ((ports[1].coordinates[0] + 180) / 360) * 100;
                
                const endY = index === selectedRoute.segments.length - 1
                  ? ((90 - destPort.coordinates[1]) / 180) * 100
                  : ((90 - ports[1].coordinates[1]) / 180) * 100;
                
                // Add curve to the path
                const curveX = (startX + endX) / 2;
                const curveY = Math.min(startY, endY) - 10;
                
                const strokeColor = segment.mode === 'ocean' ? '#2563eb' : 
                                   segment.mode === 'air' ? '#9333ea' : '#16a34a';
                
                return (
                  <g key={index}>
                    {/* Path */}
                    <path
                      d={`M${startX}% ${startY}% Q ${curveX}% ${curveY}%, ${endX}% ${endY}%`}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="2"
                      strokeDasharray={segment.mode === 'air' ? '5,5' : ''}
                    />
                    
                    {/* Transport Icon */}
                    <foreignObject
                      x={`${(startX + endX) / 2 - 2}%`}
                      y={`${curveY - 2}%`}
                      width="24"
                      height="24"
                      className="overflow-visible"
                    >
                      <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
                        {getTransportIcon(segment.mode)}
                      </div>
                    </foreignObject>
                  </g>
                );
              })}
            </svg>
          )}
        </div>
        
        {/* Legend */}
        <div className="bg-white bg-opacity-80 rounded-lg p-3 self-end mt-auto">
          <div className="text-xs font-medium mb-2">Transport Modes</div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <Ship className="h-4 w-4 text-blue-600" />
              <span className="text-xs">Ocean</span>
            </div>
            <div className="flex items-center gap-1">
              <Plane className="h-4 w-4 text-purple-600" />
              <span className="text-xs">Air</span>
            </div>
            <div className="flex items-center gap-1">
              <Truck className="h-4 w-4 text-green-600" />
              <span className="text-xs">Truck</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* No Route Selected Message */}
      {!selectedRoute && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
          <div className="text-center">
            <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 font-medium">Select a route to view on map</p>
          </div>
        </div>
      )}
    </div>
  );
}