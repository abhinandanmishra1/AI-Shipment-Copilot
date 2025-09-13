import { useState, useEffect } from "react";
import { TopNavigation } from "./components/TopNavigation";
import { Sidebar } from "./components/Sidebar";
import { ChatInterface } from "./components/ChatInterface";
import { VisualizationPanel } from "./components/VisualizationPanel";
import { WhatIfSimulator } from "./components/WhatIfSimulator";
import { RouteComparison } from "./components/RouteComparison";
import { RouteDetailsDrawer } from "./components/RouteDetailsDrawer";
import { shipmentRoutes } from "./data/routes";
import { 
  getPlannerSuggestion, 
  getStructuredExplainerAnalysis, 
  getRouteCostAnalysis, 
  getRiskAnalysis 
} from "./services/geminiService";
import type { ShipmentRoute } from "./types";
import { 
  Ship, 
  Plane, 
  Truck
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("planner");
  const [chatMessages, setChatMessages] = useState<any[]>([
    {
      id: "welcome-1",
      content: "Welcome to AI Shipment Copilot! I can help you plan and optimize your shipments.",
      sender: "planner",
      timestamp: new Date()
    },
    {
      id: "welcome-2",
      content: "Try one of the suggested prompts below or type your own request.",
      sender: "planner",
      timestamp: new Date()
    }
  ]);
  
  // Suggested prompts
  const [suggestedPrompts, setSuggestedPrompts] = useState([
    {
      id: "prompt-1",
      text: "Plan a shipment of 100 containers from Shanghai to LA within 10 days, lowest cost."
    },
    {
      id: "prompt-2",
      text: "Find the fastest route from Rotterdam to New York with minimal customs delays."
    },
    {
      id: "prompt-3",
      text: "Plan a high-value electronics shipment from Tokyo to San Francisco with low risk."
    }
  ]);
  
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [recommendedRoute, setRecommendedRoute] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Route details drawer state
  const [isRouteDetailsOpen, setIsRouteDetailsOpen] = useState(false);
  const [selectedRouteDetails, setSelectedRouteDetails] = useState<any>(null);
  
  // Shipment planning state
  const [origin, setOrigin] = useState("Shanghai");
  const [destination, setDestination] = useState("Los Angeles");
  const [goal, setGoal] = useState("");
  const [constraints, setConstraints] = useState("");
  const [plannerResponse, setPlannerResponse] = useState<any>(null);
  const [explainerResponse, setExplainerResponse] = useState<any>(null);
  const [costAnalysis, setCostAnalysis] = useState<any>(null);
  const [riskAnalysis, setRiskAnalysis] = useState<any>(null);
  
  // Agent queue system
  const [agentQueue, setAgentQueue] = useState<{
    type: string;
    action: () => Promise<void>;
    message: string;
  }[]>([]);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  
  // What-If scenario parameters
  const [whatIfParams, setWhatIfParams] = useState({
    fuelCostIncrease: 0,
    customsDelay: 0,
    weatherRisk: "medium"
  });
  
  // Function to add a message to the chat
  const addChatMessage = (message: any) => {
    setChatMessages(prev => [...prev, message]);
    
    // If this is a planner message with a recommended route, save it
    if (message.sender === "planner" && message.content.includes("recommend")) {
      const routeName = shipmentRoutes.find(r => 
        message.content.includes(r.name)
      )?.name || null;
      
      if (routeName) {
        setRecommendedRoute(routeName);
        setSelectedRoutes([routeName]);
      }
    }
  };
  
  // Process the agent queue
  useEffect(() => {
    const processQueue = async () => {
      // If there's an active agent or the queue is empty, do nothing
      if (activeAgent || agentQueue.length === 0) return;
      
      // Get the next agent from the queue
      const nextAgent = agentQueue[0];
      setAgentQueue(prev => prev.slice(1));
      
      // Set the active agent
      setActiveAgent(nextAgent.type);
      setIsProcessing(true);
      
      // Add a message to indicate the agent is working
      addChatMessage({
        id: Date.now().toString(),
        content: nextAgent.message,
        sender: nextAgent.type,
        timestamp: new Date(),
        isLoading: true
      });
      
      try {
        // Execute the agent's action
        await nextAgent.action();
      } catch (error) {
        console.error(`Error executing ${nextAgent.type} agent:`, error);
        
        // Add error message
        addChatMessage({
          id: Date.now().toString(),
          content: `I encountered an error while processing your request. Please try again.`,
          sender: nextAgent.type,
          timestamp: new Date()
        });
      } finally {
        // Clear the active agent
        setActiveAgent(null);
        setIsProcessing(false);
      }
    };
    
    processQueue();
  }, [agentQueue, activeAgent]);
  
  // Parse user message to extract planning information
  const parseUserMessage = (message: string) => {
    console.log("Parsing user message:", message);
    
    // Default values if not specified
    let newOrigin = "Shanghai";
    let newDestination = "Los Angeles";
    let newConstraints = "";
    
    // Extract origin and destination
    const originMatch = message.match(/from\s+([A-Za-z\s]+?)(?:\s+to|\s*$)/i);
    const destinationMatch = message.match(/to\s+([A-Za-z\s]+?)(?:\s+with|\s*$)/i);
    
    if (originMatch && originMatch[1]) {
      newOrigin = originMatch[1].trim();
      console.log("Extracted origin:", newOrigin);
    }
    
    if (destinationMatch && destinationMatch[1]) {
      newDestination = destinationMatch[1].trim();
      console.log("Extracted destination:", newDestination);
    }
    
    // Extract constraints
    const constraintsMatch = message.match(/with\s+(.+?)(?:\.|$)/i);
    if (constraintsMatch && constraintsMatch[1]) {
      newConstraints = constraintsMatch[1].trim();
      console.log("Extracted constraints:", newConstraints);
    }
    
    // Update state
    setOrigin(newOrigin);
    setDestination(newDestination);
    setConstraints(newConstraints);
    setGoal(message);
    
    // Add planning task to the queue
    const planningAction = async () => {
      await handlePlanShipment(newOrigin, newDestination, message, newConstraints);
    };
    
    setAgentQueue(prev => [...prev, {
      type: "planner",
      action: planningAction,
      message: "Planning your shipment..."
    }]);
  };
  
  // Handle shipment planning
  const handlePlanShipment = async (
    planOrigin: string = origin, 
    planDestination: string = destination,
    planGoal: string = goal,
    planConstraints: string = constraints
  ) => {
    if (!planGoal) return;
    
    console.log("Planning shipment with:", { planOrigin, planDestination, planGoal, planConstraints });
    
    setPlannerResponse(null);
    setExplainerResponse(null);
    setCostAnalysis(null);
    setRiskAnalysis(null);
    
    // The loading message is now handled by the queue system
    
    try {
      // Convert routes to ShipmentRoute format
      const routesWithLocations: ShipmentRoute[] = shipmentRoutes.map(route => ({
        route_name: route.name,
        origin: planOrigin,
        destination: planDestination,
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
        planGoal, 
        planConstraints
      );
      setPlannerResponse(plannerResult);

      // Add planner response message
      addChatMessage({
        id: Date.now().toString(),
        content: `Based on your requirements, I recommend ${plannerResult.suggested_route}. ${plannerResult.reason}`,
        sender: "planner",
        timestamp: new Date()
      });
      
      // Queue explainer analysis
      const explainerAction = async () => {
        // Get explainer analysis
        const explainerResult = await getStructuredExplainerAnalysis(
          routesWithLocations,
          plannerResult
        );
        setExplainerResponse(explainerResult);

        // Add explainer message
        const summaryPoints = explainerResult.suggested_route_summary.pros
          .slice(0, 2)
          .map(pro => `✓ ${pro}`)
          .join("\n");
        
        addChatMessage({
          id: Date.now().toString(),
          content: `Here's why ${plannerResult.suggested_route} is recommended:\n\n${summaryPoints}\n\nI've prepared a detailed comparison of all routes below.`,
          sender: "explainer",
          timestamp: new Date()
        });
      };
      
      setAgentQueue(prev => [...prev, {
        type: "explainer",
        action: explainerAction,
        message: "Analyzing route options in detail..."
      }]);
      
      // Set recommended route
      const recommendedRouteName = plannerResult.suggested_route;
      if (recommendedRouteName) {
        setRecommendedRoute(recommendedRouteName);
        setSelectedRoutes([recommendedRouteName]);
      }
      
    } catch (error) {
      console.error("Error planning shipment:", error);
      
      // Add error message
      addChatMessage({
        id: Date.now().toString(),
        content: "I encountered an error while planning your shipment. Please try again.",
        sender: "planner",
        timestamp: new Date()
      });
      
      throw error; // Rethrow to be caught by the queue processor
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Route Details Drawer */}
      <RouteDetailsDrawer 
        isOpen={isRouteDetailsOpen}
        onClose={() => setIsRouteDetailsOpen(false)}
        route={selectedRouteDetails}
      />
      
      {/* Top Navigation */}
      <TopNavigation />
      
      <div className="flex">
        {/* Left Sidebar */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        {/* Main Content Area */}
        <div className="flex-1 p-6">
          <div className="max-w-full">
            {/* Page Header */}
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Shipment Planning Workspace</h2>
                <p className="text-gray-600">Plan, analyze, and optimize your global shipments with AI assistance</p>
          </div>

              {activeTab === "planner" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowComparison(!showComparison)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      !showComparison 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {!showComparison ? 'Compare Routes' : 'Back to Planner'}
                  </button>
                </div>
              )}
                </div>
                
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Left Section - Chat Interface and Planner/Visualizations */}
              <div className="xl:col-span-3 space-y-6">
                {/* Chat Interface */}
                <div>
                  <ChatInterface 
                    messages={chatMessages}
                    isProcessing={isProcessing}
                    suggestedPrompts={suggestedPrompts}
                    onSendMessage={(message) => {
                      // Add user message to chat
                      addChatMessage({
                        id: Date.now().toString(),
                        content: message,
                        sender: "user",
                        timestamp: new Date()
                      });
                      
                      // Parse message and plan shipment
                      parseUserMessage(message);
                    }}
                  />
                </div>

                {/* Content based on active tab */}
                {activeTab === "planner" && (
                  <div className="space-y-6">
                    {!showComparison ? (
                      <div className="space-y-6">
                        {/* Route cards will be displayed here */}
                        {plannerResponse && (
                          <>
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                              <h3 className="text-base font-medium text-blue-800 mb-2">Available Routes</h3>
                              <p className="text-sm text-blue-700">
                                I've found {shipmentRoutes.length} routes from {origin} to {destination}. 
                                Click on any route card below to see more details.
                              </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {shipmentRoutes.map(route => {
                              const isRecommended = route.name === recommendedRoute;
                              const isSelected = selectedRoutes.includes(route.name);
                              
                              return (
                                <div 
                                  key={route.id}
                                  className={`rounded-xl overflow-hidden transition-all cursor-pointer ${
                                    isRecommended ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                                  }`}
                                  onClick={() => {
                                    // Handle route selection
                                    const routeName = route.name;
                                    
                                    // Add message about route selection
                                    const loadingId = Date.now().toString();
                                    addChatMessage({
                                      id: loadingId,
                                      content: `Analyzing ${routeName} in detail...`,
                                      sender: "explainer",
                                      timestamp: new Date(),
                                      isLoading: true
                                    });
                                    
                                    // Set as selected route
                                    setSelectedRoutes([routeName]);
                                    
                                    // Find the route
                                    const selectedRoute = shipmentRoutes.find(r => r.name === routeName);
                                    if (selectedRoute) {
                                      // Open the route details drawer
                                      setSelectedRouteDetails(selectedRoute);
                                      setIsRouteDetailsOpen(true);
                                      
                                      // Convert to ShipmentRoute format
                                      const routeData: ShipmentRoute = {
                                        route_name: selectedRoute.name,
                                        origin,
                                        destination,
                                        mode_of_transport: selectedRoute.segments[0].mode === 'ocean' ? 'sea' : 
                                                          selectedRoute.segments[0].mode === 'air' ? 'air' : 'road',
                                        base_cost_usd: selectedRoute.totalCost,
                                        transit_time_days: selectedRoute.totalDuration,
                                        risk_factors: {
                                          customs_delay_days: selectedRoute.riskFactors.customs,
                                          weather_risk_score: selectedRoute.riskFactors.weather,
                                          port_congestion_risk_score: selectedRoute.riskFactors.congestion
                                        }
                                      };
                                      
                                      // Get cost analysis
                                      getRouteCostAnalysis(routeData).then(costResult => {
                                        setCostAnalysis(costResult);
                                        
                                        // Update message
                                        const costFactors = costResult.slice(0, 2).map(f => `- ${f.factor_name}: ${f.impact} impact`).join('\n');
                                        setChatMessages(prev => prev.map(msg => 
                                          msg.id === loadingId ? {
                                            ...msg,
                                            content: `${routeName} Analysis:\n\nCost: $${selectedRoute.totalCost.toLocaleString()}\nDuration: ${selectedRoute.totalDuration} days\nRisk Score: ${selectedRoute.riskScore.toFixed(1)}/10\n\nKey cost factors:\n${costFactors}\n\nClick on the route card to see detailed stops and transportation modes.`,
                                            isLoading: false
                                          } : msg
                                        ));
                                      }).catch(error => {
                                        console.error("Error getting cost analysis:", error);
                                        setChatMessages(prev => prev.map(msg => 
                                          msg.id === loadingId ? {
                                            ...msg,
                                            content: `Error analyzing ${routeName}. Please try again.`,
                                            isLoading: false
                                          } : msg
                                        ));
                                      });
                                    }
                                  }}
                                >
                                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                                    <div className="p-4">
                                      <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                            route.segments[0].mode === 'ocean' ? 'bg-blue-100 text-blue-700' :
                                            route.segments[0].mode === 'air' ? 'bg-purple-100 text-purple-700' :
                                            'bg-green-100 text-green-700'
                                          }`}>
                                            {route.segments[0].mode === 'ocean' ? (
                                              <Ship className="h-4 w-4" />
                                            ) : route.segments[0].mode === 'air' ? (
                                              <Plane className="h-4 w-4" />
                                            ) : (
                                              <Truck className="h-4 w-4" />
                                            )}
                                          </div>
                                          <h3 className="font-medium text-gray-900">{route.name}</h3>
                                        </div>
                                        {isRecommended && (
                                          <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                                            Recommended
                                          </div>
                                        )}
                                      </div>
                                      
                                      <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                          <span className="text-gray-500">Cost</span>
                                          <span className="font-medium text-gray-900">${route.totalCost.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-500">Duration</span>
                                          <span className="font-medium text-gray-900">{route.totalDuration} days</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-500">Risk Score</span>
                                          <span className={`font-medium ${
                                            route.riskScore < 3 ? 'text-green-600' :
                                            route.riskScore < 7 ? 'text-orange-600' :
                                            'text-red-600'
                                          }`}>{route.riskScore.toFixed(1)}/10</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                            </div>
                          </>
                        )}
                    </div>
                    ) : (
                      <RouteComparison 
                        routes={shipmentRoutes}
                        selectedRoutes={selectedRoutes}
                        onSelectRoute={(routeName) => {
                          if (selectedRoutes.includes(routeName)) {
                            setSelectedRoutes(selectedRoutes.filter(r => r !== routeName));
                          } else {
                            setSelectedRoutes([...selectedRoutes, routeName]);
                          }
                        }}
                        onCompare={(routeNames) => {
                          setSelectedRoutes(routeNames);
                          // Add comparison message to chat
                          if (routeNames.length > 0) {
                            addChatMessage({
                              id: Date.now().toString(),
                              content: `I've compared ${routeNames.join(', ')}. The analysis shows trade-offs between cost, transit time, and risk factors. You can see the detailed comparison in the charts below.`,
                              sender: "explainer",
                              timestamp: new Date()
                            });
                          }
                        }}
                        recommendedRoute={recommendedRoute}
                      />
                    )}
                  </div>
                )}
                
                {activeTab === "analytics" && (
                  <VisualizationPanel />
                )}
              </div>
              
              {/* Right Panel - What-If Simulator */}
              <div className="xl:col-span-1">
                <WhatIfSimulator 
                  fuelCostIncrease={whatIfParams.fuelCostIncrease}
                  customsDelay={whatIfParams.customsDelay}
                  weatherRisk={whatIfParams.weatherRisk}
                  onParamChange={(param, value) => {
                    setWhatIfParams(prev => ({
                      ...prev,
                      [param]: value
                    }));
                    
                    // Add message to chat when parameters change significantly
                    if (
                      (param === 'fuelCostIncrease' && Math.abs(value - whatIfParams.fuelCostIncrease) >= 15) ||
                      (param === 'customsDelay' && Math.abs(value - whatIfParams.customsDelay) >= 3) ||
                      (param === 'weatherRisk' && value !== whatIfParams.weatherRisk)
                    ) {
                      addChatMessage({
                        id: Date.now().toString(),
                        content: `What-If scenario updated: ${
                          param === 'fuelCostIncrease' ? `Fuel cost ${value > 0 ? 'increased' : 'decreased'} by ${Math.abs(value)}%` :
                          param === 'customsDelay' ? `Customs delay ${value > 0 ? 'increased' : 'decreased'} by ${Math.abs(value)} days` :
                          `Weather risk set to ${value}`
                        }. This will affect route costs and transit times.`,
                        sender: "whatif",
                        timestamp: new Date()
                      });
                    }
                  }}
                  onRecalculate={() => {
                    // Add recalculation message to chat
                    addChatMessage({
                      id: Date.now().toString(),
                      content: `Recalculating routes with updated parameters: Fuel cost ${whatIfParams.fuelCostIncrease > 0 ? '+' : ''}${whatIfParams.fuelCostIncrease}%, Customs delay ${whatIfParams.customsDelay > 0 ? '+' : ''}${whatIfParams.customsDelay} days, Weather risk ${whatIfParams.weatherRisk}.`,
                      sender: "whatif",
                      timestamp: new Date()
                    });
                  }}
                      />
                    </div>
                  </div>
          </div>
        </div>
      </div>
    </div>
  );
}