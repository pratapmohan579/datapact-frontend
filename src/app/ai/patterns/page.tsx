"use client";

import React, { useState, useEffect } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Tree } from "react-arborist";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, ReferenceLine
} from "recharts";
import { 
  Database, Folder, Table, Activity, AlertTriangle, CheckCircle, Search, 
  TrendingUp, TrendingDown, BrainCircuit, Calendar, LineChart as LineChartIcon,
  Sparkles, Filter, Settings, Download
} from "lucide-react";

// --- MOCK DATA --- //
const mockTreeData = [
  { id: "1", name: "Sales", type: "schema", children: [
    { id: "2", name: "Orders", type: "table" },
    { id: "3", name: "Customers", type: "table" },
    { id: "4", name: "Products", type: "table" },
  ]},
  { id: "5", name: "Finance", type: "schema", children: [
    { id: "6", name: "Invoices", type: "table" },
    { id: "7", name: "Payments", type: "table" },
  ]},
  { id: "8", name: "Marketing", type: "schema", children: [
    { id: "9", name: "Campaigns", type: "table" },
  ]}
];

const mockTrendData = Array.from({ length: 30 }).map((_, i) => ({
  day: `Day ${i+1}`,
  expected: 1000000 + (i * 20000),
  actual: 1000000 + (i * 20000) + (i === 24 ? -150000 : (Math.random() * 10000 - 5000)), // Simulate dip on Day 25
}));

const mockFreshnessData = Array.from({ length: 24 }).map((_, i) => ({
  hour: `${i}:00`,
  delay: 28 + (Math.random() * 4), // stable ~30 mins
  threshold: 45
}));

const mockAnomalies = [
  { id: 1, time: "09:22", dataset: "Orders", issue: "Row Count Drop", expected: "1.2M", actual: "650K", severity: "Critical", conf: "99%" },
  { id: 2, time: "14:05", dataset: "Customers", issue: "Null Spike (email)", expected: "0.2%", actual: "18%", severity: "High", conf: "95%" },
  { id: 3, time: "Yesterday", dataset: "Payments", issue: "Delayed Refresh", expected: "30m", actual: "120m", severity: "Medium", conf: "92%" },
];

// --- COMPONENTS --- //

function TreeIcon({ type, isOpen }: { type: string, isOpen: boolean }) {
  if (type === "schema") return <Folder className={`w-4 h-4 ${isOpen ? 'text-yellow-400' : 'text-muted-foreground'}`} />;
  return <Table className="w-4 h-4 text-blue-400" />;
}

// Custom CSS Grid Calendar Heatmap
function CalendarHeatmap() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  // Mock 4 weeks of data
  const grid = Array.from({ length: 28 }).map((_, i) => {
    const isWeekend = i % 7 === 0 || i % 7 === 6;
    const isFriday = i % 7 === 5;
    let intensity = Math.random() * 0.3; // base noise
    if (isWeekend) intensity += 0.5; // weekend spike
    if (isFriday) intensity += 0.8; // Friday spike
    return Math.min(intensity, 1);
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex text-xs text-muted-foreground mb-1">
        {days.map(d => <div key={d} className="flex-1 text-center">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {grid.map((val, i) => (
          <div 
            key={i} 
            className="aspect-square rounded-md border border-border/50"
            style={{ backgroundColor: `rgba(59, 130, 246, ${val})` }}
            title={`Activity level: ${Math.round(val * 100)}%`}
          />
        ))}
      </div>
    </div>
  );
}

export default function PatternDetectionStudio() {
  const [selectedTable, setSelectedTable] = useState<string | null>("Orders");
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* HEADER */}
      <header className="flex-shrink-0 border-b border-border bg-card/50 backdrop-blur-sm p-6 flex justify-between items-center z-10">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-blue-500" />
            AI Pattern Detection
          </h1>
          <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
            Continuously analyze historical behavior, detect trends, identify anomalies, forecast risks, and generate adaptive data quality intelligence.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 bg-secondary border border-border rounded-lg text-sm hover:bg-muted transition flex items-center gap-2"><Settings className="w-4 h-4"/> Settings</button>
          <button className="px-3 py-1.5 bg-secondary border border-border rounded-lg text-sm hover:bg-muted transition flex items-center gap-2"><Download className="w-4 h-4"/> Export</button>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition shadow-lg shadow-blue-500/20 flex items-center gap-2">
            <LineChartIcon className="w-4 h-4" /> Run Analysis
          </button>
        </div>
      </header>

      {/* SUMMARY CARDS & LIVE PIPELINE */}
      <div className="border-b border-border bg-card/30 flex divide-x divide-border">
        {/* Pipeline Animation */}
        <div className="w-1/3 p-4 flex items-center justify-between px-8 text-xs font-medium text-muted-foreground">
           <div className="flex flex-col items-center gap-1 text-green-400"><CheckCircle className="w-4 h-4"/> History</div>
           <div className="h-0.5 flex-1 bg-border mx-2 relative overflow-hidden"><div className="absolute inset-0 bg-green-500/50 w-full"></div></div>
           <div className="flex flex-col items-center gap-1 text-green-400"><TrendingUp className="w-4 h-4"/> Trends</div>
           <div className="h-0.5 flex-1 bg-border mx-2 relative overflow-hidden"><div className="absolute inset-0 bg-green-500/50 w-full"></div></div>
           <div className="flex flex-col items-center gap-1 text-blue-400 animate-pulse"><Activity className="w-4 h-4"/> Anomalies</div>
           <div className="h-0.5 flex-1 bg-border mx-2"><div className="h-full bg-blue-500 w-1/2 animate-[progress_2s_ease-in-out_infinite]"></div></div>
           <div className="flex flex-col items-center gap-1 opacity-50"><BrainCircuit className="w-4 h-4"/> Forecast</div>
        </div>

        {/* KPIs */}
        <div className="flex-1 grid grid-cols-5 divide-x divide-border">
          {[
            { label: "Datasets Analyzed", value: "428" },
            { label: "Patterns Learned", value: "3,482" },
            { label: "Anomalies Today", value: "14", alert: true },
            { label: "Forecast Accuracy", value: "97.8%" },
            { label: "Adaptive Rules", value: "621" },
          ].map((stat, i) => (
            <div key={i} className="p-4 flex flex-col justify-center">
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
              <p className={`text-xl font-bold mt-1 ${stat.alert ? 'text-red-400' : 'text-foreground'}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          
          {/* LEFT EXPLORER */}
          <Panel defaultSize={20} minSize={15} className="bg-card/30 border-r border-border flex flex-col">
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="text" placeholder="Search datasets..." className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-md text-sm"/>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-2">
              <Tree
                data={mockTreeData}
                width="100%"
                height={600}
                indent={16}
                rowHeight={32}
              >
                {({ node, style }) => (
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
                        <svg className={`w-3 h-3 transition-transform ${node.isOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      )}
                    </span>
                    <TreeIcon type={node.data.type} isOpen={node.isOpen} />
                    <span className="truncate">{node.data.name}</span>
                  </div>
                )}
              </Tree>
            </div>
          </Panel>
          
          <PanelResizeHandle className="w-1 bg-border hover:bg-blue-500/50 transition-colors cursor-col-resize" />
          
          {/* RIGHT CONTENT AREA */}
          <Panel className="flex flex-col bg-background relative overflow-hidden">
            {selectedTable ? (
              <>
                {/* DATASET HEADER */}
                <div className="p-6 border-b border-border bg-card/40">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold flex items-center gap-3">
                        <Table className="w-6 h-6 text-blue-400" /> {selectedTable}
                      </h2>
                      <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Database className="w-4 h-4"/> 28M Rows</span>
                        <span className="flex items-center gap-1"><Activity className="w-4 h-4"/> 31 Patterns</span>
                        <span className="flex items-center gap-1"><AlertTriangle className="w-4 h-4 text-emerald-400"/> Low Risk</span>
                        <span className="flex items-center gap-1"><Sparkles className="w-4 h-4 text-blue-400"/> 99% Conf</span>
                      </div>
                    </div>
                  </div>

                  {/* TABS */}
                  <div className="flex gap-6 mt-6 border-b border-border">
                    {['overview', 'seasonality', 'anomalies', 'forecast'].map((tab) => (
                      <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                          activeTab === tab ? 'border-blue-500 text-blue-500' : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* TAB CONTENT */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  
                  {activeTab === 'overview' && (
                    <>
                      {/* Trend Charts */}
                      <div className="grid grid-cols-2 gap-6">
                        {/* Row Count Trend */}
                        <div className="glass p-6 rounded-xl border border-border">
                          <h3 className="font-semibold mb-1">Row Count Trend (30 Days)</h3>
                          <p className="text-xs text-muted-foreground mb-4">Historical growth vs Actual</p>
                          <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={mockTrendData} margin={{top:5, right:0, left:0, bottom:0}}>
                                <defs>
                                  <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="day" hide />
                                <YAxis hide domain={['dataMin - 100000', 'dataMax + 100000']} />
                                <Tooltip contentStyle={{backgroundColor: '#1e1e1e', borderColor: '#333', borderRadius: '8px'}}/>
                                <Area type="monotone" dataKey="expected" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorExpected)" />
                                <Area type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} fillOpacity={0} />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Freshness Trend */}
                        <div className="glass p-6 rounded-xl border border-border">
                          <h3 className="font-semibold mb-1">Refresh Interval (24 Hrs)</h3>
                          <p className="text-xs text-muted-foreground mb-4">Time between data arrivals</p>
                          <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={mockFreshnessData} margin={{top:5, right:0, left:0, bottom:0}}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="hour" fontSize={10} stroke="#888" tickLine={false} axisLine={false} />
                                <YAxis hide domain={[0, 60]} />
                                <Tooltip contentStyle={{backgroundColor: '#1e1e1e', borderColor: '#333', borderRadius: '8px'}}/>
                                <ReferenceLine y={45} stroke="#ef4444" strokeDasharray="3 3" label={{position: 'insideTopLeft', value: 'SLA (45m)', fill: '#ef4444', fontSize: 10}} />
                                <Line type="stepAfter" dataKey="delay" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>

                      {/* Adaptive Thresholds */}
                      <div className="glass p-6 rounded-xl border border-border">
                        <h3 className="font-semibold mb-4">Adaptive Thresholds Dashboard</h3>
                        <div className="grid grid-cols-4 gap-4">
                          {[
                            { name: "Null %", expected: "0.2%", allowed: "0.6%", current: "0.3%", status: "Healthy" },
                            { name: "Daily Growth", expected: "2.1%", allowed: "5.0%", current: "2.3%", status: "Healthy" },
                            { name: "Freshness", expected: "30m", allowed: "45m", current: "28m", status: "Healthy" },
                            { name: "Duplicates", expected: "0%", allowed: "0.1%", current: "0%", status: "Healthy" },
                          ].map((t, i) => (
                            <div key={i} className="bg-background rounded-lg border border-border p-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">{t.name}</span>
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                                <div><p className="text-xs text-muted-foreground">Expected</p><p>{t.expected}</p></div>
                                <div><p className="text-xs text-muted-foreground">Current</p><p className="font-semibold">{t.current}</p></div>
                                <div className="col-span-2 mt-1 pt-1 border-t border-border"><p className="text-xs text-muted-foreground">Allowed (Threshold)</p><p>{t.allowed}</p></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === 'seasonality' && (
                    <div className="grid grid-cols-3 gap-6 h-full">
                      <div className="col-span-2 glass rounded-xl border border-border p-6 flex flex-col">
                        <h3 className="font-semibold mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-400"/> Business Seasonality Heatmap</h3>
                        <div className="flex-1 flex items-center justify-center">
                          <div className="w-full max-w-md">
                            <CalendarHeatmap />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="glass rounded-xl border border-border p-6 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none"><BrainCircuit className="w-32 h-32 text-blue-500"/></div>
                          <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-4">AI Explanations</h3>
                          
                          <div className="space-y-4 text-sm">
                            <div className="bg-background/50 p-3 rounded border border-border">
                              <h4 className="font-semibold text-blue-400 mb-1">Detected Pattern</h4>
                              <p>Orders consistently increase by 15-20% every Friday compared to the weekly average.</p>
                              <div className="flex items-center gap-2 mt-2 text-xs font-mono text-muted-foreground">Confidence: <span className="text-green-400">98%</span></div>
                            </div>
                            
                            <div className="bg-background/50 p-3 rounded border border-border">
                              <h4 className="font-semibold text-blue-400 mb-1">Weekend Behavior</h4>
                              <p>Volume drops by 40% on Saturdays and Sundays. This is considered normal seasonality.</p>
                              <div className="flex items-center gap-2 mt-2 text-xs font-mono text-muted-foreground">Confidence: <span className="text-green-400">99%</span></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'anomalies' && (
                    <div className="space-y-6">
                      <div className="glass rounded-xl border border-border overflow-hidden">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider">
                            <tr>
                              <th className="px-4 py-3 font-medium">Time</th>
                              <th className="px-4 py-3 font-medium">Issue</th>
                              <th className="px-4 py-3 font-medium">Expected</th>
                              <th className="px-4 py-3 font-medium">Actual</th>
                              <th className="px-4 py-3 font-medium">Severity</th>
                              <th className="px-4 py-3 font-medium">Root Cause Hint</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {mockAnomalies.map((a) => (
                              <tr key={a.id} className="hover:bg-muted/30">
                                <td className="px-4 py-4 font-mono text-xs">{a.time}</td>
                                <td className="px-4 py-4 font-medium">{a.issue}</td>
                                <td className="px-4 py-4 text-muted-foreground">{a.expected}</td>
                                <td className="px-4 py-4 text-foreground">{a.actual}</td>
                                <td className="px-4 py-4">
                                  <span className={`px-2 py-1 text-xs rounded-full border ${a.severity === 'Critical' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'}`}>
                                    {a.severity}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-xs text-muted-foreground flex items-center gap-2">
                                  <BrainCircuit className="w-4 h-4 text-indigo-400" />
                                  {a.severity === 'Critical' ? 'Recent Pipeline Delay / Failed DAG' : 'Slow Warehouse / Lock'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeTab === 'forecast' && (
                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-3">
                        <h3 className="text-lg font-semibold mb-2">Tomorrow's Forecast</h3>
                        <p className="text-sm text-muted-foreground mb-4">Predictions generated based on 90-day rolling window.</p>
                      </div>
                      
                      <div className="glass p-6 rounded-xl border border-border">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Expected Rows</p>
                        <p className="text-3xl font-bold">4.2M</p>
                        <p className="text-sm text-green-400 mt-2">Healthy Growth (+2%)</p>
                      </div>
                      <div className="glass p-6 rounded-xl border border-border">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Expected Refresh Interval</p>
                        <p className="text-3xl font-bold">29 Mins</p>
                        <p className="text-sm text-muted-foreground mt-2">Well within SLA</p>
                      </div>
                      <div className="glass p-6 rounded-xl border border-border border-l-4 border-l-yellow-500">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Failure Risk</p>
                        <p className="text-3xl font-bold text-yellow-500">6%</p>
                        <p className="text-sm text-muted-foreground mt-2">Slightly elevated due to upcoming Friday spike</p>
                      </div>
                    </div>
                  )}
                  
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
                <BrainCircuit className="w-16 h-16 mb-4 opacity-20" />
                <h3 className="text-xl font-medium text-foreground mb-2">Select a Dataset</h3>
                <p className="text-center max-w-md">Browse the explorer on the left to analyze historical patterns, seasonality, and adaptive thresholds.</p>
              </div>
            )}
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
