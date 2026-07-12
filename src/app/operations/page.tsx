"use client"

import React from 'react';
import Link from 'next/link';
import { Activity, Wind, ShieldCheck, AlertTriangle, AlertCircle, GitPullRequest, XOctagon, ShieldAlert, Users } from 'lucide-react';

const Github = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function OperationsCenter() {
  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto text-foreground">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Operations Command Center</h1>
          <p className="text-muted-foreground">Live status of contracts, deployments, and pipeline health.</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Activity className="mr-2 text-blue-500" /> Live Status
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/contracts" className="p-6 rounded-xl border border-green-500/30 bg-green-500/5 hover:bg-green-500/10 transition-colors shadow-sm flex items-center justify-between">
          <div className="flex items-center">
            <ShieldCheck size={28} className="text-green-500 mr-4" />
            <div>
              <h3 className="font-bold text-lg">Contracts</h3>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">Healthy</p>
            </div>
          </div>
        </Link>
        <Link href="/airflow" className="p-6 rounded-xl border border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/10 transition-colors shadow-sm flex items-center justify-between">
          <div className="flex items-center">
            <Wind size={28} className="text-yellow-500 mr-4" />
            <div>
              <h3 className="font-bold text-lg">Airflow</h3>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Warning</p>
            </div>
          </div>
        </Link>
        <Link href="/github" className="p-6 rounded-xl border border-green-500/30 bg-green-500/5 hover:bg-green-500/10 transition-colors shadow-sm flex items-center justify-between">
          <div className="flex items-center">
            <Github size={28} className="text-green-500 mr-4" />
            <div>
              <h3 className="font-bold text-lg">GitHub</h3>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">Healthy</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/incidents" className="p-6 rounded-xl border border-border bg-card hover:border-red-500/50 transition-colors shadow-sm flex flex-col justify-between">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-red-500/10 text-red-500 rounded-lg"><AlertCircle size={20} /></div>
            <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">Current Incidents</h3>
          </div>
          <div className="mt-2">
            <span className="text-4xl font-bold">3</span>
            <span className="text-sm font-medium text-red-500 ml-2">1 Critical</span>
          </div>
        </Link>

        <Link href="/pull-requests" className="p-6 rounded-xl border border-border bg-card hover:border-orange-500/50 transition-colors shadow-sm flex flex-col justify-between">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg"><GitPullRequest size={20} /></div>
            <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">High Risk PRs</h3>
          </div>
          <div className="mt-2">
            <span className="text-4xl font-bold">5</span>
          </div>
        </Link>

        <Link href="/airflow/dags" className="p-6 rounded-xl border border-border bg-card hover:border-yellow-500/50 transition-colors shadow-sm flex flex-col justify-between">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg"><XOctagon size={20} /></div>
            <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">Failed DAGs</h3>
          </div>
          <div className="mt-2">
            <span className="text-4xl font-bold">12</span>
          </div>
        </Link>

        <Link href="/teams" className="p-6 rounded-xl border border-border bg-card hover:border-blue-500/50 transition-colors shadow-sm flex flex-col justify-between">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><Users size={20} /></div>
            <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">Active Owners</h3>
          </div>
          <div className="mt-2 space-y-1">
            <p className="text-sm font-medium text-blue-500 truncate">Data Platform Team</p>
            <p className="text-sm font-medium text-blue-500 truncate">Analytics Team</p>
            <p className="text-sm font-medium text-blue-500 truncate">Finance Team</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
