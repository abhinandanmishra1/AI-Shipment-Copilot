export interface RiskFactors {
  customs_delay_days: number;
  weather_risk_score: number; // 1-10
  port_congestion_risk_score: number; // 1-10
}

export interface ShipmentRoute {
  route_name: string;
  origin: string;
  destination: string;
  mode_of_transport: 'sea' | 'air' | 'road' | 'mixed';
  base_cost_usd: number;
  transit_time_days: number;
  risk_factors: RiskFactors;
}

export interface PlannerResponse {
  suggested_route: string;
  reason: string;
}

export interface WhatIfParams {
  fuelCostIncreasePercentage: number;
  additionalCustomsDelayDays: number;
}

export interface CostAnalysisFactor {
  factor_name: string;
  impact: 'High' | 'Medium' | 'Low';
  description: string;
}

export interface RouteSegment {
    type: 'origin' | 'destination' | 'transit';
    mode?: 'truck' | 'sea' | 'air';
    details: string;
    location: string;
}

export interface ProsCons {
  pros: string[];
  cons: string[];
}

export interface RouteComparison extends ProsCons {
  route_name: string;
  summary: string;
}

export interface StructuredExplanation {
  suggested_route_summary: ProsCons;
  alternatives: RouteComparison[];
}

export interface RiskFactor {
  risk_name: string;
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  mitigation: string;
}

export interface RiskAnalysisResponse {
  risks: RiskFactor[];
}