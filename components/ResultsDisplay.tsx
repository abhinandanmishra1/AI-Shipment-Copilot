import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, XCircle, Info, Lightbulb, Route } from 'lucide-react';
import type { PlannerResponse, StructuredExplanation, ProsCons } from '../types';

interface ResultsDisplayProps {
  plannerResponse: PlannerResponse | null;
  explanation: StructuredExplanation | null;
}

const ProsConsList: React.FC<{ list: string[]; type: 'pros' | 'cons' }> = ({ list, type }) => {
  if (list.length === 0) return null;
  
  const isPros = type === 'pros';
  const icon = isPros ? 
    <CheckCircle className="h-4 w-4 text-green-600 shrink-0" /> : 
    <XCircle className="h-4 w-4 text-red-600 shrink-0" />;
  const title = isPros ? 'Pros' : 'Cons';
  const textColor = isPros ? 'text-foreground' : 'text-foreground';

  return (
    <div>
      <h4 className="text-sm font-semibold mb-3 text-muted-foreground">{title}</h4>
      <ul className="space-y-2">
        {list.map((item, index) => (
          <li key={index} className={`flex items-start gap-3 text-sm ${textColor}`}>
            {icon}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ plannerResponse, explanation }) => {
  if (!plannerResponse) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">AI Copilot Analysis</h2>
      </div>
        
      {/* Suggested Route */}
      <Alert className="border-primary/20 bg-primary/5">
        <Route className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Recommended Route:</span>
              <Badge variant="default" className="font-semibold">
                {plannerResponse.suggested_route}
              </Badge>
            </div>
            <p className="text-sm">{plannerResponse.reason}</p>
          </div>
        </AlertDescription>
      </Alert>
        
      {explanation && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Suggested Route Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recommended Route Analysis</CardTitle>
              <CardDescription>
                Detailed breakdown of the suggested option
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ProsConsList list={explanation.suggested_route_summary.pros} type="pros" />
              <ProsConsList list={explanation.suggested_route_summary.cons} type="cons" />
            </CardContent>
          </Card>

          {/* Alternative Options */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Alternative Options</h3>
            </div>
            {explanation.alternatives.slice(0, 2).map((alt) => (
              <Card key={alt.route_name}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{alt.route_name}</CardTitle>
                  <CardDescription className="text-sm">
                    {alt.summary}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ProsConsList list={alt.pros} type="pros" />
                  <ProsConsList list={alt.cons} type="cons" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};