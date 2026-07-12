'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useSidebarStore } from '@/store/SidebarStore';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useFloating, offset, flip, shift, autoUpdate, useHover, useInteractions } from '@floating-ui/react';

interface SidebarItemProps {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

export function SidebarItem({ name, href, icon: Icon, badge }: SidebarItemProps) {
  const pathname = usePathname();
  const { isCollapsed } = useSidebarStore();
  const [isOpen, setIsOpen] = useState(false);
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'right',
    middleware: [offset(14), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, { enabled: isCollapsed, delay: { open: 200, close: 0 } });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  return (
    <div className="relative">
      <Link
        href={href}
        ref={refs.setReference as any}
        {...getReferenceProps()}
        className={cn(
          "relative flex items-center gap-3 rounded-lg outline-none transition-colors",
          isCollapsed ? "justify-center h-10 w-10 mx-auto" : "px-3 py-2 w-full",
          isActive ? "text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
        )}
      >
        {isActive && (
          <motion.div
            layoutId="active-nav-indicator"
            className={cn(
              "absolute bg-gradient-to-r from-blue-600/20 to-purple-600/10 border-l-2 border-blue-600 rounded-lg",
              isCollapsed ? "inset-0 border-l-[3px]" : "inset-0"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}

        <div className="relative z-10 flex items-center justify-center">
          <Icon className={cn("w-5 h-5", isActive ? "text-blue-500" : "")} />
          {isCollapsed && badge && badge > 0 && (
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-card" />
          )}
        </div>

        {!isCollapsed && (
          <>
            <span className="relative z-10 text-sm font-medium flex-1 truncate">{name}</span>
            {badge !== undefined && badge > 0 && (
              <span className="relative z-10 text-[10px] font-bold bg-blue-500 text-white px-1.5 py-0.5 rounded-full">
                {badge > 99 ? '99+' : badge}
              </span>
            )}
          </>
        )}
      </Link>

      <AnimatePresence>
        {isCollapsed && isOpen && (
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-50"
          >
            <motion.div
              initial={{ opacity: 0, x: -5, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -5, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="bg-card border border-border shadow-xl px-3 py-1.5 rounded-md text-sm font-medium text-foreground whitespace-nowrap flex items-center gap-2"
            >
              {name}
              {badge !== undefined && badge > 0 && (
                <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
