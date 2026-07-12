'use client';

import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useAppStore } from '@/store/useAppStore';
import { Database, Shield, Bot, AlertTriangle, FileText, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import './command-center.css';

export default function CommandCenter() {
  const { isCommandCenterOpen, setCommandCenterOpen } = useAppStore();
  const router = useRouter();
  
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandCenterOpen(!isCommandCenterOpen);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isCommandCenterOpen, setCommandCenterOpen]);

  if (!isCommandCenterOpen) return null;

  const navigateTo = (path: string) => {
    router.push(path);
    setCommandCenterOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm" onClick={() => setCommandCenterOpen(false)}>
      <div 
        className="w-full max-w-2xl bg-card/80 border border-border shadow-2xl rounded-2xl overflow-hidden glass animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <Command label="Command Menu" className="w-full">
          <div className="flex items-center px-4 py-3 border-b border-border">
            <Command.Input 
              autoFocus 
              placeholder="Search assets, commands, incidents..." 
              className="w-full bg-transparent border-none text-lg outline-none placeholder:text-muted-foreground"
            />
            <button onClick={() => setCommandCenterOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <Command.List className="max-h-[300px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">No results found.</Command.Empty>
            
            <Command.Group heading="Quick Actions" className="px-2 py-1 text-xs font-semibold text-muted-foreground">
              <Command.Item onSelect={() => navigateTo('/ai/contracts')} className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-muted cursor-pointer text-sm">
                <Bot className="w-4 h-4 text-purple-400" />
                <span>Generate AI Contract</span>
              </Command.Item>
              <Command.Item onSelect={() => navigateTo('/metadata/discovery')} className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-muted cursor-pointer text-sm">
                <Database className="w-4 h-4 text-blue-400" />
                <span>Scan Metadata</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Navigation" className="px-2 py-1 text-xs font-semibold text-muted-foreground mt-2">
              <Command.Item onSelect={() => navigateTo('/assets')} className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-muted cursor-pointer text-sm">
                <Database className="w-4 h-4" />
                <span>Asset Catalog</span>
              </Command.Item>
              <Command.Item onSelect={() => navigateTo('/contracts')} className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-muted cursor-pointer text-sm">
                <Shield className="w-4 h-4" />
                <span>Data Contracts</span>
              </Command.Item>
              <Command.Item onSelect={() => navigateTo('/incidents')} className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-muted cursor-pointer text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Incidents</span>
              </Command.Item>
              <Command.Item onSelect={() => navigateTo('/runbooks')} className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-muted cursor-pointer text-sm">
                <FileText className="w-4 h-4" />
                <span>Runbooks</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
