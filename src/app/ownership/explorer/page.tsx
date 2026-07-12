"use client"

import React, { useState } from 'react';
import { Users, FileText, LayoutDashboard, Settings, ChevronRight, ChevronDown, ShieldCheck } from 'lucide-react';

const ownershipTree = [
  {
    team: 'Data Platform Team',
    assets: [
      { name: 'orders_raw', type: 'table', health: 'Healthy' },
      { name: 'orders_clean', type: 'table', health: 'Healthy' },
      { name: 'orders_mart', type: 'model', health: 'Warning' },
      { name: 'users_raw', type: 'table', health: 'Healthy' },
    ]
  },
  {
    team: 'Finance Team',
    assets: [
      { name: 'revenue_dashboard', type: 'dashboard', health: 'Healthy' },
      { name: 'finance_report', type: 'dashboard', health: 'Healthy' },
      { name: 'tax_model', type: 'model', health: 'Healthy' },
    ]
  },
  {
    team: 'Analytics Team',
    assets: [
      { name: 'customer_dashboard', type: 'dashboard', health: 'Warning' },
      { name: 'retention_model', type: 'model', health: 'Healthy' },
    ]
  }
];

export default function OwnershipExplorer() {
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({
    'Data Platform Team': true,
    'Finance Team': true,
  });

  const toggleTeam = (teamName: string) => {
    setExpandedTeams(prev => ({
      ...prev,
      [teamName]: !prev[teamName]
    }));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'table': return <FileText size={16} className="text-blue-500" />;
      case 'model': return <Settings size={16} className="text-purple-500" />;
      case 'dashboard': return <LayoutDashboard size={16} className="text-green-500" />;
      default: return <FileText size={16} />;
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto text-foreground">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Ownership Explorer</h1>
          <p className="text-muted-foreground">Hierarchical view of all data assets grouped by their owning teams.</p>
        </div>
      </div>

      <div className="border border-border rounded-xl bg-card shadow-sm p-6">
        <div className="space-y-4 font-mono text-sm">
          {ownershipTree.map((teamNode) => (
            <div key={teamNode.team} className="space-y-2">
              {/* Team Header */}
              <div 
                className="flex items-center space-x-2 font-bold cursor-pointer hover:bg-secondary p-2 rounded-lg transition-colors select-none"
                onClick={() => toggleTeam(teamNode.team)}
              >
                {expandedTeams[teamNode.team] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                <Users size={18} className="text-blue-500" />
                <span className="text-lg font-sans">{teamNode.team}</span>
                <span className="bg-secondary px-2 py-0.5 rounded-full text-xs font-sans text-muted-foreground ml-2">
                  {teamNode.assets.length} Assets
                </span>
              </div>

              {/* Assets List */}
              {expandedTeams[teamNode.team] && (
                <div className="pl-8 relative">
                  {/* Vertical line connecting children */}
                  <div className="absolute left-4 top-0 bottom-4 w-px bg-border"></div>
                  
                  {teamNode.assets.map((asset, index) => (
                    <div key={asset.name} className="flex items-center space-x-3 py-2 relative group">
                      {/* Horizontal branch line */}
                      <div className="absolute left-[-16px] top-1/2 w-4 h-px bg-border"></div>
                      
                      {getIcon(asset.type)}
                      <span className="text-foreground group-hover:text-blue-500 transition-colors cursor-pointer">
                        {asset.name}
                      </span>
                      {asset.health === 'Healthy' ? (
                        <ShieldCheck size={14} className="text-green-500" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-yellow-500" title="Warning state"></span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
