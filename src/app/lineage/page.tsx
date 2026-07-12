"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LineageDashboard() {
  const [syncing, setSyncing] = useState(false);
  const router = useRouter();

  const handleSyncMock = async () => {
    setSyncing(true);
    try {
      const token = localStorage.getItem("token");
      await fetch("/api/v1/lineage/sync_mock", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      router.push("/lineage/graph");
    } catch (err) {
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-foreground mb-2 tracking-tight flex items-center gap-3">
            <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
            Data Lineage Engine
          </h1>
          <p className="text-muted-foreground">Discover, map, and visualize your entire data ecosystem automatically.</p>
        </div>
        <button 
          onClick={handleSyncMock}
          disabled={syncing}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-6 rounded-lg transition flex items-center gap-2 disabled:opacity-50"
        >
          {syncing ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          )}
          {syncing ? "Syncing..." : "Sync Mock Lineage"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 border-l-4 border-l-purple-500">
          <h3 className="text-muted-foreground text-sm font-medium mb-1">Total Assets</h3>
          <p className="text-4xl font-bold text-foreground">9</p>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-green-500">
          <h3 className="text-muted-foreground text-sm font-medium mb-1">Connected Assets</h3>
          <p className="text-4xl font-bold text-green-500 dark:text-green-400">100%</p>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-orange-500">
          <h3 className="text-muted-foreground text-sm font-medium mb-1">Orphan Assets</h3>
          <p className="text-4xl font-bold text-orange-500 dark:text-orange-400">0</p>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-red-500">
          <h3 className="text-muted-foreground text-sm font-medium mb-1">High Risk Assets</h3>
          <p className="text-4xl font-bold text-red-500 dark:text-red-400">2</p>
        </div>
      </div>

      <div className="glass-card p-10 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Visual Lineage Explorer</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Explore the relationships between your Snowflake tables, dbt models, and Tableau dashboards visually. Understand upstream dependencies and downstream impact instantly.
          </p>
        </div>
        <Link href="/lineage/graph" className="bg-muted hover:bg-border text-foreground px-8 py-3 rounded-lg font-medium transition border border-border">
          Open Graph Visualizer
        </Link>
      </div>
    </div>
  );
}
