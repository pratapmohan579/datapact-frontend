"use client"

import React from 'react';
import { Activity, ShieldCheck, TrendingUp, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const complianceData = [
  { day: 'Mon', rate: 94 },
  { day: 'Tue', rate: 95 },
  { day: 'Wed', rate: 92 },
  { day: 'Thu', rate: 97 },
  { day: 'Fri', rate: 96 },
  { day: 'Sat', rate: 98 },
  { day: 'Sun', rate: 97 },
];

export default function PipelineHealthPage() {
  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto text-foreground">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center">
            <Activity className="mr-3 text-cyan-500" size={28} /> Pipeline Health Center
          </h1>
          <p className="text-muted-foreground">Global view of data pipeline reliability and SLA compliance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-muted-foreground mb-1 uppercase tracking-wider">Overall Health</h2>
            <span className="text-5xl font-black text-green-500">96%</span>
          </div>
          <ShieldCheck size={64} className="text-green-500/20" />
        </div>
        
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-muted-foreground mb-1 uppercase tracking-wider">SLA Compliance</h2>
            <span className="text-5xl font-black text-blue-500">97%</span>
          </div>
          <TrendingUp size={64} className="text-blue-500/20" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Problem Pipelines */}
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center border-b border-border pb-2">
            <AlertTriangle className="mr-2 text-yellow-500" size={20} /> Top Problem Pipelines
          </h2>
          <table className="w-full text-left">
            <thead className="text-xs text-muted-foreground uppercase">
              <tr>
                <th className="pb-3">Pipeline</th>
                <th className="pb-3 text-right">Failures (7d)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-4 font-mono font-bold text-blue-500">orders_pipeline</td>
                <td className="py-4 text-right font-bold text-red-500">5</td>
              </tr>
              <tr>
                <td className="py-4 font-mono font-bold text-blue-500">finance_pipeline</td>
                <td className="py-4 text-right font-bold text-red-500">4</td>
              </tr>
              <tr>
                <td className="py-4 font-mono font-bold text-blue-500">marketing_sync</td>
                <td className="py-4 text-right font-bold text-orange-500">2</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SLA Trend */}
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <h2 className="text-xl font-bold mb-6 border-b border-border pb-2">SLA Compliance Trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={complianceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-border)" />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" textAnchor="end" height={20} tick={{fontSize: 12}} />
                <YAxis domain={[80, 100]} stroke="var(--color-muted-foreground)" tick={{fontSize: 12}} />
                <RechartsTooltip cursor={{stroke: 'var(--border-border)', strokeWidth: 1, strokeDasharray: '3 3'}} contentStyle={{backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-border)'}} />
                <Line type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
