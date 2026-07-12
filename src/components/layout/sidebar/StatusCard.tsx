'use client';

import { useSidebarStore } from '@/store/SidebarStore';
import { useDashboardMetrics } from '@/queries/useDashboard';
import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function StatusCard() {
  const { isCollapsed } = useSidebarStore();
  const { data: metrics } = useDashboardMetrics();

  if (isCollapsed) return null;

  return (
    <div className="mx-2 mb-4 p-3 rounded-xl bg-card border border-border shadow-sm overflow-hidden relative group cursor-default">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-muted-foreground">Workspace Health</span>
        <span className="text-xs font-bold text-foreground">{metrics?.health_score || 0}%</span>
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
        <span className="text-sm font-medium text-foreground">Healthy</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex flex-col">
          <span className="text-muted-foreground">Contracts</span>
          <span className="font-semibold text-foreground">{metrics?.contracts_monitored || 0}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground">Assets</span>
          <span className="font-semibold text-foreground">{metrics?.total_assets || 0}</span>
        </div>
      </div>
      
      <motion.div 
        className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"
      />
    </div>
  );
}
