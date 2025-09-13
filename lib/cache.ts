import type { ShipmentRoute, PlannerResponse, StructuredExplanation, CostAnalysisFactor, RouteSegment, RiskAnalysisResponse } from '../types';

// Cache configuration
const CACHE_PREFIX = 'ai_shipment_';
const CACHE_EXPIRY_HOURS = 24; // Cache expires after 24 hours

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

// Generate cache keys for different query types
export const generateCacheKey = {
  planner: (routes: ShipmentRoute[], goal: string, constraints: string): string => {
    const routesHash = JSON.stringify(routes.map(r => ({
      name: r.route_name,
      cost: r.base_cost_usd,
      transit: r.transit_time_days,
      risks: r.risk_factors
    })));
    return `${CACHE_PREFIX}planner_${btoa(routesHash + goal + constraints).replace(/[^a-zA-Z0-9]/g, '')}`;
  },
  
  explainer: (routes: ShipmentRoute[], plannerResponse: PlannerResponse): string => {
    const routesHash = JSON.stringify(routes.map(r => r.route_name));
    const plannerHash = JSON.stringify(plannerResponse);
    return `${CACHE_PREFIX}explainer_${btoa(routesHash + plannerHash).replace(/[^a-zA-Z0-9]/g, '')}`;
  },
  
  costAnalysis: (route: ShipmentRoute): string => {
    const routeHash = JSON.stringify({
      name: route.route_name,
      cost: route.base_cost_usd,
      transit: route.transit_time_days,
      risks: route.risk_factors
    });
    return `${CACHE_PREFIX}cost_${btoa(routeHash).replace(/[^a-zA-Z0-9]/g, '')}`;
  },
  
  timeline: (route: ShipmentRoute): string => {
    const routeHash = JSON.stringify({
      name: route.route_name,
      origin: route.origin,
      destination: route.destination,
      mode: route.mode_of_transport,
      transit: route.transit_time_days
    });
    return `${CACHE_PREFIX}timeline_${btoa(routeHash).replace(/[^a-zA-Z0-9]/g, '')}`;
  },
  
  riskAnalysis: (route: ShipmentRoute, constraints: string): string => {
    const routeHash = JSON.stringify({
      name: route.route_name,
      risks: route.risk_factors,
      constraints
    });
    return `${CACHE_PREFIX}risk_${btoa(routeHash).replace(/[^a-zA-Z0-9]/g, '')}`;
  }
};

// Generic cache operations
export const cache = {
  // Set item in cache with expiration
  set: <T>(key: string, data: T): void => {
    try {
      const now = Date.now();
      const item: CacheItem<T> = {
        data,
        timestamp: now,
        expiresAt: now + (CACHE_EXPIRY_HOURS * 60 * 60 * 1000)
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to cache data:', error);
    }
  },

  // Get item from cache (returns null if expired or not found)
  get: <T>(key: string): T | null => {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;

      const item: CacheItem<T> = JSON.parse(cached);
      const now = Date.now();

      // Check if expired
      if (now > item.expiresAt) {
        localStorage.removeItem(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.warn('Failed to retrieve cached data:', error);
      return null;
    }
  },

  // Remove specific item from cache
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove cached data:', error);
    }
  },

  // Clear all cache items with our prefix
  clear: (): void => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  },

  // Get cache statistics
  getStats: (): { totalItems: number; totalSize: number; oldestItem: number | null } => {
    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
      
      let totalSize = 0;
      let oldestTimestamp: number | null = null;

      cacheKeys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
          totalSize += value.length;
          try {
            const item: CacheItem<any> = JSON.parse(value);
            if (oldestTimestamp === null || item.timestamp < oldestTimestamp) {
              oldestTimestamp = item.timestamp;
            }
          } catch (e) {
            // Invalid cache item, ignore
          }
        }
      });

      return {
        totalItems: cacheKeys.length,
        totalSize,
        oldestItem: oldestTimestamp
      };
    } catch (error) {
      console.warn('Failed to get cache stats:', error);
      return { totalItems: 0, totalSize: 0, oldestItem: null };
    }
  },

  // Clean up expired items
  cleanup: (): number => {
    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
      const now = Date.now();
      let removedCount = 0;

      cacheKeys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            const item: CacheItem<any> = JSON.parse(value);
            if (now > item.expiresAt) {
              localStorage.removeItem(key);
              removedCount++;
            }
          } catch (e) {
            // Invalid cache item, remove it
            localStorage.removeItem(key);
            removedCount++;
          }
        }
      });

      return removedCount;
    } catch (error) {
      console.warn('Failed to cleanup cache:', error);
      return 0;
    }
  }
};

// Typed cache operations for specific data types
export const typedCache = {
  planner: {
    get: (routes: ShipmentRoute[], goal: string, constraints: string): PlannerResponse | null => {
      const key = generateCacheKey.planner(routes, goal, constraints);
      return cache.get<PlannerResponse>(key);
    },
    set: (routes: ShipmentRoute[], goal: string, constraints: string, data: PlannerResponse): void => {
      const key = generateCacheKey.planner(routes, goal, constraints);
      cache.set(key, data);
    }
  },

  explainer: {
    get: (routes: ShipmentRoute[], plannerResponse: PlannerResponse): StructuredExplanation | null => {
      const key = generateCacheKey.explainer(routes, plannerResponse);
      return cache.get<StructuredExplanation>(key);
    },
    set: (routes: ShipmentRoute[], plannerResponse: PlannerResponse, data: StructuredExplanation): void => {
      const key = generateCacheKey.explainer(routes, plannerResponse);
      cache.set(key, data);
    }
  },

  costAnalysis: {
    get: (route: ShipmentRoute): CostAnalysisFactor[] | null => {
      const key = generateCacheKey.costAnalysis(route);
      return cache.get<CostAnalysisFactor[]>(key);
    },
    set: (route: ShipmentRoute, data: CostAnalysisFactor[]): void => {
      const key = generateCacheKey.costAnalysis(route);
      cache.set(key, data);
    }
  },

  timeline: {
    get: (route: ShipmentRoute): RouteSegment[] | null => {
      const key = generateCacheKey.timeline(route);
      return cache.get<RouteSegment[]>(key);
    },
    set: (route: ShipmentRoute, data: RouteSegment[]): void => {
      const key = generateCacheKey.timeline(route);
      cache.set(key, data);
    }
  },

  riskAnalysis: {
    get: (route: ShipmentRoute, constraints: string): RiskAnalysisResponse | null => {
      const key = generateCacheKey.riskAnalysis(route, constraints);
      return cache.get<RiskAnalysisResponse>(key);
    },
    set: (route: ShipmentRoute, constraints: string, data: RiskAnalysisResponse): void => {
      const key = generateCacheKey.riskAnalysis(route, constraints);
      cache.set(key, data);
    }
  }
};
