import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Truck, Ship, Plane, CheckCircle, Calendar, Loader2 } from 'lucide-react';
import type { RouteSegment } from '../types';

interface RouteTimelineProps {
  segments: RouteSegment[] | null;
  isLoading: boolean;
}

const getIconForSegment = (segment: RouteSegment) => {
  switch (segment.type) {
    case 'origin':
      return <MapPin className="w-4 h-4 text-green-600" />;
    case 'destination':
      return <MapPin className="w-4 h-4 text-red-600" />;
    case 'transit':
      switch (segment.mode) {
        case 'truck':
          return <Truck className="w-4 h-4 text-blue-600" />;
        case 'sea':
          return <Ship className="w-4 h-4 text-blue-600" />;
        case 'air':
          return <Plane className="w-4 h-4 text-blue-600" />;
        default:
          return null;
      }
    default:
      return null;
  }
};

export const RouteTimeline: React.FC<RouteTimelineProps> = ({ segments, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Route Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-muted-foreground">Generating timeline...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!segments) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Route Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground text-center">
            Select a route to view its detailed timeline
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Route Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Header */}
          <div className="relative pb-6">
            <div className="absolute left-4 top-8 -ml-px h-full w-0.5 bg-border"></div>
            <div className="relative flex items-start">
              <div className="relative z-10">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Calendar className="h-4 w-4" />
                </div>
              </div>
              <div className="ml-4 pt-1">
                <Badge variant="outline" className="mb-2">Scheduled</Badge>
                <p className="font-medium">Shipment Scheduled</p>
                <p className="text-sm text-muted-foreground">Awaiting pickup from origin</p>
              </div>
            </div>
          </div>

          {/* Segments */}
          {segments.map((segment, index) => (
            <div key={index} className="relative pb-6">
              {index < segments.length - 1 && (
                <div className="absolute left-4 top-8 -ml-px h-full w-0.5 bg-border"></div>
              )}
              <div className="relative flex items-start">
                <div className="relative z-10">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background border-2 border-border">
                    {getIconForSegment(segment)}
                  </div>
                </div>
                <div className="ml-4 w-full pt-1">
                  <Card className="border-muted">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{segment.location}</p>
                        {segment.type === 'origin' && <Badge variant="secondary">Origin</Badge>}
                        {segment.type === 'destination' && <Badge variant="secondary">Destination</Badge>}
                        {segment.type === 'transit' && <Badge variant="outline">{segment.mode}</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{segment.details}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ))}

          {/* Footer */}
          <div className="relative">
            <div className="relative flex items-start">
              <div className="relative z-10">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white">
                  <CheckCircle className="h-4 w-4" />
                </div>
              </div>
              <div className="ml-4 pt-1">
                <Badge className="mb-2 bg-green-600">Complete</Badge>
                <p className="font-medium">Shipment Complete</p>
                <p className="text-sm text-muted-foreground">Delivered to final destination</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};