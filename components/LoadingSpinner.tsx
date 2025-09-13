
import React from 'react';
import { Loader2, Brain } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <Brain className="h-6 w-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary" />
      </div>
      <div className="text-center">
        <p className="text-lg font-medium">AI Copilot is analyzing...</p>
        <p className="text-sm text-muted-foreground">Processing your shipment requirements</p>
      </div>
    </div>
  );
};
