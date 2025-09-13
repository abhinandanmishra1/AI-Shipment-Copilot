import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Settings, Bell } from "lucide-react";

export function TopNavigation() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-900">AI Workflow Copilot</h1>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
          <Settings className="h-5 w-5" />
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" alt="User" />
          <AvatarFallback className="bg-gray-200 text-gray-700 text-sm font-medium">JD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
