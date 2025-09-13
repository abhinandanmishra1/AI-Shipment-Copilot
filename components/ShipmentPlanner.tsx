import React, { useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Ship, 
  Plane, 
  Truck, 
  Clock, 
  DollarSign, 
  AlertTriangle, 
  ArrowRight,
  Sparkles,
  BarChart3,
  Loader2,
  CheckCircle2,
  Leaf,
  Route
} from "lucide-react";
import { shipmentRoutes, getRiskColorClass, formatCost, formatDuration } from "../data/routes";
import { 
  getPlannerSuggestion, 
  getStructuredExplainerAnalysis, 
  getRouteCostAnalysis, 
  getRiskAnalysis 
} from "../services/geminiService";
import { RouteMap } from "./RouteMap";
import type { ShipmentRoute } from "../types";

// Define interfaces for our component
interface ShipmentPlannerProps {
  onAddMessage?: (message: any) => void;
}

// Mode icon mapping
const modeIcons: Record<string, React.ReactNode> = {
  ocean: <Ship className="h-4 w-4" />,
  air: <Plane className="h-4 w-4" />,
  rail: <Route className="h-4 w-4" />,
  truck: <Truck className="h-4 w-4" />
};

export function ShipmentPlanner({ onAddMessage }: ShipmentPlannerProps) {
  // State for form inputs
  const [origin, setOrigin] = useState("Shanghai");
  const [destination, setDestination] = useState("Los Angeles");
  const [goal, setGoal] = useState("");
  const [constraints, setConstraints] = useState("");
  const [isPlanning, setIsPlanning] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("routes");
  
  // State for AI responses
  const [plannerResponse, setPlannerResponse] = useState<any>(null);
  const [explainerResponse, setExplainerResponse] = useState<any>(null);
  const [costAnalysis, setCostAnalysis] = useState<any>(null);
  const [riskAnalysis, setRiskAnalysis] = useState<any>(null);
  const [isLoadingCost, setIsLoadingCost] = useState(false);
  const [isLoadingRisk, setIsLoadingRisk] = useState(false);

  // Set selected route when planner response changes
  useEffect(() => {
    if (plannerResponse?.suggested_route) {
      setSelectedRoute(plannerResponse.suggested_route);
    }
  }, [plannerResponse]);

  // Handle form submission
  const handlePlanShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!goal) {
      return; // Don't submit if goal is empty
    }
    
    setIsPlanning(true);
    setPlannerResponse(null);
    setExplainerResponse(null);
    setCostAnalysis(null);
    setRiskAnalysis(null);
    
    try {
      // Convert routes to ShipmentRoute format
      const routesWithLocations: ShipmentRoute[] = shipmentRoutes.map(route => ({
        route_name: route.name,
        origin,
        destination,
        mode_of_transport: route.segments[0].mode === 'ocean' ? 'sea' : 
                          route.segments[0].mode === 'air' ? 'air' : 'road',
        base_cost_usd: route.totalCost,
        transit_time_days: route.totalDuration,
        risk_factors: {
          customs_delay_days: route.riskFactors.customs,
          weather_risk_score: route.riskFactors.weather,
          port_congestion_risk_score: route.riskFactors.congestion
        }
      }));
      
      // Get planner suggestion
      const plannerResult = await getPlannerSuggestion(
        routesWithLocations, 
        goal, 
        constraints
      );
      
      setPlannerResponse(plannerResult);
      
      // Add planner message to chat
      if (onAddMessage) {
        onAddMessage({
          id: Date.now().toString(),
          content: `I've analyzed your request for shipping from ${origin} to ${destination}. Based on your goal "${goal}", I recommend the ${plannerResult.suggested_route} option. ${plannerResult.reason}`,
          sender: "planner",
          timestamp: new Date()
        });
      }
      
      // Get explainer analysis
      const explainerResult = await getStructuredExplainerAnalysis(
        routesWithLocations,
        plannerResult
      );
      
      setExplainerResponse(explainerResult);
      
      // Add explainer message to chat
      if (onAddMessage) {
        const pros = explainerResult.suggested_route_summary.pros.slice(0, 2).join("; ");
        const cons = explainerResult.suggested_route_summary.cons.slice(0, 1).join("; ");
        
        onAddMessage({
          id: (Date.now() + 1).toString(),
          content: `The ${plannerResult.suggested_route} option provides the best balance for your needs. Pros: ${pros}. Cons: ${cons}.`,
          sender: "explainer",
          timestamp: new Date()
        });
      }
      
      // Get risk analysis for the suggested route
      await handleGetRiskAnalysis(plannerResult.suggested_route);
      
    } catch (error) {
      console.error("Error planning shipment:", error);
    } finally {
      setIsPlanning(false);
    }
  };
  
  // Handle getting cost analysis for a route
  const handleGetCostAnalysis = async (routeName: string) => {
    if (isLoadingCost) return;
    
    setIsLoadingCost(true);
    setCostAnalysis(null);
    
    try {
      const route = shipmentRoutes.find(r => r.name === routeName);
      if (!route) return;
      
      const routeWithLocations: ShipmentRoute = {
        route_name: route.name,
        origin,
        destination,
        mode_of_transport: route.segments[0].mode === 'ocean' ? 'sea' : 
                          route.segments[0].mode === 'air' ? 'air' : 'road',
        base_cost_usd: route.totalCost,
        transit_time_days: route.totalDuration,
        risk_factors: {
          customs_delay_days: route.riskFactors.customs,
          weather_risk_score: route.riskFactors.weather,
          port_congestion_risk_score: route.riskFactors.congestion
        }
      };
      
      const costResult = await getRouteCostAnalysis(routeWithLocations);
      setCostAnalysis(costResult);
      
    } catch (error) {
      console.error("Error getting cost analysis:", error);
    } finally {
      setIsLoadingCost(false);
    }
  };
  
  // Handle getting risk analysis for a route
  const handleGetRiskAnalysis = async (routeName: string) => {
    if (isLoadingRisk) return;
    
    setIsLoadingRisk(true);
    setRiskAnalysis(null);
    
    try {
      const route = shipmentRoutes.find(r => r.name === routeName);
      if (!route) return;
      
      const routeWithLocations: ShipmentRoute = {
        route_name: route.name,
        origin,
        destination,
        mode_of_transport: route.segments[0].mode === 'ocean' ? 'sea' : 
                          route.segments[0].mode === 'air' ? 'air' : 'road',
        base_cost_usd: route.totalCost,
        transit_time_days: route.totalDuration,
        risk_factors: {
          customs_delay_days: route.riskFactors.customs,
          weather_risk_score: route.riskFactors.weather,
          port_congestion_risk_score: route.riskFactors.congestion
        }
      };
      
      const riskResult = await getRiskAnalysis(routeWithLocations, constraints);
      setRiskAnalysis(riskResult);
      
      // Add risk message to chat
      if (onAddMessage && riskResult.risks.length > 0) {
        const topRisks = riskResult.risks
          .slice(0, 2)
          .map(r => `${r.risk_name} (${r.severity})`)
          .join("; ");
        
        onAddMessage({
          id: (Date.now() + 2).toString(),
          content: `Risk assessment complete: ${topRisks}. ${riskResult.risks[0].mitigation}`,
          sender: "risk",
          timestamp: new Date()
        });
      }
      
    } catch (error) {
      console.error("Error getting risk analysis:", error);
    } finally {
      setIsLoadingRisk(false);
    }
  };

  // Get the selected route object
  const getSelectedRouteObject = () => {
    return shipmentRoutes.find(route => route.name === selectedRoute);
  };

  return (
    <div className="space-y-6">
      {/* Planning Form */}
      <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">Plan New Shipment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePlanShipment} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin" className="text-sm font-medium text-gray-700">Origin</Label>
                <Input
                  id="origin"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="Enter origin city"
                  className="bg-white border-gray-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination" className="text-sm font-medium text-gray-700">Destination</Label>
                <Input
                  id="destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Enter destination city"
                  className="bg-white border-gray-200"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="goal" className="text-sm font-medium text-gray-700">Shipment Goal</Label>
              <Input
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g., Fastest delivery, lowest cost, or balanced approach"
                className="bg-white border-gray-200"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="constraints" className="text-sm font-medium text-gray-700">Constraints (Optional)</Label>
              <Textarea
                id="constraints"
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                placeholder="e.g., Must arrive by June 15, fragile items, temperature-controlled"
                className="bg-white border-gray-200 resize-none h-20"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isPlanning || !goal}
            >
              {isPlanning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Planning Shipment...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Plan Shipment
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Results Section */}
      {plannerResponse && (
        <div className="space-y-6">
          {/* Recommendation Card */}
          <Card className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Recommended Route</h3>
                  <p className="text-blue-100">{plannerResponse.suggested_route}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed">
                {plannerResponse.reason}
              </p>
            </div>
          </Card>
          
          {/* Route Details */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-gray-100 p-1 rounded-lg">
              <TabsTrigger value="routes" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Available Routes
              </TabsTrigger>
              <TabsTrigger value="map" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Route Map
              </TabsTrigger>
              <TabsTrigger value="analysis" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Analysis
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="routes" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shipmentRoutes.map((route) => {
                  const isSelected = selectedRoute === route.name;
                  return (
                    <Card 
                      key={route.id} 
                      className={`bg-white border cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-blue-500 ring-2 ring-blue-200' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedRoute(route.name)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              route.segments[0].mode === 'ocean' ? 'bg-blue-100 text-blue-700' :
                              route.segments[0].mode === 'air' ? 'bg-purple-100 text-purple-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {modeIcons[route.segments[0].mode]}
                            </div>
                            <h3 className="font-medium text-gray-900">{route.name}</h3>
                          </div>
                          {isSelected && (
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                              Selected
                            </Badge>
                          )}
                          {plannerResponse.suggested_route === route.name && (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              Recommended
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              Cost
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {formatCost(route.totalCost)}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Duration
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {formatDuration(route.totalDuration)}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Risk
                            </p>
                            <Badge 
                              variant="outline" 
                              className={`${getRiskColorClass(route.riskScore)} text-xs`}
                            >
                              {route.riskScore.toFixed(1)}/10
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Leaf className="h-3 w-3 text-green-500" />
                            <span>CO₂: {route.co2Emissions} kg</span>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs h-7 px-2 border-gray-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleGetCostAnalysis(route.name);
                              }}
                            >
                              {isLoadingCost && selectedRoute === route.name ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <BarChart3 className="h-3 w-3 mr-1" />
                              )}
                              Cost Analysis
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs h-7 px-2 border-gray-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleGetRiskAnalysis(route.name);
                              }}
                            >
                              {isLoadingRisk && selectedRoute === route.name ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <AlertTriangle className="h-3 w-3 mr-1" />
                              )}
                              Risk Analysis
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="map" className="mt-4">
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-4">
                  <div className="h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
                    <RouteMap
                      origin={origin}
                      destination={destination}
                      selectedRoute={getSelectedRouteObject()}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analysis" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cost Analysis */}
                <Card className="bg-white border border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-blue-600" />
                      Cost Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    {isLoadingCost ? (
                      <div className="flex items-center justify-center h-40">
                        <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                      </div>
                    ) : costAnalysis ? (
                      <div className="space-y-3">
                        {costAnalysis.map((factor: any, index: number) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-gray-900">{factor.factor_name}</h4>
                              <Badge className={
                                factor.impact === 'High' ? 'bg-red-100 text-red-800 border-red-200' :
                                factor.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                'bg-green-100 text-green-800 border-green-200'
                              }>
                                {factor.impact} Impact
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700">{factor.description}</p>
                          </div>
                        ))}
                      </div>
                    ) : selectedRoute ? (
                      <div className="flex flex-col items-center justify-center h-40 text-center">
                        <p className="text-gray-500 mb-3">Select "Cost Analysis" on a route to see details</p>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleGetCostAnalysis(selectedRoute)}
                        >
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Analyze Costs
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-40 text-center">
                        <p className="text-gray-500">Select a route to analyze costs</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Risk Analysis */}
                <Card className="bg-white border border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      Risk Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    {isLoadingRisk ? (
                      <div className="flex items-center justify-center h-40">
                        <Loader2 className="h-6 w-6 text-amber-600 animate-spin" />
                      </div>
                    ) : riskAnalysis ? (
                      <div className="space-y-3">
                        {riskAnalysis.risks.length > 0 ? (
                          riskAnalysis.risks.map((risk: any, index: number) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-medium text-gray-900">{risk.risk_name}</h4>
                                <Badge className={
                                  risk.severity === 'High' ? 'bg-red-100 text-red-800 border-red-200' :
                                  risk.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                  'bg-green-100 text-green-800 border-green-200'
                                }>
                                  {risk.severity}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-700 mb-1">{risk.description}</p>
                              <p className="text-xs text-gray-600 italic">
                                <span className="font-medium">Mitigation:</span> {risk.mitigation}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center justify-center h-40 bg-green-50 rounded-lg">
                            <div className="text-center">
                              <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                              <p className="text-green-800 font-medium">No significant risks identified</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : selectedRoute ? (
                      <div className="flex flex-col items-center justify-center h-40 text-center">
                        <p className="text-gray-500 mb-3">Select "Risk Analysis" on a route to see details</p>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleGetRiskAnalysis(selectedRoute)}
                        >
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Analyze Risks
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-40 text-center">
                        <p className="text-gray-500">Select a route to analyze risks</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}