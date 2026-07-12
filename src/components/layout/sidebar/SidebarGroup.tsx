'use client';

import { useSidebarStore } from '@/store/SidebarStore';

interface SidebarGroupProps {
  name: string;
  children: React.ReactNode;
}

export function SidebarGroup({ name, children }: SidebarGroupProps) {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="flex flex-col mb-6">
      {!isCollapsed && (
        <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
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
