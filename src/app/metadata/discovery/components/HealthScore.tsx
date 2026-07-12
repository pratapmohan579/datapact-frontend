"use client";

import { Activity, Star } from "lucide-react";

export function HealthScore() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
      
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
        <Activity size={20} className="text-green-500" />
        Metadata Health Score
      </h3>
      
      <div className="text-6xl font-extrabold text-foreground my-4 tracking-tighter">
        94<span className="text-3xl text-muted-foreground">%</span>
      </div>
      
      <div className="flex gap-1 mb-6 text-yellow-400">
        <Star fill="currentColor" size={24} />
        <Star fill="currentColor" size={24} />
        <Star fill="currentColor" size={24} />
        <Star fill="currentColor" size={24} />
        <Star fill="currentColor" size={24} />
      </div>
      
      <div className="w-full">
        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-3 text-center">Calculated From</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Descriptions</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Ownership</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Contracts</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> PII Tags</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Relationships</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Documentation</div>
        </div>
      </div>
    </div>
  );
}
