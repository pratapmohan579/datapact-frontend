'use client';

import { useSidebarStore } from '@/store/SidebarStore';
import { ChevronUp, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFloating, offset, flip, shift, autoUpdate, useClick, useInteractions } from '@floating-ui/react';
import { useState } from 'react';

export function UserMenu() {
  const { isCollapsed } = useSidebarStore();
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'top-start',
    middleware: [offset(12), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click]);

  return (
    <div className="relative">
      <button
        ref={(node) => { refs.setReference(node); }}
        {...getReferenceProps()}
        className={cn(
          "w-full flex items-center justify-between p-2 rounded-xl transition-all duration-200 hover:bg-muted/50 border border-transparent hover:border-border cursor-pointer group",
          isCollapsed ? "justify-center" : ""
        )}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-foreground" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col items-start truncate">
              <span className="text-sm font-semibold text-foreground truncate">Mohan Pratap</span>
              <span className="text-xs text-muted-foreground truncate">Admin</span>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <ChevronUp className="w-4 h-4 text-muted-foreground transition-transform duration-200 group-hover:text-foreground" />
        )}
      </button>

      {isOpen && (
        <div
          ref={(node) => { refs.setFloating(node); }}
          style={floatingStyles}
          {...getFloatingProps()}
          className="z-50 w-64 bg-card border border-border rounded-xl shadow-xl py-2 outline-none flex flex-col gap-1"
        >
          <div className="px-3 py-2">
            <p className="text-sm font-medium text-foreground">Mohan Pratap</p>
            <p className="text-xs text-muted-foreground">mohan@datapact.dev</p>
          </div>
          <div className="h-px bg-border my-1"></div>
          
          <MenuItem label="Profile" />
          <MenuItem label="Workspace Settings" />
          <MenuItem label="Keyboard Shortcuts" />
          <MenuItem label="Theme" />
          
          <div className="h-px bg-border my-1"></div>
          
          <MenuItem label="Documentation" />
          <MenuItem label="Help Center" />
          
          <div className="h-px bg-border my-1"></div>
          
          <MenuItem label="Sign Out" className="text-red-500 hover:text-red-600 hover:bg-red-500/10" />
        </div>
      )}
    </div>
  );
}

function MenuItem({ label, className }: { label: string, className?: string }) {
  return (
    <button className={cn("w-full text-left px-3 py-1.5 text-sm text-foreground hover:bg-muted transition-colors", className)}>
      {label}
    </button>
  );
}
