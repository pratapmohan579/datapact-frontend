"use client"

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ShieldCheck, BookOpen, UserX, Clock, Target, AlertTriangle } from 'lucide-react';

const resolutionData = [
  { day: 'Mon', time: 45 },
  { day: 'Tue', time: 38 },
  { day: 'Wed', time: 30 },
  { day: 'Thu', time: 22 },
  { day: 'Fri', time: 18 },
  { day: 'Sat', time: 19 },
  { day: 'Sun', time: 18 },
];

const coverageData = [
  { name: 'Owned', value: 92 },
  { name: 'Unowned', value: 8 },
];

export default function ExecutiveDashboard() {
  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto text-foreground">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center">
            <Target size={28} className="mr-3 text-blue-500" /> Executive Summary
          </h1>
          <p className="text-muted-foreground">High-level KPIs for platform reliability, ownership, and incident resolution.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><ShieldCheck size={20} /></div>
            <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">Ownership Coverage</h3>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-5xl font-bold text-foreground">92%</span>
            <span className="text-green-500 text-sm font-bold flex items-center">+5%</span>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg"><BookOpen size={20} /></div>
            <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">Runbook Coverage</h3>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-5xl font-bold text-foreground">85%</span>
            <span className="text-green-500 text-sm font-bold flex items-center">+12%</span>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-red-500/10 text-red-500 rounded-lg"><UserX size={20} /></div>
            <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">Assets Without Owners</h3>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-5xl font-bold text-foreground">72</span>
            <span className="text-red-500 text-sm font-bold flex items-center">-10</span>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg"><Clock size={20} /></div>
            <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">Avg Resolution Time</h3>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-5xl font-bold text-foreground">18<span className="text-xl text-muted-foreground ml-1">m</span></span>
            <span className="text-green-500 text-sm font-bold flex items-center">-22m</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <h2 className="text-xl font-bold mb-6">Incident Resolution Trend (Minutes)</h2>
          <p className="text-sm text-muted-foreground mb-6">Tracking MTTR (Mean Time To Resolution) since deploying Runbooks.</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={resolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <RechartsTooltip contentStyle={{backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-border)'}} />
                <Line type="monotone" dataKey="time" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <h2 className="text-xl font-bold mb-6">Overall Data Health</h2>
          <div className="flex h-64 items-center justify-center relative">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={coverageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="#22c55e" />
                  <Cell fill="#ef4444" />
                </Pie>
                <RechartsTooltip contentStyle={{backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-border)'}} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-bold">A+</span>
              <span className="text-sm text-muted-foreground">Platform Grade</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
