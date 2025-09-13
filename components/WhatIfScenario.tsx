
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { FlaskConical, Fuel, Clock, Sliders, RefreshCw, Zap, AlertTriangle, TrendingUp } from 'lucide-react';
import type { WhatIfParams } from '../types';

interface WhatIfScenarioProps {
  params: WhatIfParams;
  setParams: React.Dispatch<React.SetStateAction<WhatIfParams>>;
  onRecalculate?: () => void;
  isRecalculating?: boolean;
}

export const WhatIfScenario: React.FC<WhatIfScenarioProps> = ({ 
  params, 
  setParams, 
  onRecalculate,
  isRecalculating = false 
}) => {
  const [hasChanges, setHasChanges] = useState(false);

  const handleParamChange = (key: keyof WhatIfParams, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleRecalculate = () => {
    onRecalculate?.();
    setHasChanges(false);
  };

  const resetParams = () => {
    setParams({ fuelCostIncreasePercentage: 0, additionalCustomsDelayDays: 0 });
    setHasChanges(false);
  };

  const getImpactLevel = (fuelIncrease: number, delayDays: number) => {
    const totalImpact = fuelIncrease + (delayDays * 10);
    if (totalImpact === 0) return { level: 'None', color: 'bg-gray-100 text-gray-700', icon: null };
    if (totalImpact <= 20) return { level: 'Low', color: 'bg-green-100 text-green-700', icon: <TrendingUp className="h-3 w-3" /> };
    if (totalImpact <= 50) return { level: 'Medium', color: 'bg-yellow-100 text-yellow-700', icon: <AlertTriangle className="h-3 w-3" /> };
    return { level: 'High', color: 'bg-red-100 text-red-700', icon: <AlertTriangle className="h-3 w-3" /> };
  };

  const impact = getImpactLevel(params.fuelCostIncreasePercentage, params.additionalCustomsDelayDays);

  return (
    <Card className="dashboard-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
              <Sliders className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">What-If Scenarios</CardTitle>
              <CardDescription className="text-sm">
                Simulate market changes and disruptions
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className={impact.color}>
            {impact.icon}
            <span className="ml-1">{impact.level} Impact</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Fuel Cost Scenario */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 font-medium">
              <div className="w-6 h-6 rounded bg-orange-100 flex items-center justify-center">
                <Fuel className="h-3 w-3 text-orange-600" />
              </div>
              Fuel Cost Increase
            </Label>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-mono">
                {params.fuelCostIncreasePercentage}%
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <Slider
              value={[params.fuelCostIncreasePercentage]}
              onValueChange={(value) => handleParamChange('fuelCostIncreasePercentage', value[0])}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
          
          {params.fuelCostIncreasePercentage > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-sm text-orange-800">
                <strong>Impact:</strong> Routes will see approximately {params.fuelCostIncreasePercentage}% cost increase
              </p>
            </div>
          )}
        </div>

        <Separator />

        {/* Customs Delay Scenario */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 font-medium">
              <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center">
                <Clock className="h-3 w-3 text-blue-600" />
              </div>
              Additional Customs Delay
            </Label>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-mono">
                {params.additionalCustomsDelayDays} days
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <Slider
              value={[params.additionalCustomsDelayDays]}
              onValueChange={(value) => handleParamChange('additionalCustomsDelayDays', value[0])}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0 days</span>
              <span>5 days</span>
              <span>10 days</span>
            </div>
          </div>
          
          {params.additionalCustomsDelayDays > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Impact:</strong> Transit times will increase by {params.additionalCustomsDelayDays} day{params.additionalCustomsDelayDays !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={handleRecalculate}
            disabled={!hasChanges || isRecalculating}
            className="flex-1 gradient-button"
          >
            {isRecalculating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Recalculating...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Recalculate Routes
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={resetParams}
            disabled={params.fuelCostIncreasePercentage === 0 && params.additionalCustomsDelayDays === 0}
          >
            Reset
          </Button>
        </div>

        {/* Quick Scenarios */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Quick Scenarios:</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setParams({ fuelCostIncreasePercentage: 25, additionalCustomsDelayDays: 2 });
                setHasChanges(true);
              }}
              className="text-xs"
            >
              Market Volatility
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setParams({ fuelCostIncreasePercentage: 50, additionalCustomsDelayDays: 5 });
                setHasChanges(true);
              }}
              className="text-xs"
            >
              Supply Chain Crisis
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
