"use client"

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Users, Activity, ShieldAlert, ArrowRight } from 'lucide-react';

export default function TeamsPage() {
  const { data: teams, isLoading, error } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const res = await fetch("/api/v1/teams");
      if (!res.ok) throw new Error("Failed to load teams");
      return res.json();
    }
  });

  if (isLoading) return <div className="p-8 text-muted-foreground animate-pulse">Loading Teams...</div>;
  if (error || !teams) return <div className="p-8 text-red-500">Failed to load teams.</div>;

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto text-foreground">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Teams</h1>
          <p className="text-muted-foreground">Manage organizational groups, their owned assets, and performance metrics.</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-secondary/50 text-muted-foreground text-sm uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold">Team Name</th>
              <th className="px-6 py-4 font-semibold">Manager</th>
              <th className="px-6 py-4 font-semibold">Contact Email</th>
              <th className="px-6 py-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {teams.length === 0 ? (
              <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">No teams found.</td></tr>
            ) : teams.map((team: any) => (
              <tr key={team.id} className="hover:bg-secondary/30 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mr-4">
                      <Users size={18} />
                    </div>
                    <span className="font-semibold">{team.team_name}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-muted-foreground">
                  {team.manager || 'Unassigned'}
                </td>
                <td className="px-6 py-5">
                  <span className="text-blue-500 hover:underline">{team.email || 'N/A'}</span>
                </td>
                <td className="px-6 py-5 text-right">
                  <Link href={`/teams/${team.id}`} className="inline-flex items-center text-sm font-medium text-blue-500 hover:text-blue-600">
                    View Details <ArrowRight size={16} className="ml-1" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
