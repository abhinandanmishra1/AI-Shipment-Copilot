import React from 'react';
import type { PlannerResponse, StructuredExplanation, ProsCons } from '../types';
import { InfoIcon } from './icons/InfoIcon';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';

interface ResultsDisplayProps {
  plannerResponse: PlannerResponse | null;
  explanation: StructuredExplanation | null;
}

const ProsConsList: React.FC<{ list: string[]; type: 'pros' | 'cons' }> = ({ list, type }) => {
  if (list.length === 0) return null;
  
  const isPros = type === 'pros';
  const icon = isPros ? 
    <CheckIcon className="h-5 w-5 text-green-500 shrink-0" /> : 
    <XIcon className="h-5 w-5 text-red-500 shrink-0" />;
  const title = isPros ? 'Pros' : 'Cons';
  const textColor = isPros ? 'text-slate-700' : 'text-slate-700';

  return (
    <div>
      <h4 className="text-sm font-semibold mb-2 text-slate-600">{title}</h4>
      <ul className="space-y-2">
        {list.map((item, index) => (
          <li key={index} className={`flex items-start gap-2 text-sm ${textColor}`}>
            {icon}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ plannerResponse, explanation }) => {
  if (!plannerResponse) return null;

  return (
    <div>
        <h2 className="text-xl font-semibold mb-4 text-slate-700">AI Copilot Analysis</h2>
        
        {/* Suggested Route */}
        <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <h3 className="text-lg font-semibold text-blue-800">Suggested Route: <span className="font-bold">{plannerResponse.suggested_route}</span></h3>
            <p className="text-blue-700 mt-1">{plannerResponse.reason}</p>
        </div>
        
        {explanation && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Suggested Route Pros & Cons */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-3">Analysis of Suggested Route</h3>
                    <div className="space-y-4">
                        <ProsConsList list={explanation.suggested_route_summary.pros} type="pros" />
                        <ProsConsList list={explanation.suggested_route_summary.cons} type="cons" />
                    </div>
                </div>

                {/* Alternatives */}
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 flex items-center">
                       <InfoIcon className="h-5 w-5 mr-2 text-slate-500" />
                        Alternative Options
                    </h3>
                    {explanation.alternatives.slice(0, 2).map((alt) => (
                        <div key={alt.route_name} className="bg-white p-4 rounded-lg border border-slate-200">
                           <h4 className="font-semibold text-slate-700">{alt.route_name}</h4>
                           <p className="text-sm text-slate-600 mt-1 mb-3">{alt.summary}</p>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <ProsConsList list={alt.pros} type="pros" />
                             <ProsConsList list={alt.cons} type="cons" />
                           </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
  );
};