'use client';

import { motion } from 'framer-motion';
import { useSidebarStore } from '@/store/SidebarStore';
import { DataPactLogo } from '@/components/ui/Logo';
import { NAVIGATION_GROUPS, SETTINGS_NAVIGATION } from './sidebar/NavigationConfig';
import { SidebarGroup } from './sidebar/SidebarGroup';
import { SidebarItem } from './sidebar/SidebarItem';
import { StatusCard } from './sidebar/StatusCard';
import { UserMenu } from './sidebar/UserMenu';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const { isCollapsed, toggleCollapse } = useSidebarStore();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-[280px] h-screen bg-secondary/30 border-r border-border shrink-0 flex flex-col z-40 hidden md:flex" />
    );
  }

  return (
    <motion.aside
      layout
      initial={false}
      animate={{ 
        width: isCollapsed ? 72 : 280,
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        mass: 0.8
      }}
      className={cn(
        "h-screen bg-[#0F111A] border-r border-border shrink-0 flex flex-col z-40 relative hidden md:flex",
        // Using a very dark, premium bg like Linear or Cursor
      )}
    >
      {/* Top Header / Logo */}
      <div className={cn(
        "flex flex-col justify-center h-16 transition-all duration-300 border-b border-white/5",
        isCollapsed ? "items-center px-0" : "px-6"
      )}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
            <DataPactLogo className="w-8 h-8" />
          </div>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 tracking-tight"
            >
              DataPact
            </motion.span>
          )}
        </div>
      </div>

      {/* Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto px-2 py-4 scrollbar-none">
        {NAVIGATION_GROUPS.map((group) => (
          <SidebarGroup key={group.name} name={group.name}>
            {group.items.map((item) => (
              <SidebarItem
                key={item.name}
                name={item.name}
                href={item.href}
                icon={item.icon}
                // Optional badges for specific routes to demonstrate live counts
                badge={item.name === 'Incidents' ? 12 : undefined}
              />
            ))}
          </SidebarGroup>
        ))}

        <div className="mt-8 mb-4 h-px bg-border/50 mx-4" />

        <SidebarGroup name="Settings">
          {SETTINGS_NAVIGATION.map((item) => (
            <SidebarItem
              key={item.name}
              name={item.name}
              href={item.href}
              icon={item.icon}
            />
          ))}
        </SidebarGroup>
      </div>

      {/* Collapse Toggle Button (Floating middle-right) */}
      <button
        onClick={toggleCollapse}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:scale-110 transition-all shadow-md z-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {isCollapsed ? <PanelLeftOpen className="w-3.5 h-3.5" /> : <PanelLeftClose className="w-3.5 h-3.5" />}
      </button>

      {/* Bottom Footer */}
      <div className="flex flex-col p-2 gap-2 mt-auto border-t border-border/50 bg-[#0F111A]">
        <StatusCard />
        <UserMenu />
      </div>
    </motion.aside>
  );
}
