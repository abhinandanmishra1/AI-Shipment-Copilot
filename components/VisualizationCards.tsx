import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  Shield, 
  Route,
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar,
  PieChart as RechartsPieChart,
  Cell
} from 'recharts';
import type { ShipmentRoute, CostAnalysisFactor } from '../types';

interface VisualizationCardsProps {
  routes: ShipmentRoute[];
  selectedRoute?: ShipmentRoute | null;
  costAnalysis?: CostAnalysisFactor[] | null;
}

const COLORS = ['#0ea5e9', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

// Sample data for charts
const costTrendData = [
  { month: 'Jan', cost: 4000, time: 12 },
  { month: 'Feb', cost: 3000, time: 14 },
  { month: 'Mar', cost: 5000, time: 10 },
  { month: 'Apr', cost: 4500, time: 11 },
  { month: 'May', cost: 3500, time: 13 },
  { month: 'Jun', cost: 4200, time: 12 }
];

export const VisualizationCards: React.FC<VisualizationCardsProps> = ({ 
  routes, 
  selectedRoute, 
  costAnalysis 
}) => {
  // Prepare route comparison data
  const routeComparisonData = routes.map(route => ({
    name: route.route_name.replace('Route ', ''),
    cost: route.base_cost_usd,
    time: route.transit_time_days,
    risk: (route.risk_factors.weather_risk_score + route.risk_factors.port_congestion_risk_score) / 2
  }));

  // Prepare risk distribution data
  const riskDistributionData = routes.map((route, index) => ({
    name: route.route_name.replace('Route ', ''),
    value: (route.risk_factors.weather_risk_score + route.risk_factors.port_congestion_risk_score) / 2,
    color: COLORS[index % COLORS.length]
  }));

  // Calculate summary stats
  const avgCost = routes.reduce((sum, route) => sum + route.base_cost_usd, 0) / routes.length;
  const avgTime = routes.reduce((sum, route) => sum + route.transit_time_days, 0) / routes.length;
  const totalRoutes = routes.length;

  return (
    <div className="space-y-6">
      {/* Summary Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Routes</p>
              <p className="text-2xl font-bold text-gray-900">{totalRoutes}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Route className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">Available options</span>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Cost</p>
              <p className="text-2xl font-bold text-gray-900">${avgCost.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">12% vs last month</span>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Transit</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(avgTime)} days</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <Activity className="h-4 w-4 text-orange-500 mr-1" />
            <span className="text-orange-600">Standard timing</span>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Risk Level</p>
              <p className="text-2xl font-bold text-gray-900">Medium</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-yellow-600">Monitor closely</span>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost vs Time Comparison */}
        <Card className="chart-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Route Comparison</h3>
              <p className="text-sm text-gray-500">Cost vs Transit Time Analysis</p>
            </div>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={routeComparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                stroke="#64748b"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#64748b"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="cost" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Risk Distribution */}
        <Card className="chart-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Risk Distribution</h3>
              <p className="text-sm text-gray-500">Risk levels across routes</p>
            </div>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <RechartsPieChart data={riskDistributionData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                {riskDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </RechartsPieChart>
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-4">
            {riskDistributionData.map((item, index) => (
              <div key={index} className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Cost Trend Analysis */}
      <Card className="chart-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Cost & Time Trends</h3>
            <p className="text-sm text-gray-500">Historical performance over 6 months</p>
          </div>
          <TrendingUp className="h-5 w-5 text-gray-400" />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={costTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              stroke="#64748b"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#64748b"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="cost" 
              stroke="#0ea5e9" 
              strokeWidth={3}
              dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="time" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Selected Route Details */}
      {selectedRoute && (
        <Card className="dashboard-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Selected Route Details</h3>
              <p className="text-sm text-gray-500">{selectedRoute.route_name}</p>
            </div>
            <Badge variant="default" className="bg-blue-500">
              Active
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Route Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Origin:</span>
                  <span className="font-medium">{selectedRoute.origin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Destination:</span>
                  <span className="font-medium">{selectedRoute.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transport:</span>
                  <span className="font-medium capitalize">{selectedRoute.mode_of_transport}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Cost & Time</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Cost:</span>
                  <span className="font-medium">${selectedRoute.base_cost_usd.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transit Time:</span>
                  <span className="font-medium">{selectedRoute.transit_time_days} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customs Delay:</span>
                  <span className="font-medium">{selectedRoute.risk_factors.customs_delay_days} days</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Risk Factors</h4>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Weather Risk</span>
                    <span className="font-medium">{selectedRoute.risk_factors.weather_risk_score}/10</span>
                  </div>
                  <Progress 
                    value={selectedRoute.risk_factors.weather_risk_score * 10} 
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Port Congestion</span>
                    <span className="font-medium">{selectedRoute.risk_factors.port_congestion_risk_score}/10</span>
                  </div>
                  <Progress 
                    value={selectedRoute.risk_factors.port_congestion_risk_score * 10} 
                    className="h-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
