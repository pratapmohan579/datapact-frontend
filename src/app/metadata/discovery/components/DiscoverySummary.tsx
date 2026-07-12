"use client";

import { Database, LayoutTemplate, Box, Columns, Link2, Clock } from "lucide-react";

const SUMMARY_DATA = [
  { label: "Connected Sources", value: "12", trend: "↑2", icon: Database, color: "text-blue-500", bg: "bg-blue-50" },
  { label: "Schemas", value: "48", trend: null, icon: LayoutTemplate, color: "text-indigo-500", bg: "bg-indigo-50" },
  { label: "Assets", value: "1,284", trend: null, icon: Box, color: "text-purple-500", bg: "bg-purple-50" },
  { label: "Columns", value: "19,381", trend: null, icon: Columns, color: "text-pink-500", bg: "bg-pink-50" },
  { label: "Relationships", value: "2,841", trend: null, icon: Link2, color: "text-rose-500", bg: "bg-rose-50" },
  { label: "Last Scan", value: "2 min ago", trend: "Live", icon: Clock, color: "text-green-500", bg: "bg-green-50" },
];

export function DiscoverySummary() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {SUMMARY_DATA.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div key={idx} className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${item.bg} ${item.color} group-hover:scale-110 transition-transform duration-300`}>
              <Icon size={24} />
            </div>
            <h3 className="text-3xl font-bold text-foreground tracking-tight">{item.value}</h3>
            <p className="text-sm font-medium text-muted-foreground mt-1">{item.label}</p>
            {item.trend && (
              <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full ${item.trend === 'Live' ? 'bg-green-100 text-green-700 animate-pulse' : 'bg-blue-100 text-blue-700'}`}>
                {item.trend}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
