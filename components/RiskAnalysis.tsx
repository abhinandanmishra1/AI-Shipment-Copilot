import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { AlertTriangle, CheckCircle, Loader2, Shield } from 'lucide-react';
import type { RiskAnalysisResponse } from '../types';

interface RiskAnalysisProps {
  analysis: RiskAnalysisResponse | null;
  isLoading: boolean;
  onRunAnalysis: () => void;
  hasPlanned: boolean; // To know if a plan has been generated
}

const SeverityBadge: React.FC<{ severity: 'High' | 'Medium' | 'Low' }> = ({ severity }) => {
  const variants = {
    High: 'destructive',
    Medium: 'secondary',
    Low: 'outline',
  } as const;
  
  return (
    <Badge variant={variants[severity]} className="text-xs">
      {severity} Risk
    </Badge>
  );
};

const RiskIcon: React.FC<{ severity: 'High' | 'Medium' | 'Low' }> = ({ severity }) => {
  const colors = {
    High: 'text-red-600',
    Medium: 'text-yellow-600', 
    Low: 'text-orange-600',
  };
  
  return <AlertTriangle className={`h-4 w-4 ${colors[severity]}`} />;
};


export const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ analysis, isLoading, onRunAnalysis, hasPlanned }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="shrink-0">
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Risk Analysis
        </CardTitle>
      </CardHeader>

      {!hasPlanned && (
        <CardContent className="flex-grow flex flex-col justify-center items-center text-center">
          <Shield className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">
            Complete a shipment plan to enable risk analysis
          </p>
        </CardContent>
      )}

      {hasPlanned && !analysis && (
        <CardContent className="flex-grow flex flex-col justify-center items-center text-center space-y-4">
          <p className="text-muted-foreground">
            Check the selected route for potential issues based on your constraints
          </p>
          <Button
            onClick={onRunAnalysis}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4" />
                Run Risk Analysis
              </>
            )}
          </Button>
        </CardContent>
      )}

      {isLoading && hasPlanned && (
        <CardContent className="flex-grow flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-muted-foreground">Analyzing risks...</p>
          </div>
        </CardContent>
      )}

      {analysis && !isLoading && (
        <CardContent className="flex-grow overflow-y-auto space-y-4">
          {analysis.risks.length === 0 ? (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>
                <div className="space-y-2">
                  <h3 className="font-semibold text-green-800">All Clear</h3>
                  <p className="text-sm text-green-700">
                    No significant risks identified for this route based on your constraints
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {analysis.risks.map((risk, index) => (
                <Alert key={index} className="border-yellow-200 bg-yellow-50">
                  <RiskIcon severity={risk.severity} />
                  <AlertDescription>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-yellow-900">{risk.risk_name}</h4>
                        <SeverityBadge severity={risk.severity} />
                      </div>
                      <p className="text-sm text-yellow-800">{risk.description}</p>
                      <div className="text-xs text-yellow-700 bg-yellow-100 p-2 rounded">
                        <strong>Mitigation:</strong> {risk.mitigation}
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};