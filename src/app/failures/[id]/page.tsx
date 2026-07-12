"use client"

import React, { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertOctagon, TerminalSquare, ShieldAlert, Search, Clock, Box, ShieldCheck, ServerCrash, Users, BookOpen } from 'lucide-react';

export default function FailureDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto text-foreground">
      <div className="mb-8">
        <Link href="/failures" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Failures
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center">
              <AlertOctagon size={28} className="mr-3 text-red-500" /> Failure #{resolvedParams.id}
            </h1>
            <p className="text-lg text-muted-foreground flex items-center">
              <Box size={18} className="mr-2" /> <span className="font-mono text-foreground font-bold mr-2">orders_mart</span> Freshness SLA Failed
            </p>
          </div>
          <Link href="/runbooks/rb-001" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center shadow-sm">
            <BookOpen size={16} className="mr-2" /> Open Runbook
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Root Cause Analysis */}
          <div className="p-6 rounded-xl border-2 border-red-500/30 bg-card shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
            <h2 className="text-xl font-bold mb-4 flex items-center border-b border-border pb-2">
              <Search size={20} className="mr-2 text-red-500" /> Root Cause
            </h2>
            <div className="flex items-center p-4 bg-red-500/5 rounded-lg border border-red-500/20 mb-4">
              <ServerCrash size={24} className="text-red-500 mr-4" />
              <div>
                <h3 className="font-bold text-red-500">Airflow DAG Failed</h3>
                <p className="text-sm text-foreground">Upstream pipeline crash caused data to become stale.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-secondary/30 rounded-lg border border-border">
                <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1 font-semibold">DAG</span>
                <Link href="/airflow/dags/orders_pipeline" className="font-mono font-bold text-blue-500 hover:underline">orders_pipeline</Link>
              </div>
              <div className="p-4 bg-secondary/30 rounded-lg border border-border">
                <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1 font-semibold">Task</span>
                <span className="font-mono font-bold">load_orders</span>
              </div>
            </div>
          </div>

          {/* Ownership */}
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center border-b border-border pb-2">
              <Users size={20} className="mr-2 text-indigo-500" /> Ownership
            </h2>
            <div className="flex justify-between items-center p-4 bg-secondary/30 rounded-lg border border-border">
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1 font-semibold">Owner</span>
                <span className="font-bold text-lg">Data Platform Team</span>
              </div>
              <Link href="/teams" className="text-sm font-semibold text-blue-500 hover:underline">View Team Details</Link>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm h-full">
            <h2 className="text-xl font-bold mb-6 flex items-center border-b border-border pb-2">
              <Clock size={20} className="mr-2 text-blue-500" /> Timeline
            </h2>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
              
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-green-500 bg-card group-[.is-active]:bg-green-500 text-card-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                </div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-border bg-secondary/30 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm">DAG Started</span>
                    <time className="font-mono text-xs text-muted-foreground">08:00</time>
                  </div>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-red-500 bg-card group-[.is-active]:bg-red-500 text-card-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                </div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-red-500/20 bg-red-500/5 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-red-500">Task Failed</span>
                    <time className="font-mono text-xs text-muted-foreground">08:05</time>
                  </div>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-orange-500 bg-card group-[.is-active]:bg-orange-500 text-card-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                </div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-orange-500/20 bg-orange-500/5 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-orange-500">Contract Failed</span>
                    <time className="font-mono text-xs text-muted-foreground">08:10</time>
                  </div>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-blue-500 bg-card group-[.is-active]:bg-blue-500 text-card-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                </div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-blue-500/20 bg-blue-500/5 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-blue-500">Alert Sent</span>
                    <time className="font-mono text-xs text-muted-foreground">08:15</time>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
