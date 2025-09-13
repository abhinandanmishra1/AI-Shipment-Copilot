
import React from 'react';
import type { ShipmentRoute, CostAnalysisFactor } from '../types';
import { CubeIcon } from './icons/CubeIcon';
import { ClockIcon } from './icons/ClockIcon';
import { ShieldIcon } from './icons/ShieldIcon';

interface RouteAnalysisProps {
  route: ShipmentRoute | null;
  analysis: CostAnalysisFactor[] | null;
  isLoading: boolean;
}

const getIconForFactor = (factorName: string) => {
  const lowerCaseFactor = factorName.toLowerCase();
  if (lowerCaseFactor.includes('mode') || lowerCaseFactor.includes('transport')) {
    return <CubeIcon className="w-6 h-6 text-slate-500" />;
  }
  if (lowerCaseFactor.includes('time') || lowerCaseFactor.includes('speed')) {
    return <ClockIcon className="w-6 h-6 text-slate-500" />;
  }
  if (lowerCaseFactor.includes('risk') || lowerCaseFactor.includes('delay')) {
    return <ShieldIcon className="w-6 h-6 text-slate-500" />;
  }
  return <CubeIcon className="w-6 h-6 text-slate-500" />; // Default icon
};

const ImpactBadge: React.FC<{ impact: 'High' | 'Medium' | 'Low' }> = ({ impact }) => {
  const baseClasses = 'px-2 py-0.5 text-xs font-semibold rounded-full';
  const colorClasses = {
    High: 'bg-red-100 text-red-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-green-100 text-green-800',
  };
  return <span className={`${baseClasses} ${colorClasses[impact]}`}>{impact} Impact</span>;
};

export const RouteAnalysis: React.FC<RouteAnalysisProps> = ({ route, analysis, isLoading }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-slate-700 flex items-center shrink-0">
        Route Cost Analysis
      </h2>
      
      {!route && (
        <div className="flex-grow flex flex-col justify-center items-center text-center text-slate-500 p-4">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <p>Select a route from the visualizer to see a detailed cost breakdown.</p>
        </div>
      )}

      {isLoading && (
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="ml-3 text-slate-600">Analyzing costs...</p>
        </div>
      )}

      {route && !isLoading && analysis && (
        <div className="flex-grow overflow-y-auto -mr-2 pr-2">
          <h3 className="font-bold text-md text-blue-700 mb-3 sticky top-0 bg-white pb-2">{route.route_name}</h3>
          <div className="space-y-4">
            {analysis.map((factor, index) => (
              <div key={index} className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-start gap-4">
                <div className="shrink-0 bg-slate-200 rounded-full p-2">
                  {getIconForFactor(factor.factor_name)}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-slate-800">{factor.factor_name}</h4>
                  </div>
                  <ImpactBadge impact={factor.impact} />
                  <p className="text-slate-600 text-sm mt-2">{factor.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

       {route && !isLoading && !analysis && (
         <div className="flex-grow flex flex-col justify-center items-center text-center text-red-600 p-4">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p>Could not load analysis for this route. Please try again.</p>
        </div>
       )}
    </div>
  );
};
