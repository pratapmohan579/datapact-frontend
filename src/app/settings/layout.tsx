'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, Users, Shield, Key, Bot, Terminal, Database, Github, Wind, MessageSquare, Mail, AlertTriangle, CreditCard, Activity, FileText, Lock, Fingerprint, Smartphone, Palette, Zap, Cpu } from 'lucide-react';

const SETTINGS_CATEGORIES = [
  {
    title: "Organization",
    items: [
      { name: "General", path: "/settings/general", icon: <Settings className="w-4 h-4" /> },
      { name: "Users", path: "/settings/users", icon: <Users className="w-4 h-4" /> },
      { name: "Teams", path: "/settings/teams", icon: <Users className="w-4 h-4" /> },
      { name: "Roles", path: "/settings/roles", icon: <Shield className="w-4 h-4" /> },
      { name: "Permissions", path: "/settings/permissions", icon: <Shield className="w-4 h-4" /> },
    ]
  },
  {
    title: "Developer",
    items: [
      { name: "API Keys", path: "/settings/api-keys", icon: <Key className="w-4 h-4" /> },
      { name: "AI Models", path: "/settings/ai-models", icon: <Cpu className="w-4 h-4" /> },
      { name: "Agents", path: "/settings/agents", icon: <Bot className="w-4 h-4" /> },
      { name: "CLI", path: "/settings/cli", icon: <Terminal className="w-4 h-4" /> },
    ]
  },
  {
    title: "Connections",
    items: [
      { name: "Data Sources", path: "/data-sources", icon: <Database className="w-4 h-4" /> },
      { name: "GitHub", path: "/settings/github", icon: <Github className="w-4 h-4" /> },
      { name: "Airflow", path: "/settings/airflow", icon: <Wind className="w-4 h-4" /> },
      { name: "dbt", path: "/settings/dbt", icon: <Zap className="w-4 h-4" /> },
      { name: "Slack", path: "/settings/slack", icon: <MessageSquare className="w-4 h-4" /> },
      { name: "Email", path: "/settings/email", icon: <Mail className="w-4 h-4" /> },
      { name: "PagerDuty", path: "/settings/pagerduty", icon: <AlertTriangle className="w-4 h-4" /> },
    ]
  },
  {
    title: "Billing & Usage",
    items: [
      { name: "Billing", path: "/settings/billing", icon: <CreditCard className="w-4 h-4" /> },
      { name: "Usage", path: "/settings/usage", icon: <Activity className="w-4 h-4" /> },
      { name: "Audit Logs", path: "/settings/audit-logs", icon: <FileText className="w-4 h-4" /> },
    ]
  },
  {
    title: "Security & Preferences",
    items: [
      { name: "Security", path: "/settings/security", icon: <Lock className="w-4 h-4" /> },
      { name: "SSO", path: "/settings/sso", icon: <Fingerprint className="w-4 h-4" /> },
      { name: "MFA", path: "/settings/mfa", icon: <Smartphone className="w-4 h-4" /> },
      { name: "Appearance", path: "/settings/appearance", icon: <Palette className="w-4 h-4" /> },
    ]
  }
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-full bg-background">
      {/* Settings Navigation Sidebar */}
      <div className="w-64 border-r border-border bg-card/30 hidden md:block overflow-y-auto custom-scrollbar">
        <div className="p-6">
          <h2 className="text-xl font-bold tracking-tight mb-6">Settings</h2>
          
          <div className="flex flex-col gap-6">
            {SETTINGS_CATEGORIES.map((category) => (
              <div key={category.title}>
                <h3 className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {category.title}
                </h3>
                <div className="flex flex-col gap-1">
                  {category.items.map((item) => {
                    const isActive = pathname === item.path || (pathname === '/settings' && item.path === '/settings/general');
                    
                    return (
                      <Link
                        key={item.name}
                        href={item.path}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive 
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold' 
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                      >
                        <span className={`${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                          {item.icon}
                        </span>
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
