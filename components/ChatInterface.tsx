import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Send,
  Bot,
  User,
  Truck,
  AlertTriangle,
  Info,
  Loader2,
} from "lucide-react";
import React from "react";
import { ScrollArea } from "./ui/scroll-area";

interface Message {
  id: string;
  content: string;
  sender: "user" | "planner" | "risk" | "explainer" | "whatif";
  timestamp: Date;
  isLoading?: boolean;
}

const agentConfig = {
  planner: {
    name: "Planner Agent",
    icon: Truck,
    color: "bg-blue-500",
    avatar: "PA",
  },
  risk: {
    name: "Risk Agent",
    icon: AlertTriangle,
    color: "bg-orange-500",
    avatar: "RA",
  },
  explainer: {
    name: "Explainer Agent",
    icon: Info,
    color: "bg-teal-500",
    avatar: "EA",
  },
  whatif: {
    name: "What-If Agent",
    icon: Bot,
    color: "bg-purple-500",
    avatar: "WI",
  },
};

interface ChatInterfaceProps {
  messages?: Message[];
  onSendMessage?: (message: string) => void;
  isProcessing?: boolean;
}

export function ChatInterface({ 
  messages = [],
  onSendMessage,
  isProcessing = false
}: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    if (onSendMessage) {
      onSendMessage(newMessage);
    }
    
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <Card className="h-[500px] flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">
          AI Command Center
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Chat with your AI agents to plan shipments
        </p>
      </div>

      <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map((message) => (
            <div key={message.id} className="flex gap-4">
              {message.sender === "user" ? (
                <>
                  <div className="flex-1" />
                  <div className="flex items-start gap-3 max-w-md">
                    <div className="bg-blue-600 text-white rounded-2xl px-4 py-3 text-sm">
                      {message.content}
                    </div>
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-gray-200 text-gray-600">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </>
              ) : (
                <div className="flex items-start gap-3 max-w-2xl">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback
                      className={`${agentConfig[message.sender].color} text-white`}
                    >
                      {message.isLoading ? 
                        <Loader2 className="h-4 w-4 animate-spin" /> : 
                        agentConfig[message.sender].avatar
                      }
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {agentConfig[message.sender].name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <div className="bg-gray-50 rounded-2xl px-4 py-3 text-sm text-gray-800 leading-relaxed">
                      {message.isLoading ? (
                        <div className="flex items-center gap-2">
                          <span>Processing</span>
                          <span className="inline-flex">
                            <span className="animate-bounce">.</span>
                            <span className="animate-bounce animation-delay-200">.</span>
                            <span className="animate-bounce animation-delay-400">.</span>
                          </span>
                        </div>
                      ) : (
                        message.content
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Show processing indicator at the bottom */}
          {isProcessing && (
            <div className="flex items-start gap-3 max-w-2xl">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="bg-blue-500 text-white">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    AI Assistant
                  </span>
                </div>
                <div className="bg-gray-50 rounded-2xl px-4 py-3 text-sm text-gray-800">
                  <div className="flex items-center gap-2">
                    <span>Processing your request</span>
                    <span className="inline-flex">
                      <span className="animate-bounce">.</span>
                      <span className="animate-bounce animation-delay-200">.</span>
                      <span className="animate-bounce animation-delay-400">.</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-6 border-t border-gray-100">
        <div className="flex gap-3">
          <Input
            placeholder="Ask AI to plan shipments, analyze risks, or explain recommendations..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isProcessing}
            className="flex-1 bg-gray-50 border-gray-200 rounded-xl px-4 py-3 text-sm placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isProcessing || !newMessage.trim()}
            className="bg-black hover:bg-gray-800 text-white rounded-xl px-4 py-3 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </Card>
  );
}