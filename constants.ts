
import type { ShipmentRoute } from './types';

export const INITIAL_SHIPMENT_ROUTES: ShipmentRoute[] = [
  {
    "route_name": "Route A (Standard Sea)",
    "origin": "Shanghai, China",
    "destination": "Los Angeles, USA",
    "mode_of_transport": "sea",
    "base_cost_usd": 12000,
    "transit_time_days": 30,
    "risk_factors": {
      "customs_delay_days": 3,
      "weather_risk_score": 6,
      "port_congestion_risk_score": 8
    }
  },
  {
    "route_name": "Route B (Air Freight)",
    "origin": "Shanghai, China",
    "destination": "Los Angeles, USA",
    "mode_of_transport": "air",
    "base_cost_usd": 55000,
    "transit_time_days": 3,
    "risk_factors": {
      "customs_delay_days": 1,
      "weather_risk_score": 3,
      "port_congestion_risk_score": 4
    }
  },
  {
    "route_name": "Route C (Expedited Sea)",
    "origin": "Shanghai, China",
    "destination": "Los Angeles, USA",
    "mode_of_transport": "sea",
    "base_cost_usd": 18500,
    "transit_time_days": 22,
    "risk_factors": {
      "customs_delay_days": 2,
      "weather_risk_score": 7,
      "port_congestion_risk_score": 7
    }
  },
  {
    "route_name": "Route D (Mixed Sea/Road)",
    "origin": "Shanghai, China",
    "destination": "Los Angeles, USA",
    "mode_of_transport": "mixed",
    "base_cost_usd": 16000,
    "transit_time_days": 26,
    "risk_factors": {
      "customs_delay_days": 4,
      "weather_risk_score": 5,
      "port_congestion_risk_score": 9
    }
  },
  {
    "route_name": "Route E (Hypothetical Land Bridge)",
    "origin": "Shanghai, China",
    "destination": "Los Angeles, USA",
    "mode_of_transport": "road",
    "base_cost_usd": 35000,
    "transit_time_days": 18,
    "risk_factors": {
      "customs_delay_days": 5,
      "weather_risk_score": 4,
      "port_congestion_risk_score": 2
    }
  }
];
