'use client';

import { Search } from 'lucide-react';

export default function TopNav() {
  const openCommandPalette = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  };

  return (
    <header className="h-14 border-b border-zinc-950 bg-black sticky top-0 z-30 flex items-center px-4 md:px-6" data-theme="dark">
      <div className="flex-1 flex items-center">
        {/* Placeholder for future breadcrumbs or title */}
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <button
          onClick={openCommandPalette}
          className="flex items-center gap-2 px-3 h-9 w-full max-w-md rounded-lg border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 hover:border-zinc-500 transition-all duration-200 text-zinc-300 cursor-text group"
        >
          <Search className="w-4 h-4 flex-shrink-0 text-blue-500 group-hover:text-blue-400 transition-colors" />
          <span className="text-sm font-medium flex-1 text-left text-zinc-200">Search...</span>
          <kbd className="hidden md:inline-flex items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-1.5 font-mono text-[10px] font-medium opacity-100 text-zinc-300">
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
