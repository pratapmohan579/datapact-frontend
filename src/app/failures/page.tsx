"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Search, AlertOctagon, ArrowRight, ShieldAlert, XOctagon } from 'lucide-react';

export default function FailuresPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: failures, isLoading, error } = useQuery({
    queryKey: ['airflow-failures'],
    queryFn: async () => {
      const res = await fetch("/api/v1/airflow/failures");
      if (!res.ok) throw new Error("Failed to load failures");
      return res.json();
    }
  });

  const filteredFailures = failures?.filter((f: any) => 
    f.dag_id?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.task_id?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto text-foreground">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center">
            <AlertOctagon className="mr-3 text-red-500" size={28} /> Failure Investigation Center
          </h1>
          <p className="text-muted-foreground">Triage and root-cause pipeline and data quality failures.</p>
        </div>
      </div>

      <div className="mb-6 relative w-full md:w-1/2">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <input 
          type="text" 
          placeholder="Search failures by DAG or task..." 
          className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-red-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground animate-pulse">Loading Failures...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">Failed to load failures.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-secondary/50 text-muted-foreground text-sm uppercase">
              <tr>
                <th className="px-6 py-4 font-semibold">Time</th>
                <th className="px-6 py-4 font-semibold">DAG</th>
                <th className="px-6 py-4 font-semibold">Task</th>
                <th className="px-6 py-4 font-semibold">Error Context</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredFailures.map((failure: any) => (
                <tr key={failure.failure_id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-5 font-mono text-muted-foreground text-sm">
                    {new Date(failure.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-5 font-mono font-bold text-blue-500">
                    <Link href={`/airflow/dags/${failure.dag_id}`}>{failure.dag_id}</Link>
                  </td>
                  <td className="px-6 py-5 font-medium">{failure.task_id}</td>
                  <td className="px-6 py-5">
                    <span className="text-xs text-red-500 bg-red-500/10 px-2 py-1 rounded font-mono truncate max-w-xs block">
                      {failure.error_message || "Unknown Error"}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link href={`/failures/${failure.failure_id}`} className="inline-flex items-center text-sm font-medium text-red-500 hover:text-red-600">
                      Investigate <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredFailures.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No pipeline failures detected. All clear!</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
