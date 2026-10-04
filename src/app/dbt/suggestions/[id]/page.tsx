"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ContractSuggester() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem("token");
    fetch(`/api/v1/dbt/suggestions/${params?.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(json => {
        if (isMounted && json) setData(json);
      })
      .catch(console.error)
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [params?.id]);

  const handleDeploy = async () => {
    setDeploying(true);
    try {
      const token = localStorage.getItem("token");
      await fetch("/api/v1/dbt/contracts/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ model_id: parseInt(params.id as string, 10) })
      });
      
      router.push("/contracts");
    } catch (err) {
      console.error(err);
    } finally {
      setDeploying(false);
    }
  };

  if (loading) return <div className="p-12 text-foreground">Loading suggestions...</div>;
  if (!data) return <div className="p-12 text-foreground">Asset not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-extrabold text-foreground flex items-center gap-3">
          <Link href="/dbt/catalog" className="text-muted-foreground hover:text-foreground transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </Link>
          Auto-Suggest Contracts
        </h2>
        <p className="text-muted-foreground mt-2">
          Generating missing rules for model: <span className="text-blue-500 dark:text-blue-400 font-mono">{data.asset.name}</span>
        </p>
      </div>

      <div className="space-y-4">
        {data.suggestions.map((sug: any, idx: number) => (
          <div key={idx} className="glass-card p-6 border border-border rounded-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-3 opacity-10">
               <svg className="w-16 h-16 text-blue-500 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A12.014 12.014 0 0010 1a12.014 12.014 0 00-1.3.046C4.847 1.58 2 5.097 2 9.1v4.1a1 1 0 00.293.707l2.5 2.5a1 1 0 001.414-1.414L4 12.793V9.1c0-3.043 2.124-5.698 5-6.666 2.876.968 5 3.623 5 6.666v3.693l-2.207 2.207a1 1 0 101.414 1.414l2.5-2.5A1 1 0 0018 13.2v-4.1c0-4.004-2.847-7.52-6.7-8.054z" clipRule="evenodd" /></svg>
             </div>
             
             <div className="flex justify-between items-start">
               <div>
                 <h4 className="text-lg font-bold text-foreground uppercase tracking-wider">{sug.type.replace(/_/g, ' ')}</h4>
                 <p className="text-sm text-muted-foreground mt-1 max-w-lg">{sug.reason}</p>
                 
                 <div className="mt-4 flex gap-4">
                   {sug.column && (
                     <div className="bg-muted px-3 py-1.5 rounded border border-border">
                       <span className="text-xs text-muted-foreground uppercase mr-2">Column</span>
                       <span className="text-sm font-mono text-foreground">{sug.column}</span>
                     </div>
                   )}
                   {sug.freshness_minutes && (
                     <div className="bg-muted px-3 py-1.5 rounded border border-border">
                       <span className="text-xs text-muted-foreground uppercase mr-2">Max Delay</span>
                       <span className="text-sm font-mono text-foreground">{sug.freshness_minutes}m</span>
                     </div>
                   )}
                   {sug.threshold && (
                     <div className="bg-muted px-3 py-1.5 rounded border border-border">
                       <span className="text-xs text-muted-foreground uppercase mr-2">Drop Threshold</span>
                       <span className="text-sm font-mono text-foreground">{sug.threshold}</span>
                     </div>
                   )}
                 </div>
               </div>
               
               <div className="text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20">
                 Recommended
               </div>
             </div>
          </div>
        ))}
      </div>
      
      <div className="pt-4 border-t border-border flex justify-end gap-4">
        <Link href="/dbt/catalog" className="px-6 py-3 rounded-lg text-foreground hover:bg-muted transition">
          Cancel
        </Link>
        <button 
          onClick={handleDeploy}
          disabled={deploying}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg transition shadow-lg disabled:opacity-50"
        >
          {deploying ? "Deploying..." : "Accept & Deploy All"}
        </button>
      </div>
    </div>
  );
}
