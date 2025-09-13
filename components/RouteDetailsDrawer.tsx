import React from "react";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerDescription, 
  DrawerFooter,
  DrawerClose
} from "./ui/drawer";
import { Button } from "./ui/button";
import { 
  Ship, 
  Plane, 
  Truck, 
  MapPin, 
  ArrowRight, 
  Clock, 
  DollarSign, 
  AlertTriangle, 
  X, 
  CircleDot, 
  CircleCheckBig, 
  CircleDashed,
  Building,
  Warehouse
} from "lucide-react";
import { Badge } from "./ui/badge";
import { formatCost, formatDuration, getRiskColorClass } from "../data/routes";

interface RouteStop {
  location: string;
  address?: string;
  type: 'origin' | 'destination' | 'transit';
  arrivalTime?: string;
  departureTime?: string;
}

interface RouteSegment {
  from: string;
  to: string;
  mode: 'ocean' | 'air' | 'truck' | 'rail';
  duration: number;
  distance: number;
  details?: string;
}

interface RouteDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  route: any | null;
}

export function RouteDetailsDrawer({ isOpen, onClose, route }: RouteDetailsDrawerProps) {
  if (!route) return null;

  // Mode icon mapping
  const modeIcons: Record<string, React.ReactNode> = {
    ocean: <Ship className="h-5 w-5" />,
    air: <Plane className="h-5 w-5" />,
    rail: <Truck className="h-5 w-5 rotate-45" />,
    truck: <Truck className="h-5 w-5" />
  };

  // Mode color mapping
  const modeColors: Record<string, string> = {
    ocean: 'bg-blue-50 text-blue-700 border-blue-300',
    air: 'bg-purple-50 text-purple-700 border-purple-300',
    rail: 'bg-amber-50 text-amber-700 border-amber-300',
    truck: 'bg-green-50 text-green-700 border-green-300'
  };

  // Generate stops from segments
  const generateStops = (segments: RouteSegment[]): RouteStop[] => {
    const stops: RouteStop[] = [];
    
    // Add origin
    stops.push({
      location: segments[0].from,
      type: 'origin',
      departureTime: 'Sep 13, 2023 08:00 AM'
    });
    
    // Add transit stops
    segments.forEach((segment, index) => {
      if (index < segments.length - 1) {
        stops.push({
          location: segment.to,
          type: 'transit',
          arrivalTime: `+${segment.duration} days`,
          departureTime: `+${segment.duration + 0.5} days`
        });
      }
    });
    
    // Add destination
    stops.push({
      location: segments[segments.length - 1].to,
      type: 'destination',
      arrivalTime: `+${segments.reduce((total, segment) => total + segment.duration, 0)} days`
    });
    
    return stops;
  };

  const stops = generateStops(route.segments);

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()} direction="right">
      <DrawerContent className="max-w-[400px] w-full">
        <div className="w-full h-full overflow-auto">
          <DrawerHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  route.segments[0].mode === 'ocean' ? 'bg-blue-100 text-blue-700' :
                  route.segments[0].mode === 'air' ? 'bg-purple-100 text-purple-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {modeIcons[route.segments[0].mode]}
                </div>
                <div>
                  <DrawerTitle className="text-xl">{route.name}</DrawerTitle>
                  <DrawerDescription>
                    {route.origin} to {route.destination}
                  </DrawerDescription>
                </div>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
                <div className="text-gray-500 text-sm mb-1 flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" /> Total Cost
                </div>
                <div className="font-semibold text-lg">{formatCost(route.totalCost)}</div>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
                <div className="text-gray-500 text-sm mb-1 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Duration
                </div>
                <div className="font-semibold text-lg">{formatDuration(route.totalDuration)}</div>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
                <div className="text-gray-500 text-sm mb-1 flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" /> Risk Score
                </div>
                <div className="font-semibold text-lg">
                  <Badge 
                    variant="outline" 
                    className={`${getRiskColorClass(route.riskScore)}`}
                  >
                    {route.riskScore.toFixed(1)}/10
                  </Badge>
                </div>
              </div>
            </div>
          </DrawerHeader>
          
          <div className="px-6 py-4">
            <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span>Route Timeline</span>
            </h3>
            
            <div className="space-y-0">
              {stops.map((stop, index) => (
                <div key={index} className="relative">
                  {/* Timeline connector */}
                  {index < stops.length - 1 && (
                    <div className="absolute left-6 top-6 bottom-0 w-0.5 bg-blue-300"></div>
                  )}
                  
                  <div className="flex items-start mb-8 relative">
                    {/* Stop icon */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 border-2 ${
                      stop.type === 'origin' ? 'bg-blue-100 text-blue-700 border-blue-400' :
                      stop.type === 'destination' ? 'bg-green-100 text-green-700 border-green-400' :
                      'bg-amber-50 text-amber-700 border-amber-400'
                    }`}>
                      {stop.type === 'origin' ? (
                        <Warehouse className="h-5 w-5" />
                      ) : stop.type === 'destination' ? (
                        <Building className="h-5 w-5" />
                      ) : (
                        <CircleDot className="h-5 w-5" />
                      )}
                    </div>
                    
                    {/* Stop details */}
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {stop.type === 'origin' ? 'Origin' : 
                             stop.type === 'destination' ? 'Destination' : 
                             `Stop ${index}`}
                          </h4>
                          <p className="text-gray-700">{stop.location}</p>
                          {stop.address && <p className="text-sm text-gray-500">{stop.address}</p>}
                        </div>
                        <div className="text-right">
                          {stop.arrivalTime && (
                            <div className="text-sm text-gray-500">
                              Arrival: {stop.arrivalTime}
                            </div>
                          )}
                          {stop.departureTime && (
                            <div className="text-sm text-gray-500">
                              Departure: {stop.departureTime}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Transport mode for the next segment */}
                      {index < stops.length - 1 && (
                        <div className="mt-4 mb-4 pl-2">
                          <div className="flex items-center gap-2 mb-1.5">
                            <ArrowRight className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Next Transport</span>
                          </div>
                          <Badge 
                            variant="outline"
                            className={`${modeColors[route.segments[index].mode]} flex items-center gap-2 px-3 py-2`}
                          >
                            {modeIcons[route.segments[index].mode]}
                            <div className="flex flex-col">
                              <span className="font-medium capitalize">{route.segments[index].mode}</span>
                              <span className="text-xs">
                                {route.segments[index].duration} days, {route.segments[index].distance} km
                              </span>
                            </div>
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
