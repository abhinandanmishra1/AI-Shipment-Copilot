
import React from 'react';
import { Ship, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Ship className="h-8 w-8 text-primary" />
            <Sparkles className="h-4 w-4 text-primary absolute -top-1 -right-1" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              AI Shipment Planning Copilot
            </h1>
            <p className="text-sm text-muted-foreground">
              Intelligent logistics optimization powered by AI
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
