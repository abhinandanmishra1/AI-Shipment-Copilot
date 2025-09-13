// Types for our route data
export interface Port {
  id: string;
  name: string;
  code: string;
  country: string;
  coordinates: [number, number]; // [longitude, latitude]
}

export interface RouteSegment {
  origin: string; // Port ID
  destination: string; // Port ID
  mode: 'ocean' | 'air' | 'rail' | 'truck';
  duration: number; // days
  distance: number; // km
  cost: number; // USD
}

export interface ShipmentRoute {
  id: string;
  name: string;
  description: string;
  segments: RouteSegment[];
  totalCost: number;
  totalDuration: number;
  totalDistance: number;
  co2Emissions: number; // kg CO2
  riskScore: number; // 1-10
  riskFactors: {
    weather: number; // 1-10
    customs: number; // 1-10
    political: number; // 1-10
    congestion: number; // 1-10
  };
}

// Major ports data
export const ports: Port[] = [
  { 
    id: 'SHA', 
    name: 'Shanghai', 
    code: 'CNSHA', 
    country: 'China', 
    coordinates: [121.8, 31.2]
  },
  { 
    id: 'SIN', 
    name: 'Singapore', 
    code: 'SGSIN', 
    country: 'Singapore', 
    coordinates: [103.8, 1.3]
  },
  { 
    id: 'RTM', 
    name: 'Rotterdam', 
    code: 'NLRTM', 
    country: 'Netherlands', 
    coordinates: [4.4, 51.9]
  },
  { 
    id: 'BUS', 
    name: 'Busan', 
    code: 'KRBUN', 
    country: 'South Korea', 
    coordinates: [129.0, 35.1]
  },
  { 
    id: 'LAX', 
    name: 'Los Angeles', 
    code: 'USLAX', 
    country: 'United States', 
    coordinates: [-118.2, 33.7]
  },
  { 
    id: 'NYC', 
    name: 'New York', 
    code: 'USNYC', 
    country: 'United States', 
    coordinates: [-74.0, 40.7]
  },
  { 
    id: 'HKG', 
    name: 'Hong Kong', 
    code: 'HKHKG', 
    country: 'China', 
    coordinates: [114.2, 22.3]
  },
  { 
    id: 'DXB', 
    name: 'Dubai', 
    code: 'AEDXB', 
    country: 'UAE', 
    coordinates: [55.3, 25.3]
  },
  { 
    id: 'SYD', 
    name: 'Sydney', 
    code: 'AUSYD', 
    country: 'Australia', 
    coordinates: [151.2, -33.9]
  }
];

// Generate shipment routes
export const shipmentRoutes: ShipmentRoute[] = [
  {
    id: 'SH001',
    name: 'Ocean Standard',
    description: 'Standard ocean freight from Shanghai to Los Angeles',
    segments: [
      {
        origin: 'SHA',
        destination: 'LAX',
        mode: 'ocean',
        duration: 14,
        distance: 10540,
        cost: 1200
      }
    ],
    totalCost: 1200,
    totalDuration: 14,
    totalDistance: 10540,
    co2Emissions: 450,
    riskScore: 3.2,
    riskFactors: {
      weather: 4,
      customs: 2,
      political: 1,
      congestion: 3
    }
  },
  {
    id: 'SH002',
    name: 'Air Express',
    description: 'Direct air freight from Shanghai to Los Angeles',
    segments: [
      {
        origin: 'SHA',
        destination: 'LAX',
        mode: 'air',
        duration: 4,
        distance: 10200,
        cost: 4800
      }
    ],
    totalCost: 4800,
    totalDuration: 4,
    totalDistance: 10200,
    co2Emissions: 1200,
    riskScore: 2.1,
    riskFactors: {
      weather: 3,
      customs: 2,
      political: 1,
      congestion: 2
    }
  },
  {
    id: 'SH003',
    name: 'Premium Air',
    description: 'Priority air freight with expedited customs',
    segments: [
      {
        origin: 'SHA',
        destination: 'LAX',
        mode: 'air',
        duration: 2,
        distance: 10200,
        cost: 8500
      }
    ],
    totalCost: 8500,
    totalDuration: 2,
    totalDistance: 10200,
    co2Emissions: 1350,
    riskScore: 1.8,
    riskFactors: {
      weather: 2,
      customs: 1,
      political: 1,
      congestion: 1
    }
  },
  {
    id: 'SH004',
    name: 'Multi-Modal',
    description: 'Combined sea and rail transport',
    segments: [
      {
        origin: 'SHA',
        destination: 'SIN',
        mode: 'ocean',
        duration: 5,
        distance: 3800,
        cost: 600
      },
      {
        origin: 'SIN',
        destination: 'DXB',
        mode: 'ocean',
        duration: 7,
        distance: 6500,
        cost: 800
      },
      {
        origin: 'DXB',
        destination: 'LAX',
        mode: 'air',
        duration: 3,
        distance: 13600,
        cost: 3200
      }
    ],
    totalCost: 4600,
    totalDuration: 15,
    totalDistance: 23900,
    co2Emissions: 850,
    riskScore: 4.5,
    riskFactors: {
      weather: 5,
      customs: 4,
      political: 2,
      congestion: 4
    }
  },
  {
    id: 'SH005',
    name: 'Economy Ocean',
    description: 'Cost-effective ocean route with longer transit time',
    segments: [
      {
        origin: 'SHA',
        destination: 'BUS',
        mode: 'ocean',
        duration: 3,
        distance: 1050,
        cost: 300
      },
      {
        origin: 'BUS',
        destination: 'LAX',
        mode: 'ocean',
        duration: 12,
        distance: 9200,
        cost: 700
      }
    ],
    totalCost: 1000,
    totalDuration: 15,
    totalDistance: 10250,
    co2Emissions: 420,
    riskScore: 3.8,
    riskFactors: {
      weather: 4,
      customs: 3,
      political: 1,
      congestion: 4
    }
  }
];

// Function to get port by ID
export function getPort(id: string): Port | undefined {
  return ports.find(port => port.id === id);
}

// Function to get port name by ID
export function getPortName(id: string): string {
  const port = getPort(id);
  return port ? port.name : id;
}

// Function to get route by ID
export function getRoute(id: string): ShipmentRoute | undefined {
  return shipmentRoutes.find(route => route.id === id);
}

// Function to calculate risk level text
export function getRiskLevel(score: number): 'Low' | 'Medium' | 'High' {
  if (score <= 2.5) return 'Low';
  if (score <= 5) return 'Medium';
  return 'High';
}

// Function to get risk color class
export function getRiskColorClass(score: number): string {
  if (score <= 2.5) return 'bg-green-100 text-green-800 border-green-200';
  if (score <= 5) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  return 'bg-red-100 text-red-800 border-red-200';
}

// Function to get mode icon name
export function getModeIcon(mode: string): string {
  switch (mode) {
    case 'ocean': return 'ship';
    case 'air': return 'plane';
    case 'rail': return 'train';
    case 'truck': return 'truck';
    default: return 'box';
  }
}

// Function to get formatted cost
export function formatCost(cost: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(cost);
}

// Function to get formatted duration
export function formatDuration(days: number): string {
  return `${days} day${days !== 1 ? 's' : ''}`;
}

// Function to get formatted distance
export function formatDistance(distance: number): string {
  return `${(distance).toLocaleString()} km`;
}

// Function to get formatted CO2 emissions
export function formatCO2(emissions: number): string {
  return `${emissions.toLocaleString()} kg`;
}
