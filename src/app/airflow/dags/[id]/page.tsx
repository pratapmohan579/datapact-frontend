"use client"

import React, { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Server, Clock, User, CheckCircle, XOctagon, TerminalSquare } from 'lucide-react';

export default function DAGDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto text-foreground">
      <div className="mb-8">
        <Link href="/airflow/dags" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to DAGs
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-mono mb-2 flex items-center">
              <Server className="mr-3 text-cyan-500" size={28} /> {resolvedParams.id}
            </h1>
            <div className="flex items-center space-x-6 mt-4">
               <span className="flex items-center text-sm text-muted-foreground"><User size={16} className="mr-2" /> Data Platform</span>
               <span className="flex items-center text-sm text-muted-foreground"><Clock size={16} className="mr-2" /> Hourly</span>
               <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-xs font-bold uppercase flex items-center"><CheckCircle size={14} className="mr-1" /> Healthy</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tasks List */}
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <h2 className="text-xl font-bold mb-4 border-b border-border pb-2 flex items-center">
            <TerminalSquare size={20} className="mr-2 text-purple-500" /> Tasks
          </h2>
          <div className="space-y-4">
            <div className="p-3 border border-border rounded-lg bg-secondary/30 font-mono text-sm flex items-center">
              <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center mr-3 text-xs text-muted-foreground">1</span>
              extract_orders
            </div>
            <div className="flex justify-center text-muted-foreground">↓</div>
            <div className="p-3 border border-border rounded-lg bg-secondary/30 font-mono text-sm flex items-center">
              <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center mr-3 text-xs text-muted-foreground">2</span>
              transform_orders
            </div>
            <div className="flex justify-center text-muted-foreground">↓</div>
            <div className="p-3 border border-border rounded-lg bg-secondary/30 font-mono text-sm flex items-center border-l-4 border-l-cyan-500">
              <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center mr-3 text-xs text-muted-foreground">3</span>
              load_orders
            </div>
          </div>
        </div>

        {/* Run History */}
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <h2 className="text-xl font-bold mb-4 border-b border-border pb-2 flex items-center">
            <Clock size={20} className="mr-2 text-blue-500" /> Last Runs
          </h2>
          <div className="space-y-3">
             <div className="flex justify-between items-center p-3 hover:bg-secondary/30 rounded-lg transition-colors border border-transparent hover:border-border">
              <span className="font-bold">Run 1</span>
              <span className="text-green-500 text-sm font-bold uppercase flex items-center"><CheckCircle size={14} className="mr-1" /> Success</span>
            </div>
            <div className="flex justify-between items-center p-3 hover:bg-secondary/30 rounded-lg transition-colors border border-transparent hover:border-border">
              <span className="font-bold">Run 2</span>
              <span className="text-green-500 text-sm font-bold uppercase flex items-center"><CheckCircle size={14} className="mr-1" /> Success</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-500/5 rounded-lg border border-red-500/20">
              <span className="font-bold text-red-500">Run 3</span>
              <span className="text-red-500 text-sm font-bold uppercase flex items-center"><XOctagon size={14} className="mr-1" /> Failed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
