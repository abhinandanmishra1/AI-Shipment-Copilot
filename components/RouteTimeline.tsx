
import React from 'react';
import type { RouteSegment } from '../types';
import { LocationPinIcon } from './icons/LocationPinIcon';
import { TruckIcon } from './icons/TruckIcon';
import { BoatIcon } from './icons/BoatIcon';
import { PlaneIcon } from './icons/PlaneIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { CalendarIcon } from './icons/CalendarIcon';

interface RouteTimelineProps {
  segments: RouteSegment[] | null;
  isLoading: boolean;
}

const getIconForSegment = (segment: RouteSegment) => {
  switch (segment.type) {
    case 'origin':
      return <LocationPinIcon className="w-5 h-5 text-slate-600" />;
    case 'destination':
      return <LocationPinIcon className="w-5 h-5 text-slate-600" />;
    case 'transit':
      switch (segment.mode) {
        case 'truck':
          return <TruckIcon className="w-5 h-5 text-slate-600" />;
        case 'sea':
          return <BoatIcon className="w-5 h-5 text-slate-600" />;
        case 'air':
          return <PlaneIcon className="w-5 h-5 text-slate-600" />;
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
        <div className="flex items-center justify-center h-full min-h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="ml-3 text-slate-600">Generating timeline...</p>
        </div>
    );
  }
  
  if (!segments) {
    return (
        <div className="flex items-center justify-center text-center text-slate-500 h-full min-h-[300px] bg-slate-50 rounded-lg">
            <p>Select a route to view its detailed timeline.</p>
        </div>
    );
  }

  return (
    <div>
        {/* Header */}
        <div className="relative pb-6">
            <div className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-slate-200"></div>
            <div className="relative flex items-start">
                <div className="relative z-10">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white ring-8 ring-white">
                        <CalendarIcon className="h-5 w-5" />
                    </div>
                </div>
                <div className="ml-4 pt-1.5">
                    <p className="font-semibold text-slate-800">Shipment Scheduled</p>
                    <p className="text-sm text-slate-500">Awaiting pickup from origin.</p>
                </div>
            </div>
        </div>

        {/* Segments */}
        {segments.map((segment, index) => (
            <div key={index} className="relative pb-8">
                {index < segments.length && (
                   <div className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-slate-200"></div>
                )}
                 <div className="relative flex items-start">
                    <div className="relative z-10">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border-2 border-slate-300">
                           {getIconForSegment(segment)}
                        </div>
                    </div>
                    <div className="ml-4 w-full pt-1.5">
                        <div className="bg-white border border-slate-200 rounded-lg p-4">
                            <p className="text-sm font-medium text-slate-500">{segment.details}</p>
                            <p className="font-semibold text-slate-800">{segment.location}</p>
                        </div>
                    </div>
                 </div>
            </div>
        ))}

         {/* Footer */}
         <div className="relative">
            <div className="relative flex items-start">
                <div className="relative z-10">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border-2 border-green-500">
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    </div>
                </div>
                <div className="ml-4 pt-1.5">
                    <p className="font-semibold text-slate-800">Shipment Complete</p>
                    <p className="text-sm text-slate-500">Delivered to final destination.</p>
                </div>
            </div>
        </div>
    </div>
  );
};
