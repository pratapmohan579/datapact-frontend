"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useContract360 } from "@/api/contracts";
import { 
  ArrowLeft, Activity, ShieldAlert, CheckCircle, 
  XCircle, AlertTriangle, ShieldCheck, Database, 
  TerminalSquare, PlayCircle, Settings
} from "lucide-react";
import { format } from "date-fns";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from "recharts";
import { ReactFlow, Controls, Background } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

export default function Contract360Page() {
  const params = useParams();
  const router = useRouter();
  const contractId = Number(params.id);
  const [activeTab, setActiveTab] = useState("overview");

  const { data: contractData, isLoading, isError } = useContract360(contractId);

  if (isLoading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-10 bg-muted rounded w-48" />
        <div className="h-[200px] bg-muted rounded w-full" />
        <div className="h-[400px] bg-muted rounded w-full" />
      </div>
    );
  }

  if (isError || !contractData) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 pt-20">
        <XCircle className="h-16 w-16 text-red-500" />
        <h2 className="text-2xl font-bold">Failed to load contract</h2>
        <button onClick={() => router.back()} className="px-4 py-2 bg-blue-600 text-white rounded">Go Back</button>
      </div>
    );
  }

  const {
    overview, rules, raw_yaml, validation_timeline, execution_history, 
    affected_assets, lineage, incidents, alerts
  } = contractData;

  const flowNodes = lineage.nodes.map((n: any, idx: number) => ({
    id: n.id,
    position: { x: idx * 250, y: 100 },
    data: { label: `${n.database}.${n.schema_name}.${n.label}` },
    style: { border: "1px solid #444", padding: 10, borderRadius: 5, background: "#111", color: "#fff" }
  }));
  const flowEdges = lineage.edges.map((e: any) => ({
    id: e.id, source: e.source, target: e.target, animated: true, style: { stroke: '#888' }
  }));

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "rules", label: "Rules & YAML" },
    { id: "history", label: "Execution History" },
    { id: "lineage", label: "Lineage & Assets" },
    { id: "incidents", label: "Incidents & Alerts" }
  ];

  return (
    <div className="flex-1 space-y-6 p-8 pb-16 h-full overflow-y-auto w-full bg-background text-foreground">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="p-2 border border-border rounded-md hover:bg-muted" onClick={() => router.push("/contracts")}>
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{overview.name}</h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1 text-sm">
              {overview.status === "ACTIVE" ? <ShieldCheck className="h-4 w-4 text-green-500" /> : <ShieldAlert className="h-4 w-4 text-yellow-500" />}
              {overview.status} • v{overview.version} • Owner: {overview.owner?.name || "Unassigned"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center px-4 py-2 border border-border rounded-md hover:bg-muted text-sm font-medium">
            <Settings className="h-4 w-4 mr-2" /> Edit
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors">
            <PlayCircle className="h-4 w-4 mr-2" /> Run Now
          </button>
        </div>
      </div>

      {/* OVERVIEW CARDS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="glass-card p-5 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-foreground">Health Score</h3>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{overview.health_score.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground mt-1">Based on last 100 runs</p>
        </div>
        <div className="glass-card p-5 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-foreground">Success Rate</h3>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold">{overview.success_rate.toFixed(1)}%</div>
        </div>
        <div className="glass-card p-5 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-foreground">Open Incidents</h3>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold">{overview.incident_count}</div>
        </div>
        <div className="glass-card p-5 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-foreground">AI Score</h3>
            <TerminalSquare className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold">{overview.ai_score.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground mt-1">Rule coverage optimization</p>
        </div>
      </div>

      {/* TABS */}
      <div className="space-y-4 mt-6">
        <div className="flex space-x-1 border-b border-border overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id ? "border-blue-500 text-blue-400" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="glass-card rounded-lg border border-border p-5">
            <h3 className="text-lg font-medium mb-1">Validation Timeline</h3>
            <p className="text-sm text-muted-foreground mb-6">Pass/Fail trends over recent executions</p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={validation_timeline}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis stroke="#888" />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333' }} />
                  <Legend />
                  <Bar dataKey="pass_count" name="Passed" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="fail_count" name="Failed" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* RULES & YAML TAB */}
        {activeTab === "rules" && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="glass-card rounded-lg border border-border p-5">
              <h3 className="text-lg font-medium mb-4">Active Rules</h3>
              <div className="space-y-4">
                {rules.length === 0 && <p className="text-sm text-muted-foreground">No explicit rules parsed.</p>}
                {rules.map((rule: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-border bg-muted/20 rounded-lg">
                    <div>
                      <p className="font-medium text-sm text-foreground">{rule.rule_type}</p>
                      <p className="text-xs text-muted-foreground">{rule.description}</p>
                    </div>
                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded text-foreground">{rule.config?.column}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card rounded-lg border border-border p-5">
              <h3 className="text-lg font-medium mb-4">Raw Configuration (YAML)</h3>
              <pre className="p-4 bg-zinc-950 border border-border text-zinc-300 rounded-lg text-sm overflow-x-auto h-[400px]">
                <code>{raw_yaml || "# No YAML available"}</code>
              </pre>
            </div>
          </div>
        )}

        {/* EXECUTION HISTORY TAB */}
        {activeTab === "history" && (
          <div className="glass-card rounded-lg border border-border overflow-hidden">
            <div className="p-5 border-b border-border">
              <h3 className="text-lg font-medium">Recent Runs</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground border-b border-border">
                  <tr>
                    <th className="p-4 font-medium">Run ID</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Started</th>
                    <th className="p-4 font-medium">Duration</th>
                    <th className="p-4 font-medium">Violations</th>
                  </tr>
                </thead>
                <tbody>
                  {execution_history.length === 0 && (
                    <tr><td colSpan={5} className="p-4 text-center text-muted-foreground">No runs found</td></tr>
                  )}
                  {execution_history.map((run: any) => (
                    <tr key={run.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium text-foreground">{run.run_id}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          run.status === "PASSED" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                        }`}>
                          {run.status}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">{format(new Date(run.started_at), "PPp")}</td>
                      <td className="p-4 text-muted-foreground">{run.duration_ms} ms</td>
                      <td className="p-4 text-foreground">{run.violations}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* LINEAGE & ASSETS */}
        {activeTab === "lineage" && (
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1 glass-card rounded-lg border border-border p-5">
              <h3 className="text-lg font-medium mb-4">Monitored Assets</h3>
              <div className="space-y-4">
                {affected_assets.length === 0 && <p className="text-sm text-muted-foreground">No assets found.</p>}
                {affected_assets.map((asset: any) => (
                  <div key={asset.id} className="p-4 border border-border bg-muted/20 rounded-lg flex items-center space-x-4">
                    <Database className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-semibold text-sm text-foreground">{asset.table_name}</p>
                      <p className="text-xs text-muted-foreground">{asset.database}.{asset.schema_name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-2 glass-card rounded-lg border border-border p-5">
              <h3 className="text-lg font-medium mb-4">Lineage Graph</h3>
              <div className="h-[400px] border border-border rounded-lg bg-black/20">
                {flowNodes.length > 0 ? (
                  <ReactFlow nodes={flowNodes} edges={flowEdges} fitView colorMode="dark">
                    <Background color="#333" />
                    <Controls />
                  </ReactFlow>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    No lineage data available
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* INCIDENTS */}
        {activeTab === "incidents" && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="glass-card rounded-lg border border-border p-5">
              <h3 className="text-lg font-medium mb-4">Incidents</h3>
              {incidents.length === 0 ? <p className="text-sm text-muted-foreground">No open incidents.</p> : (
                <div className="space-y-4">
                  {incidents.map((inc: any) => (
                    <div key={inc.id} className="p-3 border border-border bg-muted/20 rounded-lg border-l-4 border-l-red-500">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-sm text-foreground">INC-{inc.id}</span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded border border-border text-foreground">{inc.status}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{format(new Date(inc.created_at), "PPp")}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="glass-card rounded-lg border border-border p-5">
              <h3 className="text-lg font-medium mb-4">Alert Deliveries</h3>
              {alerts.length === 0 ? <p className="text-sm text-muted-foreground">No alerts sent recently.</p> : (
                <div className="space-y-3">
                  {alerts.map((al: any) => (
                    <div key={al.id} className="flex justify-between p-3 border border-border bg-muted/20 rounded-lg text-sm">
                      <span className="text-foreground">{al.channel}</span>
                      <span className={al.status === "DELIVERED" ? "text-green-400 font-medium" : "text-yellow-400 font-medium"}>{al.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
