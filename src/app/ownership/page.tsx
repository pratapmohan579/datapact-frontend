"use client"

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Shield, UserPlus, Users, AlertCircle } from 'lucide-react';

export default function OwnershipDashboard() {
  const { data: owners, isLoading: ownersLoading } = useQuery({
    queryKey: ['owners'],
    queryFn: async () => {
      const res = await fetch("/api/v1/owners");
      return res.json();
    }
  });

  const { data: teams, isLoading: teamsLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const res = await fetch("/api/v1/teams");
      return res.json();
    }
  });

  // Since we don't have a direct "assets" list API from ownership, we'll estimate based on Lineage Nodes if we had one.
  // We'll mock the total assets at 50 based on seed_db.py, or better, fetch lineagenodes if available.
  const { data: nodes } = useQuery({
    queryKey: ['lineageNodes'],
    queryFn: async () => {
      const res = await fetch("/api/v1/lineage/graph");
      return res.json();
    }
  });

  if (ownersLoading || teamsLoading) return <div className="p-8 text-muted-foreground animate-pulse">Loading Ownership Dashboard...</div>;

  const totalAssets = nodes?.nodes?.length || 50;
  const assignedAssets = owners?.length || 0;
  const unassignedAssets = totalAssets - assignedAssets;
  const coveragePercent = totalAssets > 0 ? Math.round((assignedAssets / totalAssets) * 100) : 0;

  // Aggregate assets by team
  const teamMap: Record<string, number> = {};
  owners?.forEach((o: any) => {
    if (o.team_name) {
      teamMap[o.team_name] = (teamMap[o.team_name] || 0) + 1;
    }
  });

  const assetsByTeam = Object.keys(teamMap).map(team => ({
    name: team,
    value: teamMap[team]
  })).sort((a, b) => b.value - a.value).slice(0, 5);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto text-foreground">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Ownership Dashboard</h1>
          <p className="text-muted-foreground">Manage dataset ownership and accountability across the organization.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm flex flex-col justify-between">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
              <Shield size={20} />
            </div>
            <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">Total Assets</h3>
          </div>
          <span className="text-4xl font-bold mt-2">{totalAssets}</span>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card shadow-sm flex flex-col justify-between">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
              <UserPlus size={20} />
            </div>
            <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">Assigned Assets</h3>
          </div>
          <span className="text-4xl font-bold mt-2">{assignedAssets}</span>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card shadow-sm flex flex-col justify-between">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
              <AlertCircle size={20} />
            </div>
            <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">Unassigned Assets</h3>
          </div>
          <span className="text-4xl font-bold mt-2">{unassignedAssets > 0 ? unassignedAssets : 0}</span>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card shadow-sm flex flex-col justify-between">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg">
              <Users size={20} />
            </div>
            <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">Teams</h3>
          </div>
          <span className="text-4xl font-bold mt-2">{teams?.length || 0}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <h2 className="text-xl font-bold mb-6">Ownership Coverage</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Global Coverage</span>
              <span className="text-sm font-bold text-green-500">{coveragePercent}%</span>
            </div>
            <div className="w-full bg-secondary h-4 rounded-full overflow-hidden flex">
              <div className="bg-green-500 h-full" style={{ width: `${coveragePercent}%` }}></div>
            </div>
          </div>
          
          <h2 className="text-xl font-bold mt-8 mb-6">Assets by Team</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assetsByTeam} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: 'var(--color-foreground)', fontSize: 12}} width={150} />
                <Tooltip cursor={{fill: 'var(--bg-secondary)'}} contentStyle={{backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-border)'}} />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center">
              <AlertCircle size={20} className="mr-2 text-red-500" />
              Unowned Assets (Needs Action)
            </h2>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-secondary text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Asset Name</th>
                  <th className="px-4 py-3 rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {/* Find assets not in owners list */}
                {nodes?.nodes?.filter((n: any) => !owners?.find((o: any) => o.asset_id === n.id)).slice(0, 5).map((asset: any) => (
                  <tr key={asset.id} className="hover:bg-secondary/50 transition-colors">
                    <td className="px-4 py-4 font-medium">{asset.id}</td>
                    <td className="px-4 py-4">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center shadow-sm">
                        <UserPlus size={14} className="mr-1" /> Assign Owner
                      </button>
                    </td>
                  </tr>
                ))}
                {nodes?.nodes?.filter((n: any) => !owners?.find((o: any) => o.asset_id === n.id)).length === 0 && (
                   <tr><td colSpan={2} className="px-4 py-4 text-center text-muted-foreground">All assets have owners!</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
