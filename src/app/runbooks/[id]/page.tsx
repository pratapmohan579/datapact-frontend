"use client"

import React from 'react';
import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Server, CheckSquare, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function RunbookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto text-foreground">
      <div className="mb-8">
        <Link href="/runbooks" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Runbooks
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Freshness Failure Runbook</h1>
            <div className="flex space-x-4 mt-2">
              <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center">
                <AlertTriangle size={14} className="mr-1" /> High Severity
              </span>
              <span className="bg-secondary text-muted-foreground px-3 py-1 rounded-full text-xs font-semibold uppercase">
                Owner: Data Platform
              </span>
            </div>
          </div>
          <button className="border border-border hover:bg-secondary text-foreground px-4 py-2 rounded-md text-sm font-semibold transition-colors">
            Edit Runbook
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-bold border-b border-border pb-2">Resolution Steps</h2>
          
          <div className="space-y-4">
            {[
              { title: "Check Airflow DAG", est: "5 min", desc: "Open the Airflow UI and locate the failed DAG run. Check the task logs for the specific node that failed." },
              { title: "Check Spark Job Logs", est: "10 min", desc: "If the Airflow task was a Databricks/Spark submit, follow the link to the Spark UI to check for OOM or data skew errors." },
              { title: "Validate Source Data", est: "15 min", desc: "Query the raw upstream table to ensure data was actually delivered by the third-party provider today." },
              { title: "Reprocess Failed Partition", est: "20 min", desc: "Once the issue is resolved, clear the failed Airflow task and trigger a re-run of the specific date partition." },
            ].map((step, idx) => (
              <div key={idx} className="p-6 rounded-xl border border-border bg-card shadow-sm flex items-start">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold mr-4 shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg">{step.title}</h3>
                    <span className="flex items-center text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                      <Clock size={12} className="mr-1" /> {step.est}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center">
              <Server size={18} className="mr-2" /> Related Assets
            </h2>
            <ul className="space-y-3">
              {['orders_mart', 'customer_mart', 'sales_mart'].map(asset => (
                <li key={asset} className="flex justify-between items-center p-2 hover:bg-secondary rounded-lg transition-colors">
                  <span className="font-mono text-sm">{asset}</span>
                  <Link href={`/assets/${asset}`} className="text-xs text-blue-500 hover:underline">View</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center">
              <ShieldAlert size={18} className="mr-2 text-red-500" /> Recent Incidents
            </h2>
            <ul className="space-y-3">
              {['INC-1001', 'INC-1045', 'INC-1090'].map(inc => (
                <li key={inc} className="flex justify-between items-center text-sm p-2 bg-secondary/50 rounded-lg">
                  <span className="font-bold text-blue-500">{inc}</span>
                  <span className="text-muted-foreground text-xs">Resolved</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
