'use client';

import React from 'react';
import { X, MessageSquare, CheckSquare, Clock, Bell, Settings } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import PersistentCopilot from '../copilot/PersistentCopilot';

export default function UniversalRightSidebar() {
  const { isRightSidebarOpen, toggleRightSidebar, rightSidebarTab, setRightSidebarTab } = useAppStore();

  if (!isRightSidebarOpen) return null;

  return (
    <div className="w-80 h-full border-l border-border glass flex flex-col shadow-2xl relative z-40 transition-all duration-300 transform translate-x-0">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2">
          {rightSidebarTab === 'copilot' && <><MessageSquare className="w-5 h-5 text-purple-400" /><span className="font-semibold">AI Copilot</span></>}
          {rightSidebarTab === 'notifications' && <><Bell className="w-5 h-5 text-blue-400" /><span className="font-semibold">Notifications</span></>}
          {rightSidebarTab === 'tasks' && <><CheckSquare className="w-5 h-5 text-green-400" /><span className="font-semibold">Tasks</span></>}
          {rightSidebarTab === 'history' && <><Clock className="w-5 h-5 text-yellow-400" /><span className="font-semibold">History</span></>}
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1 text-muted-foreground hover:text-foreground rounded"><Settings className="w-4 h-4" /></button>
          <button onClick={toggleRightSidebar} className="p-1 text-muted-foreground hover:text-foreground rounded"><X className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center justify-between px-2 py-2 border-b border-border bg-background/50">
        <TabButton icon={<MessageSquare />} active={rightSidebarTab === 'copilot'} onClick={() => setRightSidebarTab('copilot')} />
        <TabButton icon={<Bell />} active={rightSidebarTab === 'notifications'} onClick={() => setRightSidebarTab('notifications')} />
        <TabButton icon={<CheckSquare />} active={rightSidebarTab === 'tasks'} onClick={() => setRightSidebarTab('tasks')} />
        <TabButton icon={<Clock />} active={rightSidebarTab === 'history'} onClick={() => setRightSidebarTab('history')} />
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto relative">
        {rightSidebarTab === 'copilot' && (
          <div className="absolute inset-0">
            {/* Wrapping existing PersistentCopilot to fit seamlessly */}
            <div className="h-full [&>div]:border-none [&>div]:shadow-none [&>div]:h-full [&>div]:w-full [&>div]:rounded-none">
              <PersistentCopilot overrideVisibility={true} />
            </div>
          </div>
        )}

        {rightSidebarTab === 'notifications' && (
          <div className="p-4 space-y-4">
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
              <p className="text-sm text-red-500 font-medium">Incident #402 opened</p>
              <p className="text-xs text-muted-foreground mt-1">Stripe revenue table freshness violated.</p>
            </div>
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
              <p className="text-sm text-blue-400 font-medium">5 AI Contracts Generated</p>
              <p className="text-xs text-muted-foreground mt-1">Review pending for analytics.orders</p>
            </div>
          </div>
        )}

        {rightSidebarTab === 'tasks' && (
          <div className="p-4 space-y-4">
            <p className="text-sm text-muted-foreground text-center mt-10">No pending tasks for today.</p>
          </div>
        )}

        {rightSidebarTab === 'history' && (
          <div className="p-4 space-y-4">
            <p className="text-sm text-muted-foreground text-center mt-10">No recent AI history.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({ icon, active, onClick }: { icon: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-md transition-colors ${active ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
    >
      {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-4 h-4' })}
    </button>
  );
}
