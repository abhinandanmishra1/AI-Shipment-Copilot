import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Ship,
  Plane,
  Truck,
  Clock,
  DollarSign,
  AlertTriangle,
  Leaf,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  X
} from "lucide-react";
import { formatCost, formatDuration, getRiskColorClass } from "../data/routes";

interface RouteComparisonProps {
  routes: any[];
  selectedRoutes: string[];
  onSelectRoute: (routeName: string) => void;
  onCompare: (routeNames: string[]) => void;
  recommendedRoute?: string;
}

export function RouteComparison({
  routes,
  selectedRoutes,
  onSelectRoute,
  onCompare,
  recommendedRoute
}: RouteComparisonProps) {
  const [comparisonRoutes, setComparisonRoutes] = useState<string[]>(
    selectedRoutes.length > 0 ? selectedRoutes : recommendedRoute ? [recommendedRoute] : []
  );

  // Toggle route selection for comparison
  const toggleRouteSelection = (routeName: string) => {
    if (comparisonRoutes.includes(routeName)) {
      setComparisonRoutes(comparisonRoutes.filter(r => r !== routeName));
    } else {
      // Limit to 3 routes for comparison
      if (comparisonRoutes.length < 3) {
        setComparisonRoutes([...comparisonRoutes, routeName]);
      }
    }
  };

  // Get selected route objects
  const selectedRouteObjects = routes.filter(route => 
    comparisonRoutes.includes(route.name)
  );

  // Prepare chart data
  const prepareChartData = () => {
    if (selectedRouteObjects.length === 0) return [];

    // Cost and duration data
    const costData = selectedRouteObjects.map(route => ({
      name: route.name.replace('Route ', ''),
      cost: route.totalCost,
      duration: route.totalDuration,
    }));

    return costData;
  };

  // Prepare risk data
  const prepareRiskData = () => {
    if (selectedRouteObjects.length === 0) return [];

    // Risk factors data
    return selectedRouteObjects.map(route => ({
      name: route.name,
      weather: route.riskFactors.weather,
      customs: route.riskFactors.customs,
      political: route.riskFactors.political,
      congestion: route.riskFactors.congestion,
    }));
  };

  // Mode icon mapping
  const modeIcons: Record<string, React.ReactNode> = {
    ocean: <Ship className="h-4 w-4" />,
    air: <Plane className="h-4 w-4" />,
    rail: <Truck className="h-4 w-4" />,
    truck: <Truck className="h-4 w-4" />
  };

  return (
    <div className="space-y-6">
      {/* Route Selection */}
      <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-blue-600" />
            Select Routes to Compare
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            {routes.map(route => (
              <div 
                key={route.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  comparisonRoutes.includes(route.name) 
                    ? 'border-blue-300 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                } cursor-pointer transition-colors`}
                onClick={() => toggleRouteSelection(route.name)}
              >
                <div className="flex items-center gap-3">
                  <Checkbox 
                    checked={comparisonRoutes.includes(route.name)}
                    onCheckedChange={() => toggleRouteSelection(route.name)}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    route.segments[0].mode === 'ocean' ? 'bg-blue-100 text-blue-700' :
                    route.segments[0].mode === 'air' ? 'bg-purple-100 text-purple-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {modeIcons[route.segments[0].mode]}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 flex items-center gap-2">
                      {route.name}
                      {route.name === recommendedRoute && (
                        <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                          Recommended
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {formatCost(route.totalCost)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(route.totalDuration)}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={`${getRiskColorClass(route.riskScore)}`}
                >
                  Risk: {route.riskScore.toFixed(1)}/10
                </Badge>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <Button 
              onClick={() => onCompare(comparisonRoutes)}
              disabled={comparisonRoutes.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Compare Selected Routes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Charts */}
      {selectedRouteObjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cost vs Duration Chart */}
          <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Cost vs Duration</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={prepareChartData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={{ stroke: '#e2e8f0' }}
                    />
                    <YAxis 
                      yAxisId="cost"
                      orientation="left"
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={{ stroke: '#e2e8f0' }}
                      label={{ 
                        value: 'Cost ($)', 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { fill: '#64748b', fontSize: 12 }
                      }}
                    />
                    <YAxis 
                      yAxisId="duration"
                      orientation="right"
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={{ stroke: '#e2e8f0' }}
                      label={{ 
                        value: 'Duration (days)', 
                        angle: 90, 
                        position: 'insideRight',
                        style: { fill: '#64748b', fontSize: 12 }
                      }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        fontSize: '14px'
                      }}
                      formatter={(value, name) => {
                        if (name === 'cost') return [`$${value}`, 'Cost'];
                        if (name === 'duration') return [`${value} days`, 'Duration'];
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="cost" 
                      fill="#3b82f6" 
                      yAxisId="cost" 
                      name="Cost ($)"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="duration" 
                      fill="#ef4444" 
                      yAxisId="duration" 
                      name="Duration (days)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Risk Factors Chart */}
          <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Risk Factors</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={prepareRiskData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      type="number"
                      domain={[0, 10]}
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={{ stroke: '#e2e8f0' }}
                    />
                    <YAxis 
                      dataKey="name" 
                      type="category"
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={{ stroke: '#e2e8f0' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        fontSize: '14px'
                      }}
                      formatter={(value) => [`${value}/10`, 'Risk Score']}
                    />
                    <Legend />
                    <Bar 
                      dataKey="weather" 
                      name="Weather" 
                      fill="#3b82f6"
                      radius={[0, 4, 4, 0]}
                    />
                    <Bar 
                      dataKey="customs" 
                      name="Customs" 
                      fill="#8b5cf6"
                      radius={[0, 4, 4, 0]}
                    />
                    <Bar 
                      dataKey="political" 
                      name="Political" 
                      fill="#f59e0b"
                      radius={[0, 4, 4, 0]}
                    />
                    <Bar 
                      dataKey="congestion" 
                      name="Congestion" 
                      fill="#ef4444"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Comparison Table */}
      {selectedRouteObjects.length > 0 && (
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Detailed Comparison</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left font-medium text-gray-700">Feature</th>
                    {selectedRouteObjects.map(route => (
                      <th key={route.id} className="py-3 px-4 text-left font-medium text-gray-700">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            route.segments[0].mode === 'ocean' ? 'bg-blue-100 text-blue-700' :
                            route.segments[0].mode === 'air' ? 'bg-purple-100 text-purple-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {modeIcons[route.segments[0].mode]}
                          </div>
                          {route.name}
                          {route.name === recommendedRoute && (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Cost */}
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-700 bg-gray-50">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        Cost
                      </div>
                    </td>
                    {selectedRouteObjects.map(route => (
                      <td key={`${route.id}-cost`} className="py-3 px-4">
                        <span className="font-medium text-gray-900">{formatCost(route.totalCost)}</span>
                      </td>
                    ))}
                  </tr>
                  
                  {/* Duration */}
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-700 bg-gray-50">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        Duration
                      </div>
                    </td>
                    {selectedRouteObjects.map(route => (
                      <td key={`${route.id}-duration`} className="py-3 px-4">
                        <span className="font-medium text-gray-900">{formatDuration(route.totalDuration)}</span>
                      </td>
                    ))}
                  </tr>
                  
                  {/* Risk Score */}
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-700 bg-gray-50">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-gray-500" />
                        Risk Score
                      </div>
                    </td>
                    {selectedRouteObjects.map(route => (
                      <td key={`${route.id}-risk`} className="py-3 px-4">
                        <Badge 
                          variant="outline" 
                          className={`${getRiskColorClass(route.riskScore)}`}
                        >
                          {route.riskScore.toFixed(1)}/10
                        </Badge>
                      </td>
                    ))}
                  </tr>
                  
                  {/* CO2 Emissions */}
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-700 bg-gray-50">
                      <div className="flex items-center gap-2">
                        <Leaf className="h-4 w-4 text-gray-500" />
                        CO₂ Emissions
                      </div>
                    </td>
                    {selectedRouteObjects.map(route => (
                      <td key={`${route.id}-co2`} className="py-3 px-4">
                        <span className="font-medium text-gray-900">{route.co2Emissions} kg</span>
                      </td>
                    ))}
                  </tr>
                  
                  {/* Transport Mode */}
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-700 bg-gray-50">
                      <div className="flex items-center gap-2">
                        <Ship className="h-4 w-4 text-gray-500" />
                        Transport Mode
                      </div>
                    </td>
                    {selectedRouteObjects.map(route => (
                      <td key={`${route.id}-mode`} className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {modeIcons[route.segments[0].mode]}
                          <span className="font-medium text-gray-900 capitalize">
                            {route.segments[0].mode}
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  
                  {/* Segments */}
                  <tr>
                    <td className="py-3 px-4 font-medium text-gray-700 bg-gray-50">
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-4 w-4 text-gray-500" />
                        Route Segments
                      </div>
                    </td>
                    {selectedRouteObjects.map(route => (
                      <td key={`${route.id}-segments`} className="py-3 px-4">
                        <span className="font-medium text-gray-900">{route.segments.length}</span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
