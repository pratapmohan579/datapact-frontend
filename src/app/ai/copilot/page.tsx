"use client";

import React, { useState } from 'react';
import { 
  Bot, Search, FileText, Database, Shield, AlertTriangle, Play, BookOpen, Clock
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Mock Knowledge Base
const knowledgeBase = [
  { id: 1, type: "Contract", title: "analytics.fct_sales", desc: "Strict SLA rules applied. 24h freshness, 0 nulls.", updated: "2 hours ago" },
  { id: 2, type: "Incident", title: "Data Delay: #432", desc: "Resolved via AI auto-healing (Airflow DAG restart).", updated: "1 day ago" },
  { id: 3, type: "Runbook", title: "OOM Recovery", desc: "Standard operating procedure for Spark OOM failures.", updated: "5 days ago" },
  { id: 4, type: "Asset", title: "stg_payments", desc: "Core table owned by Finance team.", updated: "1 week ago" },
];

export default function AICopilotWorkspace() {
  const [query, setQuery] = useState("");

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      
      {/* Header */}
      <div className="flex-shrink-0">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <Bot className="w-8 h-8 text-blue-400" />
          AI Workspace & Knowledge Center
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Search the vectorized Knowledge Index, explore past investigations, and run deep-dive analysis.
        </p>
      </div>

      <div className="flex-1 flex gap-8 min-h-0">
        
        {/* Left Column - Main Workspace (Search & Chat) */}
        <div className="w-2/3 flex flex-col gap-6">
          
          {/* Omni Search Bar */}
          <div className="glass p-6 rounded-xl border border-border">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Ask a question or search for assets, incidents, and contracts..."
                className="w-full bg-secondary/50 border border-border rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-blue-500/50 transition-colors text-lg shadow-inner"
              />
            </div>
            
            <div className="flex gap-3 mt-4 overflow-x-auto custom-scrollbar pb-2">
              <span className="text-sm text-muted-foreground self-center mr-2">Try:</span>
              <PromptChip text="Show stale datasets" icon={<Clock className="w-4 h-4" />} />
              <PromptChip text="Explain Incident #432" icon={<AlertTriangle className="w-4 h-4" />} />
              <PromptChip text="Generate contract for fct_sales" icon={<Shield className="w-4 h-4" />} />
              <PromptChip text="Compare raw_users vs dim_users" icon={<Database className="w-4 h-4" />} />
            </div>
          </div>

          {/* Expanded Chat / Investigation Area */}
          <div className="glass flex-1 rounded-xl border border-border flex flex-col overflow-hidden">
            <div className="p-4 border-b border-border bg-black/20 flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-400" />
              <h2 className="font-semibold text-white">Deep-Dive Analysis</h2>
            </div>
            
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4 text-muted-foreground">
              <div className="bg-secondary p-4 rounded-full">
                <Play className="w-8 h-8 text-blue-400 opacity-50" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">No Active Investigation</h3>
                <p className="max-w-md mx-auto">
                  Use the search bar above or click a suggested prompt to begin a deep-dive analysis. The AI will retrieve relevant context automatically.
                </p>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column - Knowledge Base & History */}
        <div className="w-1/3 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
          
          {/* Knowledge Index */}
          <div className="glass p-6 rounded-xl border border-border">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              Indexed Knowledge
            </h3>
            
            <div className="space-y-3">
              {knowledgeBase.map(item => (
                <div key={item.id} className="p-3 rounded-lg bg-secondary/30 hover:bg-secondary/80 transition-colors border border-border cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">{item.type}</span>
                    <span className="text-[10px] text-muted-foreground">{item.updated}</span>
                  </div>
                  <h4 className="text-white font-medium text-sm">{item.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

function PromptChip({ text, icon }: { text: string, icon: React.ReactNode }) {
  return (
    <button className="flex-shrink-0 flex items-center gap-2 text-sm px-4 py-2 bg-secondary hover:bg-muted border border-border rounded-lg text-muted-foreground hover:text-white transition-colors whitespace-nowrap">
      {icon}
      {text}
    </button>
  );
}
