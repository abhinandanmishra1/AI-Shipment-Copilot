import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Target, Settings, Loader2 } from 'lucide-react';

interface InputFormProps {
  onPlanShipment: (goal: string, constraints: string) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onPlanShipment, isLoading }) => {
  const [goal, setGoal] = useState<string>('Find the fastest route from Shanghai to Los Angeles that is under $20,000.');
  const [constraints, setConstraints] = useState<string>('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goal.trim()) {
      onPlanShipment(goal.trim(), constraints.trim());
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Define Your Goal
        </CardTitle>
        <CardDescription>
          Describe your shipment requirements in natural language
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="goal">Planning Goal</Label>
            <Textarea
              id="goal"
              rows={4}
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., 'Find the fastest route from Shanghai to Los Angeles under $20,000'"
              required
            />
            <p className="text-xs text-muted-foreground">
              Describe your ideal shipment plan with specific requirements
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="constraints" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Additional Constraints
              <span className="text-muted-foreground font-normal">(Optional)</span>
            </Label>
            <Textarea
              id="constraints"
              rows={2}
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              placeholder="e.g., 'Requires refrigeration at 5°C', 'Avoid high-risk zones'"
            />
            <p className="text-xs text-muted-foreground">
              Special requirements like temperature control, hazardous materials, etc.
            </p>
          </div>
          
          <Button
            type="submit"
            disabled={isLoading || !goal.trim()}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Planning...
              </>
            ) : (
              'Plan Shipment'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};