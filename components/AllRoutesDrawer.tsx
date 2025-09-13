import React from 'react';
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerDescription, 
  DrawerClose 
} from './ui/drawer';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Truck, 
  Ship, 
  Plane, 
  MapPin, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Shield,
  Loader2
} from 'lucide-react';
import type { ShipmentRoute, CostAnalysisFactor, RiskAnalysisResponse } from '../types';

interface AllRoutesDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  routes: ShipmentRoute[];
  selectedRoute: ShipmentRoute | null;
  onSelectRoute: (route: ShipmentRoute) => void;
  onRunCostAnalysis: (route: ShipmentRoute) => void;
  onRunRiskAnalysis: (route: ShipmentRoute) => void;
  costAnalysisData: Record<string, CostAnalysisFactor[]>;
  riskAnalysisData: Record<string, RiskAnalysisResponse>;
  loadingStatus: Record<string, { cost: boolean; risk: boolean }>;
}

const getTransportIcon = (mode: string) => {
  switch (mode) {
    case 'sea': return <Ship className="h-4 w-4" />;
    case 'air': return <Plane className="h-4 w-4" />;
    case 'road': return <Truck className="h-4 w-4" />;
    default: return <MapPin className="h-4 w-4" />;
  }
};

const getRiskColor = (score: number) => {
  if (score <= 3) return 'bg-green-100 text-green-800';
  if (score <= 6) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

export const AllRoutesDrawer: React.FC<AllRoutesDrawerProps> = ({
  open,
  onOpenChange,
  routes,
  selectedRoute,
  onSelectRoute,
  onRunCostAnalysis,
  onRunRiskAnalysis,
  costAnalysisData,
  riskAnalysisData,
  loadingStatus
}) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent side="right" className="w-full sm:max-w-2xl">
        <DrawerClose />
        <DrawerHeader>
          <DrawerTitle>All Shipping Routes</DrawerTitle>
          <DrawerDescription>
            Compare all available routes and run detailed analysis for each
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="space-y-4">
            {routes.map((route) => {
              const isSelected = selectedRoute?.route_name === route.route_name;
              const routeLoadingStatus = loadingStatus[route.route_name] || { cost: false, risk: false };
              const costAnalysis = costAnalysisData[route.route_name];
              const riskAnalysis = riskAnalysisData[route.route_name];
              
              return (
                <Card 
                  key={route.route_name} 
                  className={`p-4 transition-all cursor-pointer hover:shadow-md ${
                    isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                  onClick={() => onSelectRoute(route)}
                >
                  <div className="space-y-3">
                    {/* Route Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getTransportIcon(route.mode_of_transport)}
                        <h3 className="font-semibold text-lg">{route.route_name}</h3>
                      </div>
                      <Badge variant={isSelected ? 'default' : 'secondary'}>
                        {isSelected ? 'Selected' : 'Available'}
                      </Badge>
                    </div>
                    
                    {/* Route Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">From:</span>
                          <span className="font-medium">{route.origin}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">To:</span>
                          <span className="font-medium">{route.destination}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">Cost:</span>
                          <span className="font-medium">${route.base_cost_usd.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">Transit:</span>
                          <span className="font-medium">{route.transit_time_days} days</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Risk Factors */}
                    <div className="flex gap-2 flex-wrap">
                      <Badge 
                        variant="outline" 
                        className={getRiskColor(route.risk_factors.weather_risk_score)}
                      >
                        Weather Risk: {route.risk_factors.weather_risk_score}/10
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={getRiskColor(route.risk_factors.port_congestion_risk_score)}
                      >
                        Port Congestion: {route.risk_factors.port_congestion_risk_score}/10
                      </Badge>
                      <Badge variant="outline">
                        Customs Delay: {route.risk_factors.customs_delay_days}d
                      </Badge>
                    </div>
                    
                    <Separator />
                    
                    {/* Analysis Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRunCostAnalysis(route);
                        }}
                        disabled={routeLoadingStatus.cost}
                        className="flex-1"
                      >
                        {routeLoadingStatus.cost ? (
                          <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        ) : (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        )}
                        Cost Analysis
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRunRiskAnalysis(route);
                        }}
                        disabled={routeLoadingStatus.risk}
                        className="flex-1"
                      >
                        {routeLoadingStatus.risk ? (
                          <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        ) : (
                          <Shield className="h-3 w-3 mr-1" />
                        )}
                        Risk Analysis
                      </Button>
                    </div>
                    
                    {/* Analysis Results */}
                    {(costAnalysis || riskAnalysis) && (
                      <div className="mt-3 space-y-3">
                        {costAnalysis && (
                          <div className="bg-muted/50 rounded-lg p-3">
                            <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              Cost Analysis
                            </h4>
                            <div className="space-y-1">
                              {costAnalysis.slice(0, 2).map((factor, idx) => (
                                <div key={idx} className="text-xs">
                                  <span className="font-medium">{factor.factor_name}:</span>
                                  <span className="text-muted-foreground ml-1">{factor.description}</span>
                                </div>
                              ))}
                              {costAnalysis.length > 2 && (
                                <div className="text-xs text-muted-foreground">
                                  +{costAnalysis.length - 2} more factors...
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {riskAnalysis && (
                          <div className="bg-muted/50 rounded-lg p-3">
                            <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              Risk Analysis
                            </h4>
                            <div className="space-y-1">
                              {riskAnalysis.risks.slice(0, 2).map((risk, idx) => (
                                <div key={idx} className="text-xs">
                                  <span className="font-medium">{risk.risk_name}:</span>
                                  <Badge variant="outline" className="ml-1 text-xs h-4">
                                    {risk.severity}
                                  </Badge>
                                </div>
                              ))}
                              {riskAnalysis.risks.length > 2 && (
                                <div className="text-xs text-muted-foreground">
                                  +{riskAnalysis.risks.length - 2} more risks...
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
