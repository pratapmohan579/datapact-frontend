"use client";

import { Plus, Play, FastForward, Upload, Settings } from "lucide-react";

export function DiscoveryHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-br from-blue-900 to-indigo-900 p-8 rounded-2xl text-white shadow-xl mb-8 relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
      
      <div className="z-10 max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">AI Metadata Discovery</h1>
        <p className="text-blue-100 text-lg">
          Automatically discover every database, schema, table, relationship and statistic inside your data platform.
        </p>
      </div>
      
      <div className="z-10 flex flex-wrap gap-3">
        <button className="flex items-center gap-2 bg-white text-blue-900 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors shadow-sm">
          <Plus size={18} /> New Source
        </button>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
          <Play size={18} /> Run Scan
        </button>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
          <FastForward size={18} /> Incremental Scan
        </button>
        <button className="flex items-center gap-2 border border-blue-400 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
          <Upload size={18} /> Publish
        </button>
        <button className="flex items-center gap-2 border border-blue-400 hover:bg-blue-800 text-white px-3 py-2 rounded-lg transition-colors shadow-sm">
          <Settings size={18} />
        </button>
      </div>
    </div>
  );
}
