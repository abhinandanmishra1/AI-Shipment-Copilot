import React, { useState } from 'react';

interface InputFormProps {
  onPlanShipment: (goal: string, constraints: string) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onPlanShipment, isLoading }) => {
  const [goal, setGoal] = useState<string>('Find the fastest route from Shanghai to Los Angeles that is under $20,000.');
  const [constraints, setConstraints] = useState<string>('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goal.trim()) {
      onPlanShipment(goal.trim(), constraints.trim());
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-slate-700">1. Define Your Goal</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-slate-600 mb-1">
            Planning Goal
          </label>
          <p className="text-xs text-slate-500 mb-2">Describe your ideal shipment plan in natural language.</p>
          <textarea
            id="goal"
            rows={4}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g., 'A route that avoids ports with high congestion and keeps costs low'"
            className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            required
          />
        </div>

        <div>
           <label htmlFor="constraints" className="block text-sm font-medium text-slate-600 mb-1">
            Additional Constraints <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
           <p className="text-xs text-slate-500 mb-2">Mention any specific requirements like temperature control, hazardous materials, etc.</p>
          <textarea
            id="constraints"
            rows={2}
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            placeholder="e.g., 'Requires refrigeration at 5°C', 'Avoids travel through high-risk piracy zones'"
            className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !goal.trim()}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200 text-base"
        >
          {isLoading ? 'Planning...' : 'Plan Shipment'}
        </button>
      </form>
    </div>
  );
};