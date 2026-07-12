"use client";

import { PlusCircle, Edit3, MinusCircle } from "lucide-react";

export function MetadataChangesTimeline() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-6">Recent Changes</h2>
      
      <div className="relative border-l-2 border-border ml-3 space-y-8">
        <div className="relative pl-6">
          <div className="absolute -left-[9px] bg-green-100 p-0.5 rounded-full ring-4 ring-card">
            <PlusCircle size={14} className="text-green-600" />
          </div>
          <div className="text-sm font-medium text-muted-foreground mb-1">Today, 09:24 AM</div>
          <div className="bg-secondary/50 rounded-lg p-3">
            <span className="font-bold">Table Created: </span>
            <span className="text-indigo-600 font-medium">Postgres.Sales.Orders</span>
          </div>
        </div>
        
        <div className="relative pl-6">
          <div className="absolute -left-[9px] bg-blue-100 p-0.5 rounded-full ring-4 ring-card">
            <Edit3 size={14} className="text-blue-600" />
          </div>
          <div className="text-sm font-medium text-muted-foreground mb-1">Yesterday, 14:32 PM</div>
          <div className="bg-secondary/50 rounded-lg p-3">
            <span className="font-bold">Column Added: </span>
            <span className="text-blue-600 font-medium">customer_phone</span>
            <div className="mt-2 text-xs font-mono bg-background p-2 rounded border border-border overflow-x-auto">
              <div className="text-red-500">- /* no customer_phone */</div>
              <div className="text-green-500">+ customer_phone varchar(20) NULL</div>
            </div>
          </div>
        </div>
        
        <div className="relative pl-6">
          <div className="absolute -left-[9px] bg-red-100 p-0.5 rounded-full ring-4 ring-card">
            <MinusCircle size={14} className="text-red-600" />
          </div>
          <div className="text-sm font-medium text-muted-foreground mb-1">2 days ago, 11:15 AM</div>
          <div className="bg-secondary/50 rounded-lg p-3">
            <span className="font-bold">Schema Dropped: </span>
            <span className="text-red-600 font-medium line-through">analytics_v2_legacy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
