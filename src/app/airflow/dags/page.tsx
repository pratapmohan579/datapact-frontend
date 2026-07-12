"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Search, Server, ArrowRight } from 'lucide-react';

export default function DAGExplorer() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: dags, isLoading, error } = useQuery({
    queryKey: ['airflow-dags'],
    queryFn: async () => {
      const res = await fetch("/api/v1/airflow/dags");
      if (!res.ok) throw new Error("Failed to fetch DAGs");
      return res.json();
    }
  });

  const filteredDags = dags?.filter((d: any) => 
    d.dag_id.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto text-foreground">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center">
            <Server className="mr-3 text-cyan-500" size={28} /> DAG Explorer
          </h1>
          <p className="text-muted-foreground">Browse all synchronized Airflow DAGs.</p>
        </div>
      </div>

      <div className="mb-6 relative w-full md:w-1/2">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <input 
          type="text" 
          placeholder="Search DAGs..." 
          className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground animate-pulse">Loading DAGs...</div>
        ) : error ? (
           <div className="p-8 text-center text-red-500">Failed to load DAGs.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-secondary/50 text-muted-foreground text-sm uppercase">
              <tr>
                <th className="px-6 py-4 font-semibold">DAG</th>
                <th className="px-6 py-4 font-semibold">Schedule</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredDags.map((dag: any) => (
                <tr key={dag.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-5 font-mono font-bold text-lg">{dag.dag_id}</td>
                  <td className="px-6 py-5 text-muted-foreground">{dag.schedule || 'Manual'}</td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-1 inline-flex items-center rounded text-xs font-bold uppercase ${
                      dag.status === 'active' || dag.status === 'Healthy' ? 'bg-green-500/10 text-green-500' : 
                      dag.status === 'Warning' ? 'bg-yellow-500/10 text-yellow-500' : 
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {dag.status === 'active' ? 'Healthy' : dag.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link href={`/airflow/dags/${dag.dag_id}`} className="inline-flex items-center text-sm font-medium text-cyan-500 hover:text-cyan-600">
                      View Runs <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredDags.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No DAGs found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
