import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Database, 
  Trash2, 
  RefreshCw, 
  Info,
  Clock,
  HardDrive
} from 'lucide-react';
import { cache } from '../lib/cache';

interface CacheStats {
  totalItems: number;
  totalSize: number;
  oldestItem: number | null;
}

export const CacheManager: React.FC = () => {
  const [stats, setStats] = useState<CacheStats>({ totalItems: 0, totalSize: 0, oldestItem: null });
  const [isClearing, setIsClearing] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);

  const refreshStats = () => {
    setStats(cache.getStats());
  };

  useEffect(() => {
    refreshStats();
  }, []);

  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      cache.clear();
      refreshStats();
    } catch (error) {
      console.error('Failed to clear cache:', error);
    } finally {
      setIsClearing(false);
    }
  };

  const handleCleanupExpired = async () => {
    setIsCleaning(true);
    try {
      const removedCount = cache.cleanup();
      console.log(`Cleaned up ${removedCount} expired cache items`);
      refreshStats();
    } catch (error) {
      console.error('Failed to cleanup cache:', error);
    } finally {
      setIsCleaning(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number | null): string => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Cache Management</h3>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshStats}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Info className="h-4 w-4 text-blue-500" />
            <div>
              <div className="text-sm text-muted-foreground">Total Items</div>
              <div className="font-semibold">{stats.totalItems}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <HardDrive className="h-4 w-4 text-green-500" />
            <div>
              <div className="text-sm text-muted-foreground">Storage Used</div>
              <div className="font-semibold">{formatBytes(stats.totalSize)}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Clock className="h-4 w-4 text-orange-500" />
            <div>
              <div className="text-sm text-muted-foreground">Oldest Item</div>
              <div className="font-semibold text-xs">
                {stats.oldestItem ? formatDate(stats.oldestItem) : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Cached data helps reduce API calls and improves performance. Items expire after 24 hours.
            </span>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              Planner Results
            </Badge>
            <Badge variant="outline" className="text-xs">
              Route Analysis
            </Badge>
            <Badge variant="outline" className="text-xs">
              Cost Analysis
            </Badge>
            <Badge variant="outline" className="text-xs">
              Risk Analysis
            </Badge>
            <Badge variant="outline" className="text-xs">
              Timeline Data
            </Badge>
          </div>
        </div>

        <Separator />

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCleanupExpired}
            disabled={isCleaning}
            className="flex items-center gap-1"
          >
            {isCleaning ? (
              <RefreshCw className="h-3 w-3 animate-spin" />
            ) : (
              <Clock className="h-3 w-3" />
            )}
            Clean Expired
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleClearCache}
            disabled={isClearing}
            className="flex items-center gap-1"
          >
            {isClearing ? (
              <RefreshCw className="h-3 w-3 animate-spin" />
            ) : (
              <Trash2 className="h-3 w-3" />
            )}
            Clear All Cache
          </Button>
        </div>

        {stats.totalItems === 0 && (
          <div className="text-center py-4 text-muted-foreground text-sm">
            No cached data found. Start using the AI Copilot to build cache.
          </div>
        )}
      </div>
    </Card>
  );
};
