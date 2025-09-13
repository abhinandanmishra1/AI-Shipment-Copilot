import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { WhatIfScenario } from './components/WhatIfScenario';
import { LoadingSpinner } from './components/LoadingSpinner';
import { RouteTimeline } from './components/RouteTimeline';
import { RouteAnalysis } from './components/RouteAnalysis';
import { RiskAnalysis } from './components/RiskAnalysis';
import { RouteTabs } from './components/RouteTabs';
import { getPlannerSuggestion, getStructuredExplainerAnalysis, getRouteCostAnalysis, generateRouteTimeline, getRiskAnalysis } from './services/geminiService';
import { INITIAL_SHIPMENT_ROUTES } from './constants';
import type { ShipmentRoute, PlannerResponse, WhatIfParams, CostAnalysisFactor, RouteSegment, StructuredExplanation, RiskAnalysisResponse } from './types';

// Define a type for our cache
type RouteDataCache = {
    analysis: CostAnalysisFactor[];
    segments: RouteSegment[];
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [plannerResponse, setPlannerResponse] = useState<PlannerResponse | null>(null);
  const [explainerResponse, setExplainerResponse] = useState<StructuredExplanation | null>(null);
  
  const [routesData, setRoutesData] = useState<ShipmentRoute[]>(INITIAL_SHIPMENT_ROUTES);
  const [whatIfParams, setWhatIfParams] = useState<WhatIfParams>({
    fuelCostIncreasePercentage: 0,
    additionalCustomsDelayDays: 0,
  });

  const [currentGoal, setCurrentGoal] = useState<string>('');
  const [currentConstraints, setCurrentConstraints] = useState<string>('');
  
  const [selectedRoute, setSelectedRoute] = useState<ShipmentRoute | null>(null);
  
  // State for caching and loading statuses
  const [cachedRouteData, setCachedRouteData] = useState<Record<string, RouteDataCache>>({});
  const [routeLoadingStatus, setRouteLoadingStatus] = useState<Record<string, boolean>>({});

  // New state for risk analysis
  const [isRiskLoading, setIsRiskLoading] = useState<boolean>(false);
  const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysisResponse | null>(null);

  const fetchAndCacheRouteDetails = useCallback(async (route: ShipmentRoute) => {
    // Don't fetch if already cached or already loading
    if (cachedRouteData[route.route_name] || routeLoadingStatus[route.route_name]) {
      return;
    }
    
    setRouteLoadingStatus(prev => ({ ...prev, [route.route_name]: true }));

    try {
      const [analysis, segments] = await Promise.all([
        getRouteCostAnalysis(route),
        generateRouteTimeline(route)
      ]);
      setCachedRouteData(prev => ({ ...prev, [route.route_name]: { analysis, segments } }));
    } catch (err) {
      console.error(`Failed to fetch details for ${route.route_name}:`, err);
      // Optionally clear cache for this route if it fails
      setCachedRouteData(prev => {
        const newCache = { ...prev };
        delete newCache[route.route_name];
        return newCache;
      });
    } finally {
      setRouteLoadingStatus(prev => ({ ...prev, [route.route_name]: false }));
    }
  }, [cachedRouteData, routeLoadingStatus]);


  const handleRouteSelect = useCallback((route: ShipmentRoute) => {
      setSelectedRoute(route);
      setRiskAnalysis(null); // Clear risk analysis when switching routes
      // Fetch data for the selected route if it's not already cached
      if (!cachedRouteData[route.route_name]) {
          fetchAndCacheRouteDetails(route);
      }
  }, [cachedRouteData, fetchAndCacheRouteDetails]);


  const runAnalysis = useCallback(async (goal: string, constraints: string, currentRoutes: ShipmentRoute[]) => {
    if (!goal) return;

    setIsLoading(true);
    setError(null);
    setPlannerResponse(null);
    setExplainerResponse(null);
    setSelectedRoute(null);
    setCachedRouteData({}); // Clear cache on new analysis
    setRouteLoadingStatus({});
    setRiskAnalysis(null); // Clear old risk analysis

    try {
      const plannerResult = await getPlannerSuggestion(currentRoutes, goal, constraints);
      setPlannerResponse(plannerResult);

      if (plannerResult && plannerResult.suggested_route) {
        const suggested = currentRoutes.find(r => r.route_name === plannerResult.suggested_route);
        if (suggested) {
            // Automatically select the suggested route and fetch its data first
            setSelectedRoute(suggested);
            await fetchAndCacheRouteDetails(suggested);
        }
        
        // Fetch explainer and other routes' data in parallel
        const explainerPromise = getStructuredExplainerAnalysis(currentRoutes, plannerResult);
        const backgroundFetchPromise = Promise.all(
          currentRoutes
            .filter(r => r.route_name !== plannerResult.suggested_route)
            .map(r => fetchAndCacheRouteDetails(r))
        );

        const explainerResult = await explainerPromise;
        setExplainerResponse(explainerResult);

        await backgroundFetchPromise;
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [fetchAndCacheRouteDetails]);

  const handleRunRiskAnalysis = async () => {
    if (!selectedRoute) return;

    setIsRiskLoading(true);
    setRiskAnalysis(null);
    try {
        const result = await getRiskAnalysis(selectedRoute, currentConstraints);
        setRiskAnalysis(result);
    } catch (err) {
        console.error("Failed to run risk analysis:", err);
        // Maybe set an error state specific to the risk component
    } finally {
        setIsRiskLoading(false);
    }
  };
  
  useEffect(() => {
    const updatedRoutes = INITIAL_SHIPMENT_ROUTES.map(route => {
      const costMultiplier = 1 + whatIfParams.fuelCostIncreasePercentage / 100;
      const newCost = Math.round(route.base_cost_usd * costMultiplier);
      
      const newTransitTime = route.transit_time_days + (route.risk_factors.customs_delay_days + whatIfParams.additionalCustomsDelayDays);

      return {
        ...route,
        base_cost_usd: newCost,
        transit_time_days: newTransitTime,
      };
    });
    setRoutesData(updatedRoutes);
    
    if (selectedRoute) {
        const updatedSelected = updatedRoutes.find(r => r.route_name === selectedRoute.route_name);
        if(updatedSelected) {
            setSelectedRoute(updatedSelected);
        }
    }

    if (currentGoal) {
       runAnalysis(currentGoal, currentConstraints, updatedRoutes);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [whatIfParams]);

  const handlePlanShipment = async (goal: string, constraints: string) => {
    setCurrentGoal(goal);
    setCurrentConstraints(constraints);
    await runAnalysis(goal, constraints, INITIAL_SHIPMENT_ROUTES);
  };

  const selectedRouteData = selectedRoute ? cachedRouteData[selectedRoute.route_name] : null;
  const isAnalysisLoading = selectedRoute ? routeLoadingStatus[selectedRoute.route_name] : false;

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1 space-y-8">
            <InputForm onPlanShipment={handlePlanShipment} isLoading={isLoading} />
            <WhatIfScenario params={whatIfParams} setParams={setWhatIfParams} />
          </div>

          <div className="lg:col-span-2 space-y-8">
            {isLoading && (
              <div className="flex justify-center items-center h-96 bg-white rounded-lg shadow-md">
                <LoadingSpinner />
              </div>
            )}
            {!isLoading && error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md" role="alert">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline ml-2">{error}</span>
              </div>
            )}

            {!isLoading && !plannerResponse && !explainerResponse && !error && (
              <div className="flex flex-col justify-center items-center h-96 bg-white rounded-lg shadow-md p-6 text-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                <h3 className="text-xl font-semibold text-slate-700">Ready to Plan</h3>
                <p className="text-slate-500 mt-2">Enter your shipment goal to get started. The AI Copilot will analyze routes and provide you with an optimal plan.</p>
              </div>
            )}

            {/* Main results view */}
            {!isLoading && (plannerResponse || explainerResponse) && (
               <div className="bg-white rounded-lg shadow-md divide-y divide-slate-200">
                <div className="p-6">
                    <ResultsDisplay plannerResponse={plannerResponse} explanation={explainerResponse} />
                </div>
                
                <div className="px-6">
                    <RouteTabs 
                        routes={routesData} 
                        selectedRoute={selectedRoute} 
                        onSelectRoute={handleRouteSelect} 
                        loadingStatus={routeLoadingStatus}
                    />
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        <div>
                            <RouteTimeline segments={selectedRouteData?.segments ?? null} isLoading={!!isAnalysisLoading} />
                        </div>
                        <div className="space-y-8">
                            <RouteAnalysis 
                                route={selectedRoute} 
                                analysis={selectedRouteData?.analysis ?? null} 
                                isLoading={!!isAnalysisLoading} 
                            />
                             <RiskAnalysis 
                                analysis={riskAnalysis}
                                isLoading={isRiskLoading}
                                onRunAnalysis={handleRunRiskAnalysis}
                                hasPlanned={!!plannerResponse && !!selectedRoute}
                            />
                        </div>
                    </div>
                </div>
               </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;