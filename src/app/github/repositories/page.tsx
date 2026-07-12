"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { BookMarked, Search, AlertCircle, ArrowRight } from 'lucide-react';

const repos = [
  { id: 'analytics', name: 'analytics', prs: 18, riskEvents: 5 },
  { id: 'finance', name: 'finance', prs: 9, riskEvents: 2 },
  { id: 'marketing', name: 'marketing', prs: 7, riskEvents: 1 },
];

export default function RepositoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto text-foreground">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center">
            <BookMarked className="mr-3 text-blue-500" size={28} /> Repositories
          </h1>
          <p className="text-muted-foreground">Manage GitHub repositories monitored by DataPact.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm">
          + Connect Repository
        </button>
      </div>

      <div className="mb-6 relative w-full md:w-1/2">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <input 
          type="text" 
          placeholder="Search repositories..." 
          className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-secondary/50 text-muted-foreground text-sm uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold">Repository</th>
              <th className="px-6 py-4 font-semibold">Active PRs</th>
              <th className="px-6 py-4 font-semibold">Risk Events (30d)</th>
              <th className="px-6 py-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {repos.filter(r => r.name.includes(searchTerm)).map((repo) => (
              <tr key={repo.id} className="hover:bg-secondary/30 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center font-mono font-bold text-lg">
                    {repo.name}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="bg-secondary px-3 py-1 rounded-full text-sm font-medium">{repo.prs}</span>
                </td>
                <td className="px-6 py-5">
                  <span className="flex items-center text-orange-500 font-bold">
                    <AlertCircle size={16} className="mr-2" /> {repo.riskEvents}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <Link href={`/github/repositories/${repo.id}`} className="inline-flex items-center text-sm font-medium text-blue-500 hover:text-blue-600">
                    Manage <ArrowRight size={16} className="ml-1" />
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
