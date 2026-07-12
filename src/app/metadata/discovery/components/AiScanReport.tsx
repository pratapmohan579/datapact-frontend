"use client";

import { FileDown, CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";

export function AiScanReport() {
  return (
    <div className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border border-border rounded-xl shadow-lg mb-8 overflow-hidden">
      <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-serif mb-1">AI Discovery Report</h2>
          <p className="text-slate-400 text-sm">Generated on {new Date().toLocaleDateString()}</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded text-sm transition-colors">
            <FileDown size={16} /> PDF
          </button>
          <button className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded text-sm transition-colors">
            <FileDown size={16} /> CSV
          </button>
        </div>
      </div>
      
      <div className="p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 pb-8 border-b border-border">
          <div><p className="text-muted-foreground text-sm mb-1">Sources</p><p className="text-2xl font-bold">4</p></div>
          <div><p className="text-muted-foreground text-sm mb-1">Schemas</p><p className="text-2xl font-bold">62</p></div>
          <div><p className="text-muted-foreground text-sm mb-1">Tables</p><p className="text-2xl font-bold">418</p></div>
          <div><p className="text-muted-foreground text-sm mb-1">Columns</p><p className="text-2xl font-bold">8,412</p></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-amber-600 dark:text-amber-400">
              <AlertTriangle size={20} /> Action Required
            </h3>
            <ul className="space-y-3">
              <li className="flex justify-between border-b border-border pb-2"><span className="text-muted-foreground">High Risk Assets</span><span className="font-bold text-red-500">14</span></li>
              <li className="flex justify-between border-b border-border pb-2"><span className="text-muted-foreground">Owners Missing</span><span className="font-bold text-amber-500">84</span></li>
              <li className="flex justify-between border-b border-border pb-2"><span className="text-muted-foreground">Contracts Missing</span><span className="font-bold text-amber-500">291</span></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-blue-600 dark:text-blue-400">
              <Lightbulb size={20} /> AI Recommendations
            </h3>
            <ul className="space-y-3">
              <li className="flex justify-between border-b border-border pb-2"><span className="text-muted-foreground">Suggested Contracts</span><span className="font-bold text-blue-500">388</span></li>
              <li className="flex justify-between border-b border-border pb-2"><span className="text-muted-foreground">Suggested Owners</span><span className="font-bold text-blue-500">61</span></li>
              <li className="flex justify-between border-b border-border pb-2"><span className="text-muted-foreground">New Relationships Found</span><span className="font-bold text-green-500">1,262</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
