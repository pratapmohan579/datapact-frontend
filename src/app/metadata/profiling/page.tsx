"use client";

import React, { useState, useEffect } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Tree } from "react-arborist";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from "recharts";
import { 
  Database, Folder, Table, Activity, AlertTriangle, CheckCircle, Search, 
  TrendingUp, TrendingDown, Target, BrainCircuit, ShieldAlert, Sparkles, Filter 
} from "lucide-react";

// --- MOCK DATA --- //
const mockTreeData = [
  { id: "1", name: "PostgreSQL", type: "source", children: [
    { id: "2", name: "Sales", type: "schema", children: [
      { id: "3", name: "Orders", type: "table" },
      { id: "4", name: "Customers", type: "table" },
      { id: "5", name: "Products", type: "table" },
    ]},
  ]},
  { id: "6", name: "Snowflake", type: "source", children: [
    { id: "7", name: "Analytics", type: "schema", children: [
      { id: "8", name: "Revenue", type: "table" },
      { id: "9", name: "Sessions", type: "table" },
    ]},
  ]}
];

const mockColumns = [
  { name: "order_id", type: "INT", nullPct: 0, uniquePct: 100, min: "1", max: "12M", avg: "-", distinct: "12M", risk: "Low" },
  { name: "customer_id", type: "INT", nullPct: 0.1, uniquePct: 45, min: "1", max: "8M", avg: "-", distinct: "3.2M", risk: "Low" },
  { name: "order_amount", type: "DECIMAL", nullPct: 2, uniquePct: 98, min: "12", max: "95210", avg: "3482", distinct: "-", risk: "Medium" },
  { name: "status", type: "VARCHAR", nullPct: 0, uniquePct: 0.1, min: "-", max: "-", avg: "-", distinct: "5", risk: "Low" },
  { name: "email", type: "VARCHAR", nullPct: 18, uniquePct: 95, min: "-", max: "-", avg: "24", distinct: "-", risk: "High" },
];

const distributionData = [
  { name: '0-100', value: 4000 }, { name: '100-500', value: 3000 },
  { name: '500-1k', value: 2000 }, { name: '1k-5k', value: 2780 },
  { name: '5k+', value: 1890 },
];

const radarData = [
  { subject: 'Completeness', A: 99, fullMark: 100 },
  { subject: 'Consistency', A: 96, fullMark: 100 },
  { subject: 'Uniqueness', A: 100, fullMark: 100 },
  { subject: 'Freshness', A: 97, fullMark: 100 },
  { subject: 'Stability', A: 94, fullMark: 100 },
];

const mockAnomalies = [
  { id: 1, title: "Null spike", target: "email", change: "+18%", time: "2 hours ago", type: "danger" },
  { id: 2, title: "Duplicate increase", target: "customer_id", change: "+4%", time: "Yesterday", type: "warning" },
  { id: 3, title: "Row count drop", target: "Orders", change: "-42%", time: "Today", type: "danger" },
];

// --- COMPONENTS --- //

function TreeIcon({ type, isOpen }: { type: string, isOpen: boolean }) {
  if (type === "source") return <Database className="w-4 h-4 text-blue-400" />;
  if (type === "schema") return <Folder className={`w-4 h-4 ${isOpen ? 'text-yellow-400' : 'text-muted-foreground'}`} />;
  return <Table className="w-4 h-4 text-green-400" />;
}

export default function ProfilingStudio() {
  const [selectedTable, setSelectedTable] = useState<string | null>("Orders");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedColumn, setSelectedColumn] = useState<any | null>(null);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* HEADER */}
      <header className="flex-shrink-0 border-b border-border bg-card/50 backdrop-blur-sm p-6 flex justify-between items-center z-10">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-indigo-500 bg-clip-text text-transparent flex items-center gap-3">
            <Target className="w-8 h-8 text-pink-500" />
            AI Statistical Profiling
          </h1>
          <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
            Automatically profile every dataset, calculate quality statistics, detect anomalies, and prepare AI-ready features for contract generation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-secondary border border-border rounded-lg text-sm font-medium hover:bg-muted transition">Export Report</button>
          <button className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition shadow-lg shadow-pink-500/20 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Run Full Profile
          </button>
        </div>
      </header>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-5 gap-4 p-4 border-b border-border bg-card/30">
        {[
          { label: "Datasets Profiled", value: "412", icon: Table, color: "text-blue-400" },
          { label: "Columns Analyzed", value: "8,921", icon: Database, color: "text-indigo-400" },
          { label: "Stats Generated", value: "2.4M", icon: Activity, color: "text-green-400" },
          { label: "Anomalies Found", value: "17", icon: AlertTriangle, color: "text-red-400" },
          { label: "Average Quality", value: "97.2%", icon: CheckCircle, color: "text-emerald-400" },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className={`p-3 rounded-lg bg-secondary ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          
          {/* LEFT EXPLORER */}
          <Panel defaultSize={20} minSize={15} className="bg-card/30 border-r border-border flex flex-col">
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search datasets..." 
                  className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-md text-sm"
                />
              </div>
            </div>
            <div className="flex-1 overflow-auto p-2">
              <Tree
                data={mockTreeData}
                width="100%"
                height={600}
                indent={16}
                rowHeight={32}
                padding={8}
              >
                {({ node, style, dragHandle }) => (
                  <div 
                    style={style} 
                    className={`flex items-center gap-2 px-2 rounded-md cursor-pointer text-sm ${node.isSelected || (node.data.type === 'table' && node.data.name === selectedTable) ? 'bg-primary/20 text-primary font-medium' : 'hover:bg-muted text-foreground'}`}
                    onClick={() => {
                      node.toggle();
                      if (node.data.type === "table") setSelectedTable(node.data.name);
                    }}
                  >
                    <span className="w-4 h-4 flex items-center justify-center">
                      {!node.isLeaf && (
                        <svg className={`w-3 h-3 transition-transform ${node.isOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </span>
                    <TreeIcon type={node.data.type} isOpen={node.isOpen} />
                    <span className="truncate">{node.data.name}</span>
                  </div>
                )}
              </Tree>
            </div>
          </Panel>

          <PanelResizeHandle className="w-1 bg-border hover:bg-pink-500/50 transition-colors cursor-col-resize" />
          
          {/* RIGHT CONTENT AREA */}
          <Panel className="flex flex-col bg-background relative overflow-hidden">
            {selectedTable ? (
              <>
                {/* DATASET HEADER */}
                <div className="p-6 border-b border-border bg-card/40">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        PostgreSQL <span className="text-border">/</span> Sales <span className="text-border">/</span>
                      </div>
                      <h2 className="text-2xl font-bold flex items-center gap-3">
                        <Table className="w-6 h-6 text-pink-400" /> {selectedTable}
                      </h2>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Quality</p>
                        <p className="text-lg font-bold text-green-400">98%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Risk</p>
                        <p className="text-lg font-bold text-emerald-400">Low</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Rows</p>
                        <p className="text-lg font-bold text-foreground">12.8M</p>
                      </div>
                    </div>
                  </div>

                  {/* TABS */}
                  <div className="flex gap-6 mt-6 border-b border-border">
                    {['overview', 'columns', 'anomalies', 'ai-insights'].map((tab) => (
                      <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                          activeTab === tab ? 'border-pink-500 text-pink-500' : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {tab.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* TAB CONTENT */}
                <div className="flex-1 overflow-y-auto p-6 relative">
                  
                  {activeTab === 'columns' && (
                    <div className="flex h-full gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">Column Statistics</h3>
                          <div className="flex items-center gap-2">
                            <button className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-md text-sm"><Filter className="w-4 h-4"/> Filter</button>
                          </div>
                        </div>
                        
                        <div className="glass rounded-xl border border-border overflow-hidden">
                          <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider">
                              <tr>
                                <th className="px-4 py-3 font-medium">Column</th>
                                <th className="px-4 py-3 font-medium">Type</th>
                                <th className="px-4 py-3 font-medium">Null %</th>
                                <th className="px-4 py-3 font-medium">Unique %</th>
                                <th className="px-4 py-3 font-medium">Min/Max</th>
                                <th className="px-4 py-3 font-medium text-center">Risk</th>
                                <th className="px-4 py-3 font-medium"></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {mockColumns.map((col, i) => (
                                <tr key={i} className="hover:bg-muted/30 cursor-pointer" onClick={() => setSelectedColumn(col)}>
                                  <td className="px-4 py-3 font-medium">{col.name}</td>
                                  <td className="px-4 py-3"><span className="text-xs font-mono bg-secondary px-2 py-0.5 rounded">{col.type}</span></td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      <span className={col.nullPct > 10 ? 'text-red-400 font-bold' : ''}>{col.nullPct}%</span>
                                      <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden"><div className={`h-full ${col.nullPct > 10 ? 'bg-red-500' : 'bg-blue-500'}`} style={{width: `${col.nullPct}%`}}></div></div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">{col.uniquePct}%</td>
                                  <td className="px-4 py-3 text-muted-foreground">{col.min} <span className="mx-1">→</span> {col.max}</td>
                                  <td className="px-4 py-3 text-center">
                                    <span className={`px-2 py-1 text-xs rounded-full border ${col.risk === 'High' ? 'bg-red-500/10 border-red-500/20 text-red-500' : col.risk === 'Medium' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' : 'bg-green-500/10 border-green-500/20 text-green-500'}`}>
                                      {col.risk}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <button className="text-pink-400 hover:text-pink-300 text-xs font-medium">Details</button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      {/* COLUMN DETAILS DRAWER */}
                      {selectedColumn && (
                        <div className="w-96 glass rounded-xl border border-border shadow-2xl flex flex-col animate-in slide-in-from-right-8">
                          <div className="p-4 border-b border-border flex justify-between items-center bg-card/50">
                            <div>
                              <h3 className="font-bold text-lg">{selectedColumn.name}</h3>
                              <p className="text-xs text-muted-foreground font-mono mt-1">{selectedColumn.type}</p>
                            </div>
                            <button onClick={() => setSelectedColumn(null)} className="p-2 hover:bg-secondary rounded-md">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                          
                          <div className="p-4 flex-1 overflow-y-auto space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-background border border-border p-3 rounded-lg"><p className="text-xs text-muted-foreground mb-1">Average</p><p className="font-semibold">{selectedColumn.avg}</p></div>
                              <div className="bg-background border border-border p-3 rounded-lg"><p className="text-xs text-muted-foreground mb-1">Distinct</p><p className="font-semibold">{selectedColumn.distinct}</p></div>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><BarChart className="w-4 h-4 text-pink-400"/> Value Distribution</h4>
                              <div className="h-48 w-full bg-background border border-border rounded-lg p-2">
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart data={distributionData}>
                                    <XAxis dataKey="name" fontSize={10} stroke="#888" tickLine={false} axisLine={false} />
                                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#1e1e1e', borderColor: '#333', borderRadius: '8px'}} />
                                    <Bar dataKey="value" fill="#ec4899" radius={[4, 4, 0, 0]} />
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                            
                            <div className="bg-pink-500/10 border border-pink-500/20 p-4 rounded-lg">
                              <div className="flex items-start gap-3">
                                <BrainCircuit className="w-5 h-5 text-pink-400 mt-0.5" />
                                <div>
                                  <h4 className="font-semibold text-pink-400 text-sm">AI Recommendation</h4>
                                  <p className="text-xs mt-1 text-foreground">Suggest creating a NOT NULL contract rule. Null rate is extremely stable at 0% for the last 30 days.</p>
                                  <button className="mt-3 px-3 py-1.5 bg-pink-500 hover:bg-pink-600 text-white rounded text-xs font-medium transition">Generate Rule</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'ai-insights' && (
                    <div className="grid grid-cols-2 gap-6 h-full">
                      <div className="glass rounded-xl border border-border p-6 flex flex-col">
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2"><Target className="w-5 h-5 text-pink-400"/> Data Quality Radar</h3>
                        <div className="flex-1 min-h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                              <PolarGrid stroke="#333" />
                              <PolarAngleAxis dataKey="subject" tick={{fill: '#888', fontSize: 12}} />
                              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                              <Radar name="Quality" dataKey="A" stroke="#ec4899" fill="#ec4899" fillOpacity={0.3} />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="glass rounded-xl border border-border p-6 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none"><BrainCircuit className="w-32 h-32 text-pink-500"/></div>
                          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400 mb-4">AI Profiling Summary</h3>
                          <ul className="space-y-3 text-sm">
                            <li className="flex gap-3"><CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0"/> Orders table is extremely stable.</li>
                            <li className="flex gap-3"><TrendingUp className="w-5 h-5 text-blue-400 flex-shrink-0"/> Freshness detects arrival every 60 minutes.</li>
                            <li className="flex gap-3"><CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0"/> No nulls detected in critical columns.</li>
                            <li className="flex gap-3"><Sparkles className="w-5 h-5 text-pink-400 flex-shrink-0"/> Primary key confidence 99% for `order_id`.</li>
                          </ul>
                          <div className="mt-6 flex gap-3">
                            <button className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm font-medium transition shadow-lg shadow-pink-500/20">Auto-Generate Contract</button>
                            <button className="px-4 py-2 bg-secondary hover:bg-muted text-foreground rounded-lg text-sm font-medium transition border border-border">Explain Analysis</button>
                          </div>
                        </div>

                        <div className="glass rounded-xl border border-border p-6">
                          <h3 className="font-semibold mb-4 flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-red-400"/> AI Risk Analysis</h3>
                          <div className="flex items-center gap-6">
                            <div className="relative w-24 h-24 rounded-full border-8 border-secondary flex items-center justify-center">
                              <div className="absolute inset-0 rounded-full border-8 border-green-500" style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'}}></div>
                              <span className="text-2xl font-bold">92%</span>
                            </div>
                            <div className="flex-1 space-y-2 text-sm">
                              <div className="flex justify-between items-center"><span className="text-muted-foreground">Overall Confidence</span><span className="font-bold">High</span></div>
                              <div className="flex justify-between items-center"><span className="text-muted-foreground">Historical Stability</span><span className="font-bold text-green-400">Excellent</span></div>
                              <div className="flex justify-between items-center"><span className="text-muted-foreground">Schema Drift Risk</span><span className="font-bold text-emerald-400">None</span></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'anomalies' && (
                    <div className="space-y-4 max-w-4xl">
                      <h3 className="text-lg font-semibold mb-4">Detected Anomalies</h3>
                      {mockAnomalies.map((a) => (
                        <div key={a.id} className="glass p-4 rounded-xl border border-border flex items-center justify-between hover:bg-muted/30 transition">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full ${a.type === 'danger' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                              <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="font-bold text-foreground text-base">{a.title}</h4>
                              <p className="text-sm text-muted-foreground">Target: <span className="font-mono text-foreground">{a.target}</span></p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-lg font-bold ${a.type === 'danger' ? 'text-red-400' : 'text-yellow-400'}`}>{a.change}</p>
                            <p className="text-xs text-muted-foreground">{a.time}</p>
                          </div>
                          <button className="px-4 py-2 bg-secondary rounded-lg text-sm font-medium hover:bg-background border border-border transition">Investigate</button>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'overview' && (
                    <div className="grid grid-cols-2 gap-6">
                       <div className="glass p-6 rounded-xl border border-border">
                          <h3 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-pink-400"/> Row Count Growth (30 Days)</h3>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={[{name: '1', rows: 10}, {name: '15', rows: 11.5}, {name: '30', rows: 12.8}]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="name" stroke="#888" tickLine={false} axisLine={false} />
                                <YAxis stroke="#888" tickLine={false} axisLine={false} tickFormatter={(v)=>`${v}M`} />
                                <Tooltip contentStyle={{backgroundColor: '#1e1e1e', borderColor: '#333', borderRadius: '8px'}}/>
                                <Line type="monotone" dataKey="rows" stroke="#ec4899" strokeWidth={3} dot={{r: 4, fill: '#ec4899'}} activeDot={{r: 6}} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                       </div>
                       
                       <div className="glass p-6 rounded-xl border border-border flex flex-col justify-center items-center text-center">
                          <Database className="w-16 h-16 text-muted-foreground/30 mb-4" />
                          <h3 className="text-xl font-bold mb-2">Ready to generate Contracts?</h3>
                          <p className="text-muted-foreground text-sm max-w-sm mb-6">The AI Statistical Profiling Engine has fully mapped the behaviors, anomalies, and statistics of this dataset.</p>
                          <button onClick={() => setActiveTab('ai-insights')} className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg font-medium transition shadow-lg">View AI Insights</button>
                       </div>
                    </div>
                  )}
                  
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
                <Target className="w-16 h-16 mb-4 opacity-20" />
                <h3 className="text-xl font-medium text-foreground mb-2">Select a Dataset to Profile</h3>
                <p className="text-center max-w-md">Browse the explorer on the left to select a table or schema and dive into deep statistical profiling and AI insights.</p>
              </div>
            )}
          </Panel>
        </PanelGroup>
      </div>
      
      {/* AI CHAT ASSISTANT STUB */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end z-50">
        <button className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg shadow-pink-500/30 flex items-center justify-center text-white hover:scale-105 transition-transform">
          <BrainCircuit className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
