"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/apiClient";

export default function DbtCatalog() {
  const router = useRouter();

  const { data: models = [], isLoading: loadingModels, isError: isModelsError } = useQuery({
    queryKey: ["dbt_models"],
    queryFn: () => api.get<any[]>("/dbt/models"),
  });

  const { data: sources = [], isLoading: loadingSources, isError: isSourcesError } = useQuery({
    queryKey: ["dbt_sources"],
    queryFn: () => api.get<any[]>("/dbt/sources"),
  });

  if (isModelsError || isSourcesError) {
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      router.push("/auth/login");
    }
  }

  const loading = loadingModels || loadingSources;
  
  const assets = [
    ...models.map((m: any) => ({ ...m, resource_type: "model" })),
    ...sources.map((s: any) => ({ ...s, resource_type: "source" }))
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-foreground flex items-center gap-3">
            <Link href="/dbt" className="text-muted-foreground hover:text-foreground transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </Link>
            Asset Catalog
          </h2>
          <p className="text-muted-foreground mt-1">Discovered models, sources, and snapshots from your dbt project.</p>
        </div>
      </div>

      <div className="glass-card border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Scanning dbt metadata...</div>
        ) : assets.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No assets found. Go back and click &quot;Sync Mock dbt Project&quot;.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Asset Name</th>
                <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Owner</th>
                <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Health Score</th>
                <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contract</th>
                <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="p-4">
                    <div className="font-medium text-foreground flex items-center gap-2">
                      {asset.name}
                      {asset.tests && asset.tests.length === 0 && !asset.has_contract && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-500 dark:text-red-400 border border-red-500/30">
                          HIGH RISK
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{asset.database}.{asset.schema_name}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20">
                      {asset.resource_type}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{asset.owner || "Data Team"}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-muted rounded-full h-2 max-w-[100px]">
                        <div 
                          className={`h-2 rounded-full ${asset.health_score > 80 ? 'bg-green-500' : asset.health_score > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                          style={{ width: `${asset.health_score || 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground">{asset.health_score || 100}/100</span>
                    </div>
                  </td>
                  <td className="p-4">
                    {asset.has_contract ? (
                       <span className="inline-flex items-center gap-1 text-xs text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                         <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                         Protected
                       </span>
                    ) : (
                       <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded border border-border">
                         Unprotected
                       </span>
                    )}
                  </td>
                  <td className="p-4">
                    {!asset.has_contract && asset.resource_type === 'model' ? (
                      <Link 
                        href={`/dbt/suggestions/${asset.id}`} 
                        className="text-xs font-bold text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
                      >
                        Suggest Contract &rarr;
                      </Link>
                    ) : (
                      <span className="text-xs text-muted-foreground">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
