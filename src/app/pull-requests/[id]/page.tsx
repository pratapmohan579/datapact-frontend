"use client"

import React, { use } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, GitPullRequest, AlertOctagon, FileCode, SearchX, Server, CheckCircle, XOctagon } from 'lucide-react';

export default function PRDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
  const { data: pr, isLoading, error } = useQuery({
    queryKey: ['github-pr', resolvedParams.id],
    queryFn: async () => {
      const res = await fetch(`/api/v1/github/pr/${resolvedParams.id}`);
      if (!res.ok) throw new Error("Failed to load PR details");
      return res.json();
    }
  });

  const { data: listPrs } = useQuery({
    queryKey: ['github-prs'],
    queryFn: async () => {
      const res = await fetch("/api/v1/github/prs");
      return res.json();
    }
  });

  if (isLoading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading PR Analysis...</div>;
  if (error || !pr) return <div className="p-8 text-center text-red-500">Failed to load PR details.</div>;

  const originalPr = listPrs?.find((p: any) => p.id === parseInt(resolvedParams.id));

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto text-foreground">
      <div className="mb-8">
        <Link href="/pull-requests" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Pull Requests
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center">
              <GitPullRequest size={28} className="mr-3 text-purple-500" /> PR #{originalPr?.pr_number || pr.pr_id} Analysis
            </h1>
            <div className="flex items-center space-x-6 mt-2 text-sm">
              <span className="flex items-center"><span className="text-muted-foreground w-20">Repository:</span> <span className="font-mono bg-secondary px-2 rounded">repo_{originalPr?.repository_id || 'unknown'}</span></span>
              <span className="flex items-center"><span className="text-muted-foreground w-16">Author:</span> <span className="font-semibold">{originalPr?.author || 'Unknown'}</span></span>
              <span className="flex items-center"><span className="text-muted-foreground w-16">Status:</span> <span className="text-blue-500 font-bold bg-blue-500/10 px-2 py-0.5 rounded-full">Open</span></span>
            </div>
          </div>
          <div className="flex space-x-3">
             <button className={`${pr.risk_level === 'CRITICAL' || pr.risk_level === 'HIGH' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center shadow-sm`}>
              {pr.risk_level === 'CRITICAL' || pr.risk_level === 'HIGH' ? <XOctagon size={16} className="mr-2" /> : <CheckCircle size={16} className="mr-2" />} 
              {pr.risk_level === 'CRITICAL' || pr.risk_level === 'HIGH' ? 'Block Merge' : 'Approve Merge'}
            </button>
            <button className="border border-border hover:bg-secondary text-foreground px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center">
              View on GitHub
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Changed Files & Detections */}
          <div className="grid grid-cols-2 gap-6">
             <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
              <h2 className="font-bold mb-4 flex items-center border-b border-border pb-2">
                <FileCode size={18} className="mr-2 text-blue-500" /> Changed Files
              </h2>
              <ul className="space-y-2 font-mono text-sm">
                {pr.changes?.map((c: any, idx: number) => (
                  <li key={idx} className="p-2 bg-secondary/50 rounded flex items-center">
                    <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span> {c.file_name}
                  </li>
                ))}
                {(!pr.changes || pr.changes.length === 0) && <li className="text-muted-foreground italic">No changes detected.</li>}
              </ul>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
              <h2 className="font-bold mb-4 flex items-center border-b border-border pb-2">
                <SearchX size={18} className="mr-2 text-orange-500" /> Detected Changes
              </h2>
              <ul className="space-y-3">
                {pr.changes?.map((c: any, idx: number) => (
                   <li key={idx} className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                    <span className="text-xs font-bold uppercase text-red-500 block mb-1">{c.change_type}</span>
                    <span className="font-mono text-sm text-foreground">{c.change_summary}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Affected Assets */}
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
            <h2 className="font-bold mb-4 flex items-center border-b border-border pb-2">
              <Server size={18} className="mr-2" /> Affected Downstream Assets
            </h2>
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary text-muted-foreground uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Asset</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3 rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pr.affected_assets?.map((a: any, idx: number) => (
                  <tr key={idx} className="hover:bg-secondary/30">
                    <td className="px-4 py-3 font-mono text-blue-500"><Link href={`/assets/${a.asset}`}>{a.asset}</Link></td>
                    <td className="px-4 py-3"><span className="bg-secondary px-2 py-1 rounded">{a.type || 'Dashboard'}</span></td>
                    <td className="px-4 py-3 font-medium">
                      <Link href={`/assets/${a.asset}`} className="text-blue-500 hover:underline">View Asset</Link>
                    </td>
                  </tr>
                ))}
                {(!pr.affected_assets || pr.affected_assets.length === 0) && (
                   <tr><td colSpan={3} className="px-4 py-4 text-center text-muted-foreground italic">No downstream assets affected.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          {/* Risk Card */}
          <div className={`p-6 rounded-xl border-2 shadow-sm text-center ${
            pr.risk_level === 'CRITICAL' ? 'border-red-500/50 bg-red-500/5' :
            pr.risk_level === 'HIGH' ? 'border-orange-500/50 bg-orange-500/5' :
            pr.risk_level === 'MEDIUM' ? 'border-yellow-500/50 bg-yellow-500/5' :
            'border-green-500/50 bg-green-500/5'
          }`}>
            <AlertOctagon size={48} className={`mx-auto mb-4 ${
              pr.risk_level === 'CRITICAL' ? 'text-red-500' :
              pr.risk_level === 'HIGH' ? 'text-orange-500' :
              pr.risk_level === 'MEDIUM' ? 'text-yellow-500' :
              'text-green-500'
            }`} />
            <h2 className={`text-2xl font-black mb-1 ${
              pr.risk_level === 'CRITICAL' ? 'text-red-500' :
              pr.risk_level === 'HIGH' ? 'text-orange-500' :
              pr.risk_level === 'MEDIUM' ? 'text-yellow-500' :
              'text-green-500'
            }`}>{pr.risk_level || 'UNKNOWN'} RISK</h2>
            <p className="text-sm text-foreground mb-6 font-medium tracking-wide">DataPact Recommendation</p>
            <div className={`${
              pr.risk_level === 'CRITICAL' || pr.risk_level === 'HIGH' ? 'bg-red-500' :
              pr.risk_level === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'
            } text-white font-bold py-3 px-4 rounded-lg uppercase tracking-widest text-sm shadow-sm`}>
              {pr.risk_level === 'CRITICAL' || pr.risk_level === 'HIGH' ? 'Do Not Merge' : 'Safe to Merge'}
            </div>
            <p className="text-xs text-muted-foreground mt-4">{pr.recommendation}</p>
          </div>

          {/* Impact Summary */}
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
            <h2 className="font-bold mb-4 border-b border-border pb-2">Impact Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Affected Assets</span>
                <span className="text-xl font-bold">{pr.affected_assets?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Changed Files</span>
                <span className="text-xl font-bold">{pr.changes?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-border">
                <span className="text-muted-foreground font-semibold">Risk Score</span>
                <span className={`text-xl font-bold ${pr.risk_score > 70 ? 'text-red-500' : 'text-green-500'}`}>{pr.risk_score} / 100</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
