
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { BarChart3, Package, Clock, Shield, Loader2, MapPin } from 'lucide-react';
import type { ShipmentRoute, CostAnalysisFactor } from '../types';

interface RouteAnalysisProps {
  route: ShipmentRoute | null;
  analysis: CostAnalysisFactor[] | null;
  isLoading: boolean;
}

const getIconForFactor = (factorName: string) => {
  const lowerCaseFactor = factorName.toLowerCase();
  if (lowerCaseFactor.includes('mode') || lowerCaseFactor.includes('transport')) {
    return <Package className="w-5 h-5 text-primary" />;
  }
  if (lowerCaseFactor.includes('time') || lowerCaseFactor.includes('speed')) {
    return <Clock className="w-5 h-5 text-primary" />;
  }
  if (lowerCaseFactor.includes('risk') || lowerCaseFactor.includes('delay')) {
    return <Shield className="w-5 h-5 text-primary" />;
  }
  return <Package className="w-5 h-5 text-primary" />; // Default icon
};

const ImpactBadge: React.FC<{ impact: 'High' | 'Medium' | 'Low' }> = ({ impact }) => {
  const variants = {
    High: 'destructive',
    Medium: 'secondary',
    Low: 'outline',
  } as const;
  
  return (
    <Badge variant={variants[impact]} className="text-xs">
      {impact} Impact
    </Badge>
  );
};

export const RouteAnalysis: React.FC<RouteAnalysisProps> = ({ route, analysis, isLoading }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="shrink-0">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Route Cost Analysis
        </CardTitle>
      </CardHeader>
      
      {!route && (
        <CardContent className="flex-grow flex flex-col justify-center items-center text-center">
          <MapPin className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">
            Select a route to see detailed cost breakdown
          </p>
        </CardContent>
      )}

      {isLoading && (
        <CardContent className="flex-grow flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-muted-foreground">Analyzing costs...</p>
          </div>
        </CardContent>
      )}

      {route && !isLoading && analysis && (
        <CardContent className="flex-grow overflow-y-auto space-y-4">
          <div className="sticky top-0 bg-background pb-2 border-b">
            <Badge variant="outline" className="font-medium">
              {route.route_name}
            </Badge>
          </div>
          
          <div className="space-y-3">
            {analysis.map((factor, index) => (
              <Card key={index} className="border-muted">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 p-2 bg-muted rounded-lg">
                      {getIconForFactor(factor.factor_name)}
                    </div>
                    <div className="flex-grow space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{factor.factor_name}</h4>
                        <ImpactBadge impact={factor.impact} />
                      </div>
                      <p className="text-sm text-muted-foreground">{factor.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      )}

      {route && !isLoading && !analysis && (
        <CardContent className="flex-grow flex flex-col justify-center items-center text-center">
          <div className="text-destructive space-y-2">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <BarChart3 className="h-6 w-6" />
            </div>
            <p>Could not load analysis for this route</p>
            <p className="text-sm text-muted-foreground">Please try again</p>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
