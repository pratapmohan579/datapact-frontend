"use client";

import { useState } from "react";
import { Database, LayoutGrid, Search, Filter, Shield, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";

export default function SchemasPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const mockSchemas = [
    { id: 1, name: "public", source: "PostgreSQL", tables: 42, views: 5, size: "12 GB", owner: "Data Platform", status: "Healthy", lastScanned: "10 mins ago" },
    { id: 2, name: "analytics_prod", source: "Snowflake", tables: 156, views: 24, size: "1.2 TB", owner: "Analytics Team", status: "Healthy", lastScanned: "1 hour ago" },
    { id: 3, name: "finance_secure", source: "Snowflake", tables: 12, views: 2, size: "50 GB", owner: "Finance", status: "Warning", lastScanned: "5 hours ago" },
    { id: 4, name: "dbt_dev", source: "BigQuery", tables: 89, views: 0, size: "200 GB", owner: "Data Engineering", status: "Healthy", lastScanned: "2 mins ago" },
    { id: 5, name: "raw_events", source: "PostgreSQL", tables: 3, views: 0, size: "850 GB", owner: "Growth", status: "Failed", lastScanned: "1 day ago" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent">
            Database Schemas
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Monitor and manage logical groupings of data assets across all your connected sources.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground px-4 py-2 rounded-lg font-medium transition-colors border border-border">
            <RefreshCw className="w-4 h-4" />
            Refresh All
          </button>
          <button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700 text-white px-5 py-2 rounded-lg font-medium transition-all shadow-lg shadow-green-500/20">
            <Database className="w-4 h-4" />
            Discover New
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-2xl border border-border relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Schemas</p>
              <h3 className="text-3xl font-bold mt-2 text-foreground">142</h3>
            </div>
            <div className="p-3 rounded-xl bg-green-500/10 text-green-400">
              <LayoutGrid className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-400 font-medium">
            <span>+12 this week</span>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border border-border relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Connected Sources</p>
              <h3 className="text-3xl font-bold mt-2 text-foreground">8</h3>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
              <Database className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-muted-foreground font-medium">
            <span>Across 4 regions</span>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border border-border relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Schemas at Risk</p>
              <h3 className="text-3xl font-bold mt-2 text-foreground">5</h3>
            </div>
            <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-yellow-400 font-medium">
            <span>Needs review</span>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border border-border relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Governed Assets</p>
              <h3 className="text-3xl font-bold mt-2 text-foreground">84%</h3>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
              <Shield className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-purple-400 font-medium">
            <span>Protected by DataPact</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="glass rounded-2xl border border-border overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-col md:flex-row justify-between items-center gap-4 bg-muted/30">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search schemas..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-shadow"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors">
              <Filter className="w-4 h-4" />
              Source: All
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors">
              <Filter className="w-4 h-4" />
              Status: All
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Schema Name</th>
                <th className="p-4 font-semibold">Source</th>
                <th className="p-4 font-semibold">Assets</th>
                <th className="p-4 font-semibold">Size</th>
                <th className="p-4 font-semibold">Owner</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Last Scanned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockSchemas.map((schema) => (
                <tr key={schema.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                        <LayoutGrid className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground group-hover:text-green-400 transition-colors cursor-pointer">{schema.name}</p>
                        <p className="text-xs text-muted-foreground">ID: sch_{schema.id.toString().padStart(4, '0')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-medium text-foreground">
                    <span className="px-2.5 py-1 bg-secondary rounded-md border border-border">{schema.source}</span>
                  </td>
                  <td className="p-4 text-sm text-foreground">
                    <p className="font-medium">{schema.tables} <span className="text-muted-foreground font-normal">tables</span></p>
                    <p className="text-xs text-muted-foreground">{schema.views} views</p>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{schema.size}</td>
                  <td className="p-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                        {schema.owner.charAt(0)}
                      </div>
                      <span className="font-medium text-foreground">{schema.owner}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm">
                    {schema.status === 'Healthy' && (
                      <span className="flex items-center gap-1.5 text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full w-fit">
                        <CheckCircle className="w-3.5 h-3.5" /> Healthy
                      </span>
                    )}
                    {schema.status === 'Warning' && (
                      <span className="flex items-center gap-1.5 text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-full w-fit">
                        <AlertTriangle className="w-3.5 h-3.5" /> Warning
                      </span>
                    )}
                    {schema.status === 'Failed' && (
                      <span className="flex items-center gap-1.5 text-red-400 bg-red-400/10 px-2.5 py-1 rounded-full w-fit">
                        <AlertTriangle className="w-3.5 h-3.5" /> Failed
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground text-right">{schema.lastScanned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
