"use client";

import { useEffect, useState } from "react";
import { useAIStudioStore } from "@/store/ai-studio-store";
import { api } from "@/lib/apiClient";
import { Loader2, Database, ShieldCheck, Activity, Users, FileDigit } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AssetOverview() {
  const { selectedAssetId } = useAIStudioStore();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!selectedAssetId) return;
    
    async function fetchDetails() {
      setIsLoading(true);
      try {
        const res = await api.get(`/ai/contracts/${selectedAssetId}`);
        setData(res);
      } catch (err) {
        console.error("Failed to load asset details", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDetails();
  }, [selectedAssetId]);

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-ai" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
      {/* Header Info */}
      <div className="p-6 border-b border-border flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-ai/10 text-ai text-xs font-semibold tracking-wide uppercase">Table</span>
            <span className="text-muted-foreground text-sm">snowflake.analytics.{data.name}</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Database className="w-6 h-6 text-ai" />
            {data.name}
          </h1>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-background rounded-lg p-3 border border-border flex flex-col items-center min-w-[100px]">
            <ShieldCheck className="w-5 h-5 text-emerald-500 mb-1" />
            <span className="text-xs text-muted-foreground">Health</span>
            <span className="font-bold text-lg">{data.metadata.health_score}</span>
          </div>
          <div className="bg-background rounded-lg p-3 border border-border flex flex-col items-center min-w-[100px]">
            <Activity className="w-5 h-5 text-ai mb-1" />
            <span className="text-xs text-muted-foreground">AI Ready</span>
            <span className="font-bold text-lg">{data.metadata.ai_readiness}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
        {/* Basic Stats */}
        <div className="p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Metadata</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Users className="w-4 h-4" /> Owner
              </div>
              <span className="font-medium text-sm">{data.metadata.owner}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <FileDigit className="w-4 h-4" /> Volume
              </div>
              <span className="font-medium text-sm">{data.metadata.rows} Rows</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Activity className="w-4 h-4" /> Freshness
              </div>
              <span className="font-medium text-sm">{data.metadata.freshness}</span>
            </div>
          </div>
        </div>

        {/* Schema Summary */}
        <div className="p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Schema Structure</h3>
          <div className="space-y-2">
            {data.schema.slice(0, 4).map((col: any) => (
              <div key={col.name} className="flex items-center justify-between py-1 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{col.name}</span>
                  {col.is_primary && <span className="px-1.5 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">PK</span>}
                </div>
                <span className="text-xs text-muted-foreground font-mono">{col.type}</span>
              </div>
            ))}
            {data.schema.length > 4 && (
              <div className="text-xs text-center text-muted-foreground pt-2">+{data.schema.length - 4} more columns</div>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="p-6 flex flex-col">
          <h3 className="text-sm font-semibold text-foreground mb-2">Historical Volume Trend</h3>
          <div className="flex-1 min-h-[120px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.profile.historical_trends} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="date" hide />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="volume" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
