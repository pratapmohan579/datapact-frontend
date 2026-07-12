'use client';

import { useSidebarStore } from '@/store/SidebarStore';
import { useAppStore } from '@/store/useAppStore';
import { ChevronDown, Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFloating, offset, flip, shift, autoUpdate, useClick, useInteractions } from '@floating-ui/react';
import { useState } from 'react';

export function WorkspaceSwitcher() {
  const { isCollapsed } = useSidebarStore();
  const { workspaces, activeWorkspaceId, setActiveWorkspace } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-start',
    middleware: [offset(8), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click]);

  return (
    <div className="relative">
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        className={cn(
          "w-full flex items-center justify-between p-2 rounded-xl transition-all duration-200 hover:bg-muted/50 border border-transparent hover:border-border cursor-pointer group",
          isCollapsed ? "justify-center" : ""
        )}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
            DP
          </div>
          {!isCollapsed && (
            <div className="flex flex-col items-start truncate">
              <span className="text-sm font-semibold text-foreground truncate">
                {workspaces.find(w => w.id === activeWorkspaceId)?.name || 'Select Workspace'}
              </span>
              <span className="text-xs text-muted-foreground truncate">Production</span>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-200 group-hover:text-foreground" />
        )}
      </button>

      {isOpen && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className="z-50 w-64 bg-card border border-border rounded-xl shadow-xl p-2 outline-none flex flex-col gap-1"
        >
          <div className="text-xs font-semibold text-muted-foreground px-2 py-1.5 uppercase tracking-wider">Workspaces</div>
          
          <div className="max-h-[200px] overflow-y-auto flex flex-col gap-1">
            {workspaces.map(ws => (
              <button 
                key={ws.id}
                onClick={() => {
                  setActiveWorkspace(ws.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-2 py-1.5 text-sm rounded-lg hover:bg-muted text-foreground flex items-center justify-between transition-colors",
                  activeWorkspaceId === ws.id ? "bg-muted font-medium" : ""
                )}
              >
                {ws.name}
                {activeWorkspaceId === ws.id && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </div>
          
          <div className="h-px bg-border my-1 mx-1"></div>
          
          <button className="w-full text-left px-2 py-1.5 text-sm rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" />
            Create Workspace...
          </button>
        </div>
      )}
    </div>
  );
}
