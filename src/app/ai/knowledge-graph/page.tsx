"use client";

import { useState, useEffect } from "react";
import { Share2, Users, Database, FileText, Search, ZoomIn, ZoomOut, Maximize } from "lucide-react";
// Since we don't have a full NetworkX visualizer installed, we will use a tailored SVG / CSS visualization for the prototype

interface Node {
  id: string;
  label: string;
  type: string;
}
interface Edge {
  source: string;
  target: string;
  type: string;
}

export default function KnowledgeGraphPage() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    // Fetch from backend in a real app, mock for now
    setNodes([
      { id: "user:1", label: "Data Engineer", type: "USER" },
      { id: "table:sales", label: "fct_sales", type: "TABLE" },
      { id: "contract:12", label: "Sales Contract", type: "CONTRACT" },
      { id: "kpi:revenue", label: "Net Revenue", type: "KPI" }
    ]);
    setEdges([
      { source: "user:1", target: "contract:12", type: "OWNS" },
      { source: "contract:12", target: "table:sales", type: "GOVERNS" },
      { source: "table:sales", target: "kpi:revenue", type: "FEEDS" }
    ]);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
            Semantic Knowledge Graph
          </h1>
          <p className="text-muted-foreground mt-2">
            Explore relationships between users, datasets, contracts, and business metrics.
          </p>
        </div>
      </div>

      {/* Graph Visualizer Placeholder */}
      <div className="bg-card border rounded-xl h-[600px] relative overflow-hidden flex items-center justify-center bg-dot-pattern">
        
        {/* Controls */}
        <div className="absolute top-4 right-4 flex gap-2 bg-background/80 backdrop-blur border p-1.5 rounded-lg shadow-sm">
          <button className="p-2 hover:bg-muted rounded"><ZoomIn className="w-4 h-4" /></button>
          <button className="p-2 hover:bg-muted rounded"><ZoomOut className="w-4 h-4" /></button>
          <button className="p-2 hover:bg-muted rounded"><Maximize className="w-4 h-4" /></button>
        </div>
        
        {/* Mock Graph Rendering */}
        <div className="relative w-full h-full p-12">
          {/* Edges */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
             <path d="M 200 300 Q 400 150 600 300" fill="transparent" stroke="currentColor" strokeWidth="2" strokeDasharray="4" className="text-muted-foreground opacity-50" />
             <path d="M 600 300 Q 800 450 1000 300" fill="transparent" stroke="currentColor" strokeWidth="2" strokeDasharray="4" className="text-muted-foreground opacity-50" />
             <path d="M 600 300 L 600 500" fill="transparent" stroke="currentColor" strokeWidth="2" strokeDasharray="4" className="text-muted-foreground opacity-50" />
          </svg>
          
          {/* Nodes */}
          <div className="absolute top-[260px] left-[120px] z-10 flex flex-col items-center group cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <Users className="w-8 h-8" />
            </div>
            <div className="mt-3 bg-background border px-3 py-1 rounded-md shadow-sm font-medium text-sm">Data Engineer</div>
            <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">Owner</div>
          </div>

          <div className="absolute top-[260px] left-[520px] z-10 flex flex-col items-center group cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <FileText className="w-8 h-8" />
            </div>
            <div className="mt-3 bg-background border px-3 py-1 rounded-md shadow-sm font-medium text-sm">Sales Contract</div>
            <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">Governs</div>
          </div>

          <div className="absolute top-[260px] left-[920px] z-10 flex flex-col items-center group cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Database className="w-8 h-8" />
            </div>
            <div className="mt-3 bg-background border px-3 py-1 rounded-md shadow-sm font-medium text-sm">fct_sales</div>
            <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">Feeds</div>
          </div>
          
          <div className="absolute top-[480px] left-[520px] z-10 flex flex-col items-center group cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <Share2 className="w-8 h-8" />
            </div>
            <div className="mt-3 bg-background border px-3 py-1 rounded-md shadow-sm font-medium text-sm">Net Revenue</div>
            <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">KPI</div>
          </div>
        </div>

      </div>
    </div>
  );
}
