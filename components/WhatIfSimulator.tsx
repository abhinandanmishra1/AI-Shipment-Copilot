import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { RefreshCw, TrendingUp, TrendingDown, Minus, RotateCcw } from "lucide-react";

interface WhatIfSimulatorProps {
  fuelCostIncrease?: number;
  customsDelay?: number;
  weatherRisk?: string;
  onParamChange?: (param: string, value: any) => void;
  onRecalculate?: () => void;
}

export function WhatIfSimulator({
  fuelCostIncrease = 0,
  customsDelay = 0,
  weatherRisk = "medium",
  onParamChange,
  onRecalculate
}: WhatIfSimulatorProps) {
  const [fuelCostValue, setFuelCostValue] = useState([fuelCostIncrease]);
  const [customsDelayValue, setCustomsDelayValue] = useState([customsDelay]);
  const [weatherRiskValue, setWeatherRiskValue] = useState(weatherRisk);
  
  // Update local state when props change
  useEffect(() => {
    setFuelCostValue([fuelCostIncrease]);
  }, [fuelCostIncrease]);
  
  useEffect(() => {
    setCustomsDelayValue([customsDelay]);
  }, [customsDelay]);
  
  useEffect(() => {
    setWeatherRiskValue(weatherRisk);
  }, [weatherRisk]);
  
  // Handle parameter changes
  const handleFuelCostChange = (value: number[]) => {
    setFuelCostValue(value);
    if (onParamChange) {
      onParamChange('fuelCostIncrease', value[0]);
    }
  };
  
  const handleCustomsDelayChange = (value: number[]) => {
    setCustomsDelayValue(value);
    if (onParamChange) {
      onParamChange('customsDelay', value[0]);
    }
  };
  
  const handleWeatherRiskChange = (value: string) => {
    setWeatherRiskValue(value);
    if (onParamChange) {
      onParamChange('weatherRisk', value);
    }
  };
  
  // Mock calculated values based on inputs
  const calculateImpact = () => {
    const baseCost = 2660000; // $2.66M from the image
    const baseTime = 12;
    
    const fuelImpact = baseCost * (fuelCostValue[0] / 100);
    const delayImpact = customsDelayValue[0] * 0.5; // days
    const weatherImpact = weatherRiskValue === "high" ? 2 : weatherRiskValue === "medium" ? 1 : 0;
    
    return {
      totalCost: baseCost + fuelImpact,
      totalTime: baseTime + delayImpact + weatherImpact,
      costChange: ((fuelImpact / baseCost) * 100).toFixed(1),
      timeChange: delayImpact + weatherImpact
    };
  };

  const impact = calculateImpact();

  const getChangeIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (value < 0) return <TrendingDown className="h-4 w-4 text-green-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };
  
  // Handle scenario selection
  const handleScenario = (scenario: 'crisis' | 'optimal') => {
    if (scenario === 'crisis') {
      setFuelCostValue([25]);
      setCustomsDelayValue([5]);
      setWeatherRiskValue("high");
      
      if (onParamChange) {
        onParamChange('fuelCostIncrease', 25);
        onParamChange('customsDelay', 5);
        onParamChange('weatherRisk', 'high');
      }
    } else {
      setFuelCostValue([0]);
      setCustomsDelayValue([1]);
      setWeatherRiskValue("low");
      
      if (onParamChange) {
        onParamChange('fuelCostIncrease', 0);
        onParamChange('customsDelay', 1);
        onParamChange('weatherRisk', 'low');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* What-If Simulator Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">What-If Simulator</h3>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-gray-600"
          onClick={() => {
            setFuelCostValue([0]);
            setCustomsDelayValue([0]);
            setWeatherRiskValue("medium");
            
            if (onParamChange) {
              onParamChange('fuelCostIncrease', 0);
              onParamChange('customsDelay', 0);
              onParamChange('weatherRisk', 'medium');
            }
          }}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <CardContent className="p-6 space-y-6">
          {/* Controls */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">Fuel Cost Increase (%)</Label>
                <span className="text-sm font-medium text-gray-900">
                  {fuelCostValue[0] > 0 ? '+' : ''}{fuelCostValue[0]}%
                </span>
              </div>
              <Slider
                value={fuelCostValue}
                onValueChange={handleFuelCostChange}
                max={50}
                min={-20}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">Customs Delay (days)</Label>
                <span className="text-sm font-medium text-gray-900">
                  +{customsDelayValue[0]} days
                </span>
              </div>
              <Slider
                value={customsDelayValue}
                onValueChange={handleCustomsDelayChange}
                max={10}
                min={0}
                step={0.5}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Weather Risk</Label>
              <Select value={weatherRiskValue} onValueChange={handleWeatherRiskChange}>
                <SelectTrigger className="bg-white border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">Total Cost</span>
                {getChangeIcon(parseFloat(impact.costChange))}
              </div>
              <div className="text-2xl font-bold text-blue-900">
                ${(impact.totalCost / 1000000).toFixed(2)}M
              </div>
              <div className="text-sm text-blue-700 mt-1">
                {impact.costChange > 0 ? '+' : ''}{impact.costChange}% change
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-orange-900">Total Time</span>
                {getChangeIcon(impact.timeChange)}
              </div>
              <div className="text-2xl font-bold text-orange-900">
                {impact.totalTime.toFixed(1)} days
              </div>
              <div className="text-sm text-orange-700 mt-1">
                +{impact.timeChange.toFixed(1)} days change
              </div>
            </div>
          </div>

          <Button 
            className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-lg" 
            size="sm"
            onClick={onRecalculate}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Recalculate
          </Button>

          {/* Quick Scenarios */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <Label className="text-sm font-medium text-gray-700">Quick Scenarios</Label>
            <div className="grid grid-cols-1 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleScenario('crisis')}
                className="text-left justify-start border-gray-200 hover:bg-gray-50"
              >
                Crisis Mode
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleScenario('optimal')}
                className="text-left justify-start border-gray-200 hover:bg-gray-50"
              >
                Optimal Conditions
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}