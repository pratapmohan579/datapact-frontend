"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface CoverageStats {
  total_models: number;
  protected_models: number;
  unprotected_models: number;
  coverage_percentage: number;
  total_tests: number;
  average_health_score: number;
}

export default function DbtExecutiveDashboard() {
  const [stats, setStats] = useState<CoverageStats | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/v1/dbt/coverage", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setIsSyncing(true);
    try {
      const token = localStorage.getItem("token");
      
      // 1. Create a mock project first
      const projectRes = await fetch("/api/v1/dbt/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: `project_${Date.now()}` })
      });
      
      if (!projectRes.ok) throw new Error("Failed to create project");
      const project = await projectRes.json();
      
      // 2. Upload manifest
      const formData = new FormData();
      formData.append("file", file);
      
      const syncRes = await fetch(`/api/v1/dbt/projects/${project.id}/sync`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });
      
      if (!syncRes.ok) throw new Error("Failed to sync project");
      
      await fetchStats();
      alert("Project synced successfully!");
    } catch (err) {
      console.error(err);
      alert("Error syncing project. Make sure you upload a valid manifest.json.");
    } finally {
      setIsSyncing(false);
      // reset file input
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-foreground">dbt Executive Dashboard</h2>
          <p className="text-muted-foreground">Holistic view of your data transformations and reliability coverage.</p>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/dbt/catalog" className="px-4 py-2 bg-muted hover:bg-border text-foreground rounded-lg border border-border transition-all font-medium text-sm">
            View Asset Catalog
          </Link>
          <div className="relative">
            <input 
              type="file" 
              accept=".json" 
              onChange={handleFileUpload} 
              disabled={isSyncing}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              title="Upload manifest.json"
            />
            <button 
              disabled={isSyncing}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg disabled:opacity-50 pointer-events-none"
            >
              {isSyncing ? "Syncing..." : "Upload manifest.json"}
            </button>
          </div>
        </div>
      </div>

      {!stats ? (
        <div className="text-muted-foreground">Loading metrics...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 border border-border relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-12 h-12 text-blue-500 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>
            </div>
            <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-1">Contract Coverage</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-foreground">{stats.coverage_percentage}%</span>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <span className="text-green-600 dark:text-green-400 font-medium">{stats.protected_models}</span> protected / <span className="text-red-500 dark:text-red-400 font-medium">{stats.unprotected_models}</span> unprotected
            </div>
          </div>

          <div className="glass-card p-6 border border-border relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <svg className="w-12 h-12 text-purple-500 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-1">Total dbt Tests</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-foreground">{stats.total_tests}</span>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              Active test assertions found in manifest
            </div>
          </div>

          <div className="glass-card p-6 border border-border relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <svg className="w-12 h-12 text-orange-500 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-1">Total Assets</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-foreground">{stats.total_models}</span>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              Models & Sources discovered
            </div>
          </div>

          <div className="glass-card p-6 border border-border relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <svg className="w-12 h-12 text-emerald-500 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </div>
            <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-1">Avg Health Score</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-foreground">{stats.average_health_score}/100</span>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              Aggregated across all data assets
            </div>
          </div>
        </div>
      )}

      {/* Suggestion Section */}
      <div className="glass-card border border-border p-8 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10">
        <h3 className="text-xl font-bold text-foreground mb-2">Ready to secure your pipeline?</h3>
        <p className="text-muted-foreground mb-6 max-w-2xl">
          DataPact has analyzed your dbt tests and data types. We found several critical models missing basic data quality contracts. Use our AI Auto-Suggester to bulk-generate contracts.
        </p>
        <Link href="/dbt/catalog" className="inline-flex items-center gap-2 bg-foreground text-background font-bold py-2 px-6 rounded-lg hover:opacity-90 transition">
          View Assets to Generate Contracts
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </Link>
      </div>
    </div>
  );
}
