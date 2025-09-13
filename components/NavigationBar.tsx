import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Bell, 
  Settings, 
  User, 
  Sparkles,
  Activity,
  Zap
} from 'lucide-react';

interface NavigationBarProps {
  onNotificationClick?: () => void;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  onNotificationClick,
  onSettingsClick,
  onProfileClick
}) => {
  return (
    <nav className="dashboard-nav sticky top-0 z-50 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Logo and Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-header flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Shipment Copilot</h1>
              <p className="text-sm text-gray-500">Intelligent Logistics Planning</p>
            </div>
          </div>
          
          {/* Status Indicators */}
          <div className="hidden md:flex items-center gap-2 ml-6">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Activity className="h-3 w-3 mr-1" />
              Online
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Zap className="h-3 w-3 mr-1" />
              AI Ready
            </Badge>
          </div>
        </div>

        {/* Right: Actions and User */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onNotificationClick}
            className="relative hover:bg-gray-100"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* Settings */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettingsClick}
            className="hover:bg-gray-100"
          >
            <Settings className="h-4 w-4" />
          </Button>

          {/* User Profile */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">Alex Johnson</p>
              <p className="text-xs text-gray-500">Logistics Manager</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onProfileClick}
              className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:shadow-lg transition-all duration-200"
            >
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
