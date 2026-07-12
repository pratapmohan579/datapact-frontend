'use client';

import { useSidebarStore } from '@/store/SidebarStore';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

export function CommandSearch() {
  const { isCollapsed } = useSidebarStore();

  const openCommandPalette = () => {
    // Dispatch a custom event to open the command palette
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  };

  return (
    <button
      onClick={openCommandPalette}
      className={cn(
        "w-full flex items-center gap-2 px-3 h-9 rounded-lg border border-border bg-secondary/50 hover:bg-secondary hover:border-muted-foreground/30 transition-all duration-200 text-muted-foreground cursor-text group",
        isCollapsed ? "justify-center px-0 bg-transparent border-transparent hover:bg-muted/50" : ""
      )}
    >
      <Search className="w-4 h-4 flex-shrink-0 group-hover:text-foreground transition-colors" />
      {!isCollapsed && (
        <>
          <span className="text-sm font-medium flex-1 text-left">Search...</span>
          <kbd className="hidden md:inline-flex items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </>
      )}
    </button>
  );
}
