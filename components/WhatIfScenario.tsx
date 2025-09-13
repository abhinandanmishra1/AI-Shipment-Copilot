
import React from 'react';
import type { WhatIfParams } from '../types';

interface WhatIfScenarioProps {
  params: WhatIfParams;
  setParams: React.Dispatch<React.SetStateAction<WhatIfParams>>;
}

export const WhatIfScenario: React.FC<WhatIfScenarioProps> = ({ params, setParams }) => {

  const handleFuelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams(prev => ({ ...prev, fuelCostIncreasePercentage: Number(e.target.value) }));
  };

  const handleDelayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams(prev => ({ ...prev, additionalCustomsDelayDays: Number(e.target.value) }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-slate-700">2. Run What-If Scenarios</h2>
      <div className="space-y-6">
        <div>
          <label htmlFor="fuel-cost" className="block text-sm font-medium text-slate-600 mb-2">
            Fuel Cost Increase: <span className="font-bold">{params.fuelCostIncreasePercentage}%</span>
          </label>
          <input
            id="fuel-cost"
            type="range"
            min="0"
            max="100"
            step="5"
            value={params.fuelCostIncreasePercentage}
            onChange={handleFuelChange}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <label htmlFor="customs-delay" className="block text-sm font-medium text-slate-600 mb-2">
            Additional Customs Delay: <span className="font-bold">{params.additionalCustomsDelayDays} days</span>
          </label>
          <input
            id="customs-delay"
            type="range"
            min="0"
            max="10"
            step="1"
            value={params.additionalCustomsDelayDays}
            onChange={handleDelayChange}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
