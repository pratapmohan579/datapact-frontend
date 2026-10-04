'use client';

import { useSidebarStore } from '@/store/SidebarStore';
import { cn } from '@/lib/utils';

interface SidebarGroupProps {
  name: string;
  children: React.ReactNode;
}

export function SidebarGroup({ name, children }: SidebarGroupProps) {
  const { isCollapsed } = useSidebarStore();
  const isOverview = name === 'Overview';

  return (
    <div className="flex flex-col mb-6">
      {!isCollapsed && (
        <h3 className={cn(
          "px-3 text-xs font-bold uppercase tracking-wider mb-2",
          isOverview ? "text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.4)]" : "text-muted-foreground"
        )}>
          {name}
        </h3>
      )}
      {isCollapsed && (
        <div className="w-full flex justify-center mb-2">
          <div className="w-4 h-[1px] bg-border rounded-full" />
        </div>
      )}
      <div className="flex flex-col gap-1">
        {children}
      </div>
    </div>
  );
}
