"use client";

import React, { useState } from 'react';
import { 
  Sparkles, Brain, Activity, Target, Zap, Clock, 
  CheckCircle, AlertTriangle, FileText, Bot, ArrowRight,
  Cpu, Database, Layers, BarChart3, Wifi
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

// Mock Performance Data
const performanceData = [
  { time: '08:00', latency: 450, requests: 120 },
  { time: '09:00', latency: 420, requests: 180 },
  { time: '10:00', latency: 510, requests: 350 },
  { time: '11:00', latency: 490, requests: 420 },
  { time: '12:00', latency: 410, requests: 290 },
  { time: '13:00', latency: 405, requests: 280 },
  { time: '14:00', latency: 460, requests: 310 },
];

export default function AIMissionControl() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Cpu className="w-8 h-8 text-purple-400" />
            AI Operations Center
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Live telemetry and health for all Autonomous AI Agents and LLM workflows.
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-sm font-medium">
            <Wifi className="w-4 h-4 animate-pulse" /> All Systems Operational
          </div>
          <button className="bg-secondary border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors">
            Configure Models
          </button>
        </div>
      </div>

      {/* Primary Telemetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <TelemetryCard title="AI Health" value="99.9%" icon={<CheckCircle className="text-green-400" />} subtitle="Uptime today" />
        <TelemetryCard title="Inference Latency" value="460ms" icon={<Zap className="text-yellow-400" />} subtitle="P95 across models" />
        <TelemetryCard title="AI Accuracy" value="96.2%" icon={<Target className="text-blue-400" />} subtitle="Based on user feedback" />
        <TelemetryCard title="Vector Index" value="Online" icon={<Database className="text-cyan-400" />} subtitle="Qdrant • 1.2M points" />
        <TelemetryCard title="Token Usage" value="4.2M" icon={<BarChart3 className="text-purple-400" />} subtitle="$12.50 estimated cost" />
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Queues & Background Jobs */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" /> Active Queues
            </h3>
            <div className="space-y-4">
              <QueueItem name="Embedding Generation" count={12} total={150} status="processing" />
              <QueueItem name="Pattern Detection" count={4} total={4} status="completed" />
              <QueueItem name="Contract Recommendations" count={28} total={28} status="completed" />
              <QueueItem name="Incident Root Cause" count={1} total={1} status="processing" />
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-400" /> Agent Status
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                <span className="text-sm font-medium">Copilot Sessions</span>
                <span className="text-sm font-bold text-white bg-blue-500/20 px-2 rounded">24 Active</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                <span className="text-sm font-medium">Auto-Healing Agent</span>
                <span className="text-sm font-bold text-white bg-green-500/20 px-2 rounded">Monitoring</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                <span className="text-sm font-medium">Metadata Profiler</span>
                <span className="text-sm font-bold text-white bg-secondary px-2 rounded">Sleeping</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center/Right - Analytics and Provider info */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Latency / Volume Chart */}
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">Inference Traffic & Latency</h3>
              <select className="bg-secondary border border-border rounded-lg text-sm px-3 py-1">
                <option>Today</option>
                <option>Last 7 Days</option>
              </select>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="time" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1e1e2d', borderColor: '#333', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="latency" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorLatency)" />
                  <Line type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Learning Progress */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Learning Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Contract Acceptance Rate</span>
                    <span className="font-medium text-white">88%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Copilot Resolution Rate</span>
                    <span className="font-medium text-white">74%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '74%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Metadata Coverage</span>
                    <span className="font-medium text-white">95%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Providers */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Model Providers</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-black rounded flex items-center justify-center border border-gray-800">
                      <span className="font-bold text-white text-xs">OAI</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">OpenAI (Primary)</p>
                      <p className="text-xs text-muted-foreground">gpt-4o</p>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-900 rounded flex items-center justify-center border border-blue-800">
                      <span className="font-bold text-white text-xs">BGE</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">FastEmbed</p>
                      <p className="text-xs text-muted-foreground">bge-base-en-v1.5</p>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TelemetryCard({ title, value, icon, subtitle }: { title: string, value: string, icon: React.ReactNode, subtitle: string }) {
  return (
    <div className="glass-card p-5 relative overflow-hidden group">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="p-1.5 bg-secondary rounded-lg">{icon}</div>
      </div>
      <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>
    </div>
  );
}

function QueueItem({ name, count, total, status }: { name: string, count: number, total: number, status: 'processing' | 'completed' }) {
  const percent = (count / total) * 100;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-foreground font-medium">{name}</span>
        <span className="text-muted-foreground text-xs">{count}/{total}</span>
      </div>
      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
        <div 
          className={`h-full ${status === 'processing' ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`} 
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
}
