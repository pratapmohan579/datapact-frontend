'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';
import {
  Database, Shield, Users, AlertCircle, Share2, Search,
  GitPullRequest, RefreshCw, XOctagon, BrainCircuit, Activity
} from 'lucide-react';

export default function Asset360Page() {
  const { id } = useParams();
  const router = useRouter();
  const assetId = decodeURIComponent(id as string);
  const [activeTab, setActiveTab] = useState('Overview');

  const { data, isLoading, error } = useQuery({
    queryKey: ['asset-360', assetId],
    queryFn: async () => {
      return api.get<any>(`/assets/${encodeURIComponent(assetId)}`);
    }
  });

  if (error) {
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      router.push("/auth/login");
    }
  }

  if (isLoading) {
    return <div className="p-8 text-muted-foreground animate-pulse">Loading Asset 360 details...</div>;
  }

  if (error || !data) {
    return <div className="p-8 text-red-500 bg-red-500/10 rounded-lg">Error loading Asset 360.</div>;
  }

  const { asset, ownership, contracts, lineage, incidents, prs } = data;

  const tabs = [
    'Overview', 'Contracts', 'Lineage', 'Ownership', 
    'Impact', 'Incidents', 'PR History', 'Airflow', 'AI Copilot (Beta)'
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{asset.id}</h1>
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${asset.status === 'Healthy' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
              {asset.status}
            </span>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-500 capitalize">
              {asset.type}
            </span>
          </div>
          <p className="text-muted-foreground mt-1">Source: {asset.source_system}</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-card border border-border rounded-lg p-3 text-center min-w-[100px]">
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Health</div>
            <div className={`text-2xl font-bold ${asset.health_score > 90 ? 'text-green-500' : 'text-orange-500'}`}>{asset.health_score}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 text-center min-w-[100px]">
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Risk</div>
            <div className="text-2xl font-bold text-red-500">LOW</div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="border-b border-border">
        <div className="flex gap-6 overflow-x-auto custom-scrollbar pb-px">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap pb-4 text-sm font-medium transition-colors relative ${
                activeTab === tab
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'AI Copilot (Beta)' && <BrainCircuit className="w-4 h-4 inline mr-1 text-purple-500" />}
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT */}
      <div className="py-4">
        
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-border rounded-lg p-5 bg-card">
              <h3 className="font-semibold mb-4 text-muted-foreground uppercase text-xs tracking-wider">Ownership & Runbook</h3>
              <div className="space-y-3">
                <div><span className="text-muted-foreground text-sm">Owner Team:</span> <span className="font-medium">{ownership.team_name || 'Unassigned'}</span></div>
                <div><span className="text-muted-foreground text-sm">Owner Name:</span> <span className="font-medium">{ownership.owner_name || 'N/A'}</span></div>
                <div><span className="text-muted-foreground text-sm">Slack:</span> <span className="font-medium">{ownership.slack_channel || 'N/A'}</span></div>
              </div>
            </div>
            
            <div className="border border-border rounded-lg p-5 bg-card">
              <h3 className="font-semibold mb-4 text-muted-foreground uppercase text-xs tracking-wider">Lineage Reach</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center"><span className="text-muted-foreground text-sm">Upstream Dependencies:</span> <span className="font-medium">{lineage.upstream_count} Nodes</span></div>
                <div className="flex justify-between items-center"><span className="text-muted-foreground text-sm">Downstream Consumers:</span> <span className="font-medium">{lineage.downstream_count} Nodes</span></div>
              </div>
            </div>

            <div className="border border-border rounded-lg p-5 bg-card">
              <h3 className="font-semibold mb-4 text-muted-foreground uppercase text-xs tracking-wider">Active Contracts</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center"><span className="text-muted-foreground text-sm">Monitored Rules:</span> <span className="font-medium">{contracts.length} Active</span></div>
                {contracts.slice(0,2).map((c: any) => (
                  <div key={c.id} className="text-sm bg-muted/50 p-2 rounded text-muted-foreground">{c.name}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Contracts' && (
          <div className="border border-border rounded-lg overflow-hidden bg-card">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-6 py-3 font-semibold uppercase tracking-wider text-xs">Contract Name</th>
                  <th className="px-6 py-3 font-semibold uppercase tracking-wider text-xs">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {contracts.length === 0 ? (
                  <tr><td colSpan={2} className="px-6 py-4 text-muted-foreground text-center">No contracts found.</td></tr>
                ) : contracts.map((c: any) => (
                  <tr key={c.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{c.name}</td>
                    <td className="px-6 py-4"><span className="text-green-500 font-medium">Healthy</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Lineage' && (
          <div className="h-[400px] border border-border rounded-lg bg-card flex flex-col items-center justify-center text-muted-foreground">
            <Share2 className="w-12 h-12 mb-4 opacity-50" />
            <p>Lineage Graph rendering would appear here.</p>
            <p className="text-sm">Upstream: {lineage.upstream_count} | Downstream: {lineage.downstream_count}</p>
          </div>
        )}

        {activeTab === 'Ownership' && (
          <div className="border border-border rounded-lg p-6 bg-card max-w-xl">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{ownership.team_name || 'Unassigned'}</h2>
                  <p className="text-muted-foreground">Primary technical owner</p>
                </div>
             </div>
             <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 border-b border-border pb-4">
                  <div className="text-muted-foreground">Slack Channel</div>
                  <div className="col-span-2 font-medium">{ownership.slack_channel || '-'}</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-muted-foreground">Contact Email</div>
                  <div className="col-span-2 font-medium text-blue-400">data-platform@company.com</div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'Impact' && (
          <div className="border border-border rounded-lg p-6 bg-card text-center text-muted-foreground">
            <Search className="w-12 h-12 mb-4 mx-auto opacity-50" />
            <p>Impact Analysis shows 5 Dashboards and 2 APIs rely on this asset.</p>
          </div>
        )}

        {activeTab === 'Incidents' && (
          <div className="space-y-4">
            {incidents.length === 0 ? (
              <div className="border border-border rounded-lg p-8 bg-card text-center text-muted-foreground">
                <AlertCircle className="w-12 h-12 mb-4 mx-auto opacity-50" />
                <p>No recent incidents or Airflow failures recorded.</p>
              </div>
            ) : incidents.map((inc: any) => (
              <div key={inc.id} className="border border-red-500/30 rounded-lg p-4 bg-red-500/5">
                <div className="flex items-start gap-4">
                  <XOctagon className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-500">Pipeline Failure ({inc.task})</h3>
                    <p className="text-sm text-foreground mt-1">{inc.error}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'PR History' && (
          <div className="border border-border rounded-lg overflow-hidden bg-card">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-6 py-3 font-semibold uppercase tracking-wider text-xs">PR Number</th>
                  <th className="px-6 py-3 font-semibold uppercase tracking-wider text-xs">Author</th>
                  <th className="px-6 py-3 font-semibold uppercase tracking-wider text-xs">Risk</th>
                  <th className="px-6 py-3 font-semibold uppercase tracking-wider text-xs">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {prs.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-4 text-muted-foreground text-center">No GitHub PRs affecting this asset.</td></tr>
                ) : prs.map((pr: any) => (
                  <tr key={pr.pr_number} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium flex items-center gap-2"><GitPullRequest className="w-4 h-4"/> #{pr.pr_number}</td>
                    <td className="px-6 py-4">{pr.author}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${pr.risk_level === 'HIGH' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                        {pr.risk_level}
                      </span>
                    </td>
                    <td className="px-6 py-4 capitalize text-muted-foreground">{pr.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Airflow' && (
          <div className="border border-border rounded-lg p-6 bg-card text-center text-muted-foreground">
            <RefreshCw className="w-12 h-12 mb-4 mx-auto opacity-50" />
            <p>Mapped to DAG: pipeline_123. Last run: Success.</p>
          </div>
        )}

        {activeTab === 'AI Copilot (Beta)' && (
          <div className="border border-purple-500/30 rounded-lg p-6 bg-purple-500/5">
             <div className="flex items-center gap-3 mb-4">
                <BrainCircuit className="w-6 h-6 text-purple-500" />
                <h2 className="text-xl font-bold text-purple-500">DataPact Copilot</h2>
             </div>
             <p className="text-muted-foreground mb-6">
                Copilot has analyzed the ownership, lineage, and failure history of <strong>{asset.id}</strong>.
             </p>
             <div className="bg-background rounded-lg border border-border p-4 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-4 h-4 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">RCA & Recommendations</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      This asset frequently fails due to upstream timeouts in <code className="bg-muted px-1 rounded">pipeline_123</code>. 
                      I recommend increasing the SLA window or adding a retry mechanism to the `run_dbt_models` task. 
                      Contact the <strong>{ownership.team_name}</strong> for approval.
                    </p>
                  </div>
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
