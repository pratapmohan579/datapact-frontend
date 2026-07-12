'use client';

import { Search } from 'lucide-react';

export default function TopNav() {
  const openCommandPalette = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  };

  return (
    <header className="h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 flex items-center px-4 md:px-6">
      <div className="flex-1 flex items-center">
        {/* Placeholder for future breadcrumbs or title */}
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <button
          onClick={openCommandPalette}
          className="flex items-center gap-2 px-3 h-9 w-full max-w-md rounded-lg border border-border bg-secondary/50 hover:bg-secondary hover:border-muted-foreground/30 transition-all duration-200 text-muted-foreground cursor-text group"
        >
          <Search className="w-4 h-4 flex-shrink-0 group-hover:text-foreground transition-colors" />
          <span className="text-sm font-medium flex-1 text-left">Search...</span>
          <kbd className="hidden md:inline-flex items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>

      <div className="flex-1 flex items-center justify-end">
        {/* Profile is now in sidebar, this space is kept for layout balance */}
      </div>
    </header>
  );
}
