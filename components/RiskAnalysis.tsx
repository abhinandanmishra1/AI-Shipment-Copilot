import React from 'react';
import type { RiskAnalysisResponse } from '../types';
import { WarningIcon } from './icons/WarningIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface RiskAnalysisProps {
  analysis: RiskAnalysisResponse | null;
  isLoading: boolean;
  onRunAnalysis: () => void;
  hasPlanned: boolean; // To know if a plan has been generated
}

const SeverityBadge: React.FC<{ severity: 'High' | 'Medium' | 'Low' }> = ({ severity }) => {
  const baseClasses = 'px-2 py-0.5 text-xs font-semibold rounded-full';
  const colorClasses = {
    High: 'bg-red-100 text-red-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-orange-100 text-orange-800',
  };
  return <span className={`${baseClasses} ${colorClasses[severity]}`}>{severity} Risk</span>;
};


export const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ analysis, isLoading, onRunAnalysis, hasPlanned }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-slate-700 shrink-0">
        Risk Analysis
      </h2>

      {!hasPlanned && (
         <div className="flex-grow flex flex-col justify-center items-center text-center text-slate-500 p-4">
          <p>Complete a shipment plan to enable risk analysis.</p>
        </div>
      )}

      {hasPlanned && !analysis && (
        <div className="flex-grow flex flex-col justify-center items-center text-center">
            <p className="text-slate-600 mb-4">Check the selected route for potential issues based on your constraints.</p>
            <button
                onClick={onRunAnalysis}
                disabled={isLoading}
                className="bg-slate-700 text-white font-bold py-2 px-4 rounded-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:bg-slate-400 transition-colors"
            >
                {isLoading ? 'Analyzing...' : 'Run Risk Analysis'}
            </button>
        </div>
      )}

      {isLoading && hasPlanned && (
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
          <p className="ml-3 text-slate-600">Analyzing risks...</p>
        </div>
      )}

      {analysis && !isLoading && (
        <div className="flex-grow overflow-y-auto -mr-2 pr-2">
            {analysis.risks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-green-700 bg-green-50 rounded-lg p-4">
                    <CheckCircleIcon className="w-12 h-12 text-green-500 mb-3" />
                    <h3 className="font-semibold text-lg">Good to Go</h3>
                    <p className="text-sm">No significant risks were identified for this route based on the provided data and constraints.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {analysis.risks.map((risk, index) => (
                        <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                            <div className="flex items-start gap-3">
                                <WarningIcon className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-semibold text-slate-800">{risk.risk_name}</h4>
                                        <SeverityBadge severity={risk.severity} />
                                    </div>
                                    <p className="text-slate-600 text-sm mb-2">{risk.description}</p>
                                    <p className="text-xs text-slate-500"><strong className="font-medium text-slate-600">Mitigation:</strong> {risk.mitigation}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      )}
    </div>
  );
};