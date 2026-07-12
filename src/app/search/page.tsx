'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Database, Shield, Users, BookOpen, GitMerge, AlertCircle, FileBox } from 'lucide-react';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';

  const { data, isLoading, error } = useQuery({
    queryKey: ['search', q],
    queryFn: async () => {
      if (!q || q.length < 2) return null;
      const res = await fetch(`/api/v1/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error("Failed to fetch search results");
      return res.json();
    },
    enabled: q.length >= 2,
  });

  if (!q) {
    return <div className="p-8"><h1 className="text-2xl font-bold">Search</h1><p className="text-muted-foreground mt-4">Please enter a search term.</p></div>;
  }

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Search Results for "{q}"</h1>
        <p className="text-muted-foreground mt-2">Found matching assets, contracts, teams, runbooks, and DAGs.</p>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground animate-pulse">Searching global index...</div>
      ) : error ? (
        <div className="text-red-500 bg-red-500/10 p-4 rounded-lg">Error loading search results.</div>
      ) : !data ? (
        <div className="text-muted-foreground">Type at least 2 characters to search.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          {/* ASSETS */}
          <div className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold">Assets ({data.assets?.length || 0})</h2>
            </div>
            {data.assets?.length > 0 ? (
              <ul className="space-y-3">
                {data.assets.map((asset: any) => (
                  <li key={asset.name}>
                    <Link href={`/assets/${asset.name}`} className="flex flex-col group">
                      <span className="font-medium group-hover:text-blue-400 transition-colors">{asset.name}</span>
                      <span className="text-xs text-muted-foreground capitalize">{asset.type}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-muted-foreground">No matching assets.</p>}
          </div>

          {/* CONTRACTS */}
          <div className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-green-500" />
              <h2 className="text-lg font-semibold">Contracts ({data.contracts?.length || 0})</h2>
            </div>
            {data.contracts?.length > 0 ? (
              <ul className="space-y-3">
                {data.contracts.map((c: any) => (
                  <li key={c.name}>
                    <Link href={`/contracts`} className="flex flex-col group">
                      <span className="font-medium group-hover:text-green-400 transition-colors">{c.name}</span>
                      <span className="text-xs text-muted-foreground">Table: {c.table}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-muted-foreground">No matching contracts.</p>}
          </div>

          {/* TEAMS */}
          <div className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-purple-500" />
              <h2 className="text-lg font-semibold">Teams ({data.teams?.length || 0})</h2>
            </div>
            {data.teams?.length > 0 ? (
              <ul className="space-y-3">
                {data.teams.map((t: any) => (
                  <li key={t.name}>
                    <Link href={`/teams`} className="flex flex-col group">
                      <span className="font-medium group-hover:text-purple-400 transition-colors">{t.name}</span>
                      <span className="text-xs text-muted-foreground truncate">{t.desc}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-muted-foreground">No matching teams.</p>}
          </div>

          {/* RUNBOOKS */}
          <div className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-semibold">Runbooks ({data.runbooks?.length || 0})</h2>
            </div>
            {data.runbooks?.length > 0 ? (
              <ul className="space-y-3">
                {data.runbooks.map((rb: any) => (
                  <li key={rb.name}>
                    <Link href={`/runbooks`} className="flex flex-col group">
                      <span className="font-medium group-hover:text-orange-400 transition-colors">{rb.name}</span>
                      <span className="text-xs text-muted-foreground">Owner: {rb.team}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-muted-foreground">No matching runbooks.</p>}
          </div>

          {/* DAGS */}
          <div className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-center gap-3 mb-4">
              <GitMerge className="w-5 h-5 text-cyan-500" />
              <h2 className="text-lg font-semibold">Airflow DAGs ({data.dags?.length || 0})</h2>
            </div>
            {data.dags?.length > 0 ? (
              <ul className="space-y-3">
                {data.dags.map((dag: any) => (
                  <li key={dag.name}>
                    <Link href={`/airflow/dags/${dag.name}`} className="flex flex-col group">
                      <span className="font-medium group-hover:text-cyan-400 transition-colors">{dag.name}</span>
                      <span className="text-xs text-muted-foreground">Owner: {dag.owner}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-muted-foreground">No matching DAGs.</p>}
          </div>

        </div>
      )}
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-muted-foreground">Loading search...</div>}>
      <SearchResultsContent />
    </React.Suspense>
  );
}
