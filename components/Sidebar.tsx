import React from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";
import { 
  LayoutDashboard, 
  Truck, 
  AlertTriangle, 
  GitBranch, 
  FileText 
} from "lucide-react";

interface SidebarProps {
  className?: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Truck, label: "Shipment Planner", id: "planner", badge: "AI" },
  { icon: AlertTriangle, label: "Risks", id: "risks" },
  { icon: GitBranch, label: "Scenarios", id: "scenarios" },
  { icon: FileText, label: "Reports", id: "reports" },
];

export function Sidebar({ className, activeTab, onTabChange }: SidebarProps) {

  return (
    <div className={cn("w-64 bg-white border-r border-gray-200 flex flex-col", className)}>
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">AI Workflow Copilot</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 h-11 px-3 text-left font-normal",
                  isActive 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "text-xs px-2 py-0.5",
                      isActive 
                        ? "bg-blue-500 text-white" 
                        : "bg-blue-100 text-blue-700"
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>All systems operational</span>
        </div>
      </div>
    </div>
  );
}