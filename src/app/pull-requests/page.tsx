"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { GitPullRequest, Search, ShieldAlert, ArrowRight } from 'lucide-react';

export default function PullRequestsCenter() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: prs, isLoading, error } = useQuery({
    queryKey: ['github-prs'],
    queryFn: async () => {
      const res = await fetch("/api/v1/github/prs");
      if (!res.ok) throw new Error("Failed to load PRs");
      return res.json();
    }
  });

  const filteredPRs = prs?.filter((pr: any) => 
    pr.pr_number.toString().includes(searchTerm) || 
    (pr.author && pr.author.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto text-foreground">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center">
            <GitPullRequest className="mr-3 text-purple-500" size={28} /> Pull Request Center
          </h1>
          <p className="text-muted-foreground">Monitor and review in-flight deployments for data risk.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search PR number or author..." 
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="border border-border rounded-lg bg-card text-foreground px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Risk Levels</option>
          <option value="CRITICAL">Critical Risk</option>
          <option value="HIGH">High Risk</option>
          <option value="MEDIUM">Medium Risk</option>
          <option value="LOW">Low Risk</option>
        </select>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground animate-pulse">Loading Pull Requests...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">Failed to load Pull Requests.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-secondary/50 text-muted-foreground text-sm uppercase">
              <tr>
                <th className="px-6 py-4 font-semibold">PR</th>
                <th className="px-6 py-4 font-semibold">Repository ID</th>
                <th className="px-6 py-4 font-semibold">Author</th>
                <th className="px-6 py-4 font-semibold">Risk Analysis</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPRs.map((pr: any) => (
                <tr key={pr.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-5 font-bold">#{pr.pr_number}</td>
                  <td className="px-6 py-5 font-mono text-sm">{pr.repository_id}</td>
                  <td className="px-6 py-5">{pr.author}</td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-1 inline-flex items-center rounded text-xs font-bold uppercase ${
                      pr.risk_level === 'CRITICAL' ? 'bg-red-500/10 text-red-500' :
                      pr.risk_level === 'HIGH' ? 'bg-orange-500/10 text-orange-500' : 
                      pr.risk_level === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-500' : 
                      'bg-green-500/10 text-green-500'
                    }`}>
                      {(pr.risk_level === 'HIGH' || pr.risk_level === 'CRITICAL') && <ShieldAlert size={12} className="mr-1" />} 
                      {pr.risk_level || 'UNKNOWN'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link href={`/pull-requests/${pr.id}`} className="inline-flex items-center text-sm font-medium text-blue-500 hover:text-blue-600">
                      Review <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredPRs.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No Pull Requests found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
