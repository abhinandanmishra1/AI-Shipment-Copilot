import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

const costDurationData = [
  { mode: "Ocean", cost: 1200, duration: 14 },
  { mode: "Air", cost: 4800, duration: 4 },
  { mode: "Express Air", cost: 8500, duration: 2 },
  { mode: "Rail", cost: 2800, duration: 18 },
  { mode: "Truck", cost: 6200, duration: 7 }
];

const riskData = [
  { subject: "Weather", A: 4, fullMark: 5 },
  { subject: "Customs", A: 2, fullMark: 5 },
  { subject: "Fuel Cost", A: 4, fullMark: 5 },
  { subject: "Capacity", A: 2, fullMark: 5 },
  { subject: "Security", A: 1, fullMark: 5 },
  { subject: "Documentation", A: 2, fullMark: 5 }
];

const shipmentData = [
  {
    id: "SH001",
    mode: "Ocean",
    route: "Shanghai → LA",
    cost: "$1,200",
    duration: "14 days",
    risk: 3.2,
    status: "Planned"
  },
  {
    id: "SH002", 
    mode: "Air",
    route: "Shanghai → LA",
    cost: "$4,800",
    duration: "4 days", 
    risk: 2.1,
    status: "In Transit"
  },
  {
    id: "SH003",
    mode: "Express Air",
    route: "Shanghai → LA", 
    cost: "$8,500",
    duration: "2 days",
    risk: 1.8,
    status: "Delivered"
  },
  {
    id: "SH004",
    mode: "Ocean",
    route: "Shanghai → LA",
    cost: "$1,200", 
    duration: "14 days",
    risk: 3.5,
    status: "Planned"
  },
  {
    id: "SH005",
    mode: "Air",
    route: "Shanghai → LA",
    cost: "$4,800",
    duration: "4 days",
    risk: 2.3,
    status: "Planning"
  }
];

const getRiskColor = (score: number) => {
  if (score <= 2) return "bg-green-100 text-green-800 border-green-200";
  if (score <= 3.5) return "bg-yellow-100 text-yellow-800 border-yellow-200";
  return "bg-red-100 text-red-800 border-red-200";
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Delivered": return "bg-green-100 text-green-800 border-green-200";
    case "In Transit": return "bg-blue-100 text-blue-800 border-blue-200";
    case "Planned": return "bg-purple-100 text-purple-800 border-purple-200";
    case "Planning": return "bg-gray-100 text-gray-800 border-gray-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export function VisualizationPanel() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Cost vs Duration Chart */}
      <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">Cost vs Duration Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={costDurationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="mode" 
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis 
                yAxisId="left" 
                orientation="left"
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
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
              />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="cost" 
                stroke="#2563eb" 
                strokeWidth={3}
                name="Cost ($)"
                dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="duration" 
                stroke="#dc2626" 
                strokeWidth={3}
                name="Duration (days)"
                dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Risk Assessment Radar */}
      <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">Risk Assessment Radar</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={riskData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 5]} 
                tick={{ fontSize: 10, fill: '#64748b' }}
                tickCount={6}
              />
              <Radar
                name="Risk Level"
                dataKey="A"
                stroke="#14b8a6"
                fill="#14b8a6"
                fillOpacity={0.25}
                strokeWidth={2}
                dot={{ fill: '#14b8a6', strokeWidth: 2, r: 3 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '14px'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Shipment Comparison Table */}
      <Card className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">Shipment Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200">
                  <TableHead className="text-gray-700 font-medium">Shipment ID</TableHead>
                  <TableHead className="text-gray-700 font-medium">Mode</TableHead>
                  <TableHead className="text-gray-700 font-medium">Route</TableHead>
                  <TableHead className="text-gray-700 font-medium">Cost</TableHead>
                  <TableHead className="text-gray-700 font-medium">Duration</TableHead>
                  <TableHead className="text-gray-700 font-medium">Risk Score</TableHead>
                  <TableHead className="text-gray-700 font-medium">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipmentData.map((shipment) => (
                  <TableRow key={shipment.id} className="border-gray-100 hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-900">{shipment.id}</TableCell>
                    <TableCell className="text-gray-700">{shipment.mode}</TableCell>
                    <TableCell className="text-gray-700">{shipment.route}</TableCell>
                    <TableCell className="text-gray-700 font-medium">{shipment.cost}</TableCell>
                    <TableCell className="text-gray-700">{shipment.duration}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`${getRiskColor(shipment.risk)} text-xs font-medium`}
                      >
                        {shipment.risk}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(shipment.status)} text-xs font-medium`}
                      >
                        {shipment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
