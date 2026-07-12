"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Search, BookOpen, ArrowRight } from 'lucide-react';

export default function RunbooksPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: runbooks, isLoading, error } = useQuery({
    queryKey: ['runbooks'],
    queryFn: async () => {
      const res = await fetch("/api/v1/runbooks");
      if (!res.ok) throw new Error("Failed to load runbooks");
      return res.json();
    }
  });

  if (isLoading) return <div className="p-8 text-muted-foreground animate-pulse">Loading Runbooks...</div>;
  if (error || !runbooks) return <div className="p-8 text-red-500">Failed to load runbooks.</div>;

  const filteredRunbooks = runbooks.filter((rb: any) => 
    rb.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (rb.owner_team && rb.owner_team.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto text-foreground">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Runbook Center</h1>
          <p className="text-muted-foreground">Standardized operating procedures for resolving data incidents.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm">
          + Create Runbook
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search runbooks by name..." 
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="border border-border rounded-lg bg-card text-foreground px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Severities</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRunbooks.map((rb: any) => (
          <div key={rb.id} className="p-6 rounded-xl border border-border bg-card shadow-sm hover:border-blue-500/50 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${rb.severity === 'HIGH' || rb.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-500' : rb.severity === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'}`}>
                <BookOpen size={20} />
              </div>
              <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${rb.severity === 'HIGH' || rb.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-500' : rb.severity === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>
                {rb.severity} SEV
              </span>
            </div>
            
            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-500 transition-colors">{rb.name}</h3>
            
            <div className="space-y-2 mt-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <span className="w-20 font-medium">Owner:</span>
                <span className="text-foreground">{rb.owner_team || 'Unassigned'}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
              <span className="text-xs text-muted-foreground">{rb.steps?.length || 0} Resolution Steps</span>
              <Link href={`/runbooks/${rb.id}`} className="text-sm font-medium text-blue-500 hover:text-blue-600 flex items-center">
                Open Runbook <ArrowRight size={14} className="ml-1" />
              </Link>
            </div>
          </div>
        ))}
        {filteredRunbooks.length === 0 && (
          <div className="col-span-full p-8 text-center text-muted-foreground border border-dashed rounded-lg">
            No runbooks found.
          </div>
        )}
      </div>
    </div>
  );
}
