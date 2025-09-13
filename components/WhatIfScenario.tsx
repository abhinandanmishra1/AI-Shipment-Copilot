
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { FlaskConical, Fuel, Clock } from 'lucide-react';
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-primary" />
          What-If Scenarios
        </CardTitle>
        <CardDescription>
          Adjust parameters to see how changes affect your routes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Fuel className="h-4 w-4" />
              Fuel Cost Increase
            </span>
            <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
              {params.fuelCostIncreasePercentage}%
            </span>
          </Label>
          <Slider
            value={[params.fuelCostIncreasePercentage]}
            onValueChange={(value) => setParams(prev => ({ ...prev, fuelCostIncreasePercentage: value[0] }))}
            max={100}
            step={5}
            className="w-full"
          />
        </div>
        
        <div className="space-y-3">
          <Label className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Additional Customs Delay
            </span>
            <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
              {params.additionalCustomsDelayDays} days
            </span>
          </Label>
          <Slider
            value={[params.additionalCustomsDelayDays]}
            onValueChange={(value) => setParams(prev => ({ ...prev, additionalCustomsDelayDays: value[0] }))}
            max={10}
            step={1}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};
