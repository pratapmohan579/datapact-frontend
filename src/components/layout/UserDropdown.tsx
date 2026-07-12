'use client';

import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, Key, Bot, CreditCard, Shield, Bell, Palette, Keyboard, HelpCircle, Book, MessageSquare, LogOut, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { currentUser } = useAppStore();
  
  const initials = currentUser?.full_name 
    ? currentUser.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';
  const firstName = currentUser?.full_name?.split(' ')[0] || 'User';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigateTo = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pl-2 pr-3 bg-muted/30 hover:bg-muted/60 border border-border rounded-full transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
          {initials}
        </div>
        <span className="text-sm font-medium text-foreground hidden md:block">{firstName}</span>
        <ChevronDown className="w-3 h-3 text-muted-foreground hidden md:block" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-card border border-border shadow-2xl rounded-xl overflow-hidden glass z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          
          {/* Header */}
          <div className="p-4 border-b border-border bg-muted/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
                {initials}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground leading-tight">{currentUser?.full_name || 'User'}</span>
                <span className="text-xs font-medium text-muted-foreground mt-0.5">{currentUser?.roles?.[0] || 'Member'}</span>
              </div>
            </div>
          </div>

          <div className="p-1.5 max-h-[60vh] overflow-y-auto">
            {/* Section 1 */}
            <div className="flex flex-col gap-0.5">
              <button onClick={() => navigateTo('/profile')} className="flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors w-full text-left">
                <User className="w-4 h-4" /> My Profile
              </button>
              <button onClick={() => navigateTo('/settings')} className="flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors w-full text-left">
                <Settings className="w-4 h-4" /> Workspace Settings
              </button>
              <button onClick={() => navigateTo('/settings/api-keys')} className="flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors w-full text-left">
                <Key className="w-4 h-4" /> API Keys
              </button>
              <button onClick={() => navigateTo('/settings/agents')} className="flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors w-full text-left">
                <Bot className="w-4 h-4" /> Agents
              </button>
              <button onClick={() => navigateTo('/settings/billing')} className="flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors w-full text-left">
                <CreditCard className="w-4 h-4" /> Billing
              </button>
              <button onClick={() => navigateTo('/settings/security')} className="flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors w-full text-left">
                <Shield className="w-4 h-4" /> Security
              </button>
              <button onClick={() => navigateTo('/settings/notifications')} className="flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors w-full text-left">
                <Bell className="w-4 h-4" /> Notification Preferences
              </button>
              <button onClick={() => navigateTo('/settings/appearance')} className="flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors w-full text-left">
                <Palette className="w-4 h-4" /> Appearance
              </button>
              <button onClick={() => navigateTo('/settings/shortcuts')} className="flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors w-full text-left">
                <Keyboard className="w-4 h-4" /> Keyboard Shortcuts
              </button>
            </div>

            <div className="h-px bg-border my-1.5 mx-2" />

            {/* Section 2 */}
            <div className="flex flex-col gap-0.5">
              <button onClick={() => navigateTo('/help')} className="flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors w-full text-left">
                <HelpCircle className="w-4 h-4" /> Help Center
              </button>
              <button onClick={() => navigateTo('/docs')} className="flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors w-full text-left">
                <Book className="w-4 h-4" /> Documentation
              </button>
              <button onClick={() => navigateTo('/feedback')} className="flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors w-full text-left">
                <MessageSquare className="w-4 h-4" /> Feedback
              </button>
            </div>

            <div className="h-px bg-border my-1.5 mx-2" />

            {/* Section 3 */}
            <div className="flex flex-col gap-0.5">
              <button onClick={() => navigateTo('/auth/login')} className="flex items-center gap-2.5 px-3 py-2 text-sm text-red-500/80 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors w-full text-left font-medium">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
