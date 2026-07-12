"use client"

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { GitPullRequest, ShieldAlert, XOctagon } from 'lucide-react';

const Github = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function GithubDashboard() {
  const { data: repos, isLoading: reposLoading } = useQuery({
    queryKey: ['github-repos'],
    queryFn: async () => {
      const res = await fetch("/api/v1/github/repositories");
      return res.json();
    }
  });

  const { data: prs, isLoading: prsLoading } = useQuery({
    queryKey: ['github-prs'],
    queryFn: async () => {
      const res = await fetch("/api/v1/github/prs");
      return res.json();
    }
  });

  if (reposLoading || prsLoading) return <div className="p-8 text-muted-foreground animate-pulse">Loading GitHub Dashboard...</div>;

  const openPRs = prs?.length || 0;
  const highRiskPRs = prs?.filter((pr: any) => pr.risk_level === 'HIGH' || pr.risk_level === 'CRITICAL').length || 0;
  const blockedDeployments = prs?.filter((pr: any) => pr.risk_level === 'CRITICAL').length || 0;

  // Calculate risk trend data dynamically
  const riskCounts = { Low: 0, Medium: 0, High: 0, Critical: 0 };
  prs?.forEach((pr: any) => {
    if (pr.risk_level === 'LOW') riskCounts.Low++;
    else if (pr.risk_level === 'MEDIUM') riskCounts.Medium++;
    else if (pr.risk_level === 'HIGH') riskCounts.High++;
    else if (pr.risk_level === 'CRITICAL') riskCounts.Critical++;
  });

  const riskTrendData = [
    { name: 'Low', value: riskCounts.Low, fill: '#22c55e' },
    { name: 'Medium', value: riskCounts.Medium, fill: '#eab308' },
    { name: 'High', value: riskCounts.High, fill: '#f97316' },
    { name: 'Critical', value: riskCounts.Critical, fill: '#ef4444' },
  ];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto text-foreground">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center">
            <Github className="mr-3" size={28} /> GitHub Integration
          </h1>
          <p className="text-muted-foreground">CI/CD Guardrails protecting production from breaking changes.</p>
        </div>
        <div className="flex space-x-3">
           <button className="border border-border hover:bg-secondary px-4 py-2 rounded-md text-sm font-semibold transition-colors">
            Connect Repository
          </button>
          <Link href="/pull-requests" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm">
            View Pull Requests
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><Github size={20} /></div>
            <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">Connected Repos</h3>
          </div>
          <span className="text-4xl font-bold text-foreground">{repos?.length || 0}</span>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-500/10 text-green-500 rounded-lg"><GitPullRequest size={20} /></div>
            <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">Open PRs</h3>
          </div>
          <span className="text-4xl font-bold text-foreground">{openPRs}</span>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg"><ShieldAlert size={20} /></div>
            <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">High Risk PRs</h3>
          </div>
          <span className="text-4xl font-bold text-foreground">{highRiskPRs}</span>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-red-500/10 text-red-500 rounded-lg"><XOctagon size={20} /></div>
            <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">Blocked Deployments</h3>
          </div>
          <span className="text-4xl font-bold text-foreground">{blockedDeployments}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <h2 className="text-xl font-bold mb-6">Recent PR Activity</h2>
          <div className="overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg font-semibold">PR</th>
                  <th className="px-4 py-3 font-semibold">Author</th>
                  <th className="px-4 py-3 rounded-tr-lg font-semibold">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {prs?.slice(0, 5).map((pr: any) => (
                  <tr key={pr.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3"><Link href={`/pull-requests/${pr.id}`} className="font-bold text-blue-500 hover:underline">#{pr.pr_number}</Link></td>
                    <td className="px-4 py-3">{pr.author}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        pr.risk_level === 'CRITICAL' ? 'bg-red-500/10 text-red-500' :
                        pr.risk_level === 'HIGH' ? 'bg-orange-500/10 text-orange-500' :
                        pr.risk_level === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-green-500/10 text-green-500'
                      }`}>
                        {pr.risk_level || "UNKNOWN"}
                      </span>
                    </td>
                  </tr>
                ))}
                {prs?.length === 0 && (
                  <tr><td colSpan={3} className="px-4 py-4 text-center text-muted-foreground">No recent PRs.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Risk Trend Chart</h2>
            <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full">Current Snapshot</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskTrendData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-border)" />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <RechartsTooltip cursor={{fill: 'var(--bg-secondary)'}} contentStyle={{backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-border)'}} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {riskTrendData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
