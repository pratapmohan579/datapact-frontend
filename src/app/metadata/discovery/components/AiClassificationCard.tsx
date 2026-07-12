"use client";

import { Sparkles, Key, Link2, ShieldAlert, BadgeDollarSign, Clock, Check } from "lucide-react";

export function AiClassificationCard() {
  return (
    <div className="flex flex-col gap-6">
      {/* Classification Card */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Sparkles size={64} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2">
              <Sparkles size={16} className="text-yellow-400" /> AI Classification
            </h3>
            <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded">98% Confidence</span>
          </div>
          
          <div className="mb-6">
            <span className="block text-white/70 text-sm mb-1">Detected Entity Type</span>
            <span className="text-2xl font-bold">Business Table</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm border-b border-white/20 pb-2">
              <span className="flex items-center gap-2"><Key size={14} className="text-yellow-400"/> Primary Key</span>
              <span className="font-medium bg-white/10 px-2 py-0.5 rounded">order_id</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-white/20 pb-2">
              <span className="flex items-center gap-2"><Link2 size={14} className="text-blue-300"/> Foreign Keys</span>
              <span className="font-medium bg-white/10 px-2 py-0.5 rounded">customer_id</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-white/20 pb-2">
              <span className="flex items-center gap-2"><ShieldAlert size={14} className="text-red-400"/> PII Data</span>
              <span className="font-medium bg-white/10 px-2 py-0.5 rounded">email</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-white/20 pb-2">
              <span className="flex items-center gap-2"><BadgeDollarSign size={14} className="text-green-400"/> Financial</span>
              <span className="font-medium bg-white/10 px-2 py-0.5 rounded">price</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2"><Clock size={14} className="text-purple-300"/> Timestamp</span>
              <span className="font-medium bg-white/10 px-2 py-0.5 rounded">created_at</span>
            </div>
          </div>
          
          <button className="w-full mt-6 bg-white text-indigo-900 font-bold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors">
            <Check size={16} /> Approve Classifications
          </button>
        </div>
      </div>

      {/* Suggested Improvements Card */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <h3 className="font-bold flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-purple-500" /> AI Suggestions
        </h3>
        
        <div className="space-y-4 mb-6">
          <p className="text-sm font-medium text-foreground">Orders table has:</p>
          <ul className="text-sm text-red-500 space-y-2 font-medium">
            <li className="flex items-center gap-2">• No Owner Assigned</li>
            <li className="flex items-center gap-2">• No Data Contract</li>
            <li className="flex items-center gap-2">• No Description</li>
            <li className="flex items-center gap-2">• Missing Freshness SLA</li>
          </ul>
        </div>
        
        <div className="space-y-2">
          <button className="w-full text-left px-3 py-2 text-sm bg-secondary hover:bg-muted text-foreground font-medium rounded-lg transition-colors">Generate Contract</button>
          <button className="w-full text-left px-3 py-2 text-sm bg-secondary hover:bg-muted text-foreground font-medium rounded-lg transition-colors">Assign Owner</button>
          <button className="w-full text-left px-3 py-2 text-sm bg-secondary hover:bg-muted text-foreground font-medium rounded-lg transition-colors">Generate Description</button>
          <button className="w-full text-left px-3 py-2 text-sm bg-secondary hover:bg-muted text-foreground font-medium rounded-lg transition-colors">Create SLA</button>
        </div>
      </div>
    </div>
  );
}
