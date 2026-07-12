"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';
import { AlertCircle, BrainCircuit, CheckCircle, Database, GitBranch, ArrowLeft, TerminalSquare, AlertTriangle, FileText, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IncidentWarRoom() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const incidentId = params.id as string;

  const [isInvestigating, setIsInvestigating] = useState(false);

  // Fetch Incident Details (Mocked for now, assuming GET /incidents/{id} exists, or just use the list endpoint and filter)
  const { data: incidentsData = [] } = useQuery({
    queryKey: ["incidents"],
    queryFn: () => api.get<any[]>("/incidents"),
  });
  const incident = incidentsData.find((i: any) => i.id.toString() === incidentId);

  // Fetch AI Investigation Data
  const { data: reasonData, refetch: refetchReason } = useQuery({
    queryKey: ["incidentReason", incidentId],
    queryFn: () => api.get<any>(`/incidents/${incidentId}/reason`),
  });

  const { data: evidenceData, refetch: refetchEvidence } = useQuery({
    queryKey: ["incidentEvidence", incidentId],
    queryFn: () => api.get<any[]>(`/incidents/${incidentId}/evidence`),
  });

  const investigateMutation = useMutation({
    mutationFn: () => api.post(`/incidents/${incidentId}/investigate`, {}),
    onSuccess: () => {
      refetchReason();
      refetchEvidence();
      setIsInvestigating(false);
    }
  });

  const acceptFixMutation = useMutation({
    mutationFn: () => api.post(`/incidents/${incidentId}/accept-fix`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidentReason", incidentId] });
      alert("Fix deployed successfully!");
    }
  });

  const handleInvestigate = () => {
    setIsInvestigating(true);
    investigateMutation.mutate();
  };

  if (!incident) {
    return <div className="p-8">Loading incident or not found...</div>;
  }

  const hasAIResult = !!reasonData;
  const fix = reasonData?.suggested_fix;
  const isFixAccepted = fix?.status === 'ACCEPTED';

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto text-foreground animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => router.push('/incidents')} className="p-2 hover:bg-secondary rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className={`p-3 rounded-xl ${incident.status === 'OPEN' ? 'bg-red-500/10 text-red-500' : 'bg-gray-500/10 text-gray-500'}`}>
            <AlertCircle size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">INC-{incident.id}</h1>
            <p className="text-muted-foreground">{incident.severity} Validation Failure on {incident.asset_id}</p>
          </div>
        </div>
        <div>
          {!hasAIResult && (
             <button 
               onClick={handleInvestigate} 
               disabled={isInvestigating}
               className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md flex items-center space-x-2 disabled:opacity-70 disabled:cursor-wait"
             >
               <BrainCircuit size={18} className={isInvestigating ? "animate-pulse" : ""} />
               <span>{isInvestigating ? "AI is investigating..." : "Investigate with AI"}</span>
             </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Left Column: Timeline & Evidence */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Reasoning / Timeline */}
          {hasAIResult && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-xl p-6 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
              <h2 className="text-lg font-bold flex items-center mb-4 text-indigo-500">
                <BrainCircuit size={20} className="mr-2" /> AI Root Cause Analysis
              </h2>
              
              <div className="bg-indigo-500/5 p-4 rounded-lg border border-indigo-500/20 mb-6">
                <p className="font-semibold text-lg">{reasonData.reason.root_cause}</p>
              </div>

              <h3 className="font-semibold mb-4 flex items-center"><GitBranch size={16} className="mr-2" /> Chain of Events</h3>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                {reasonData.reason.chain_of_events.map((event: string, idx: number) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-card shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                       <span className="text-xs font-bold text-muted-foreground">{idx + 1}</span>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-border bg-card shadow-sm">
                      <p className="text-sm font-medium">{event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Evidence Collected */}
          {evidenceData && evidenceData.length > 0 && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
               className="bg-card border border-border rounded-xl p-6 shadow-sm"
             >
                <h2 className="text-lg font-bold flex items-center mb-4">
                  <Database size={20} className="mr-2" /> Evidence Collected
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {evidenceData.map((ev: any, idx: number) => (
                    <div key={idx} className="p-4 bg-secondary/30 rounded-lg border border-border/50">
                       <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center">
                         {ev.evidence_type === 'AIRFLOW_LOGS' && <TerminalSquare size={14} className="mr-1" />}
                         {ev.evidence_type === 'SCHEMA_HISTORY' && <FileText size={14} className="mr-1" />}
                         {ev.evidence_type === 'DBT_LINEAGE' && <GitBranch size={14} className="mr-1" />}
                         {ev.evidence_type}
                       </div>
                       <pre className="text-xs font-mono bg-background p-2 rounded border border-border/50 overflow-x-auto text-blue-400">
                         {JSON.stringify(ev.content, null, 2)}
                       </pre>
                    </div>
                  ))}
                </div>
             </motion.div>
          )}

        </div>

        {/* Right Column: Fix & Impact */}
        <div className="space-y-6">
          {hasAIResult && fix && (
             <motion.div 
               initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
               className="bg-card border border-green-500/30 rounded-xl p-6 shadow-sm relative overflow-hidden"
             >
                <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
                <h2 className="text-lg font-bold flex items-center mb-2 text-green-600 dark:text-green-500">
                  <CheckCircle size={20} className="mr-2" /> Suggested Fix
                </h2>
                <div className="inline-block bg-green-500/10 text-green-600 text-xs px-2 py-1 rounded font-bold tracking-wider mb-4">
                  {fix.action}
                </div>
                <p className="text-sm mb-6 leading-relaxed">
                  {fix.description}
                </p>
                
                {isFixAccepted ? (
                  <div className="w-full py-2.5 rounded-lg text-sm font-bold bg-green-500/20 text-green-600 flex items-center justify-center">
                    <Check size={18} className="mr-2" /> Fix Deployed
                  </div>
                ) : (
                  <button 
                    onClick={() => acceptFixMutation.mutate()}
                    disabled={acceptFixMutation.isPending}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md flex items-center justify-center disabled:opacity-70"
                  >
                    {acceptFixMutation.isPending ? "Deploying..." : "Accept & Deploy Fix"}
                  </button>
                )}
             </motion.div>
          )}

          {/* Impact Blast Radius */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
             <h2 className="text-lg font-bold flex items-center mb-4">
               <AlertTriangle size={20} className="mr-2 text-orange-500" /> Blast Radius
             </h2>
             <div className="space-y-4">
               <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                 <span className="text-sm font-medium">Downstream Dashboards</span>
                 <span className="font-bold text-red-500">4 Affected</span>
               </div>
               <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                 <span className="text-sm font-medium">Dependent Pipelines</span>
                 <span className="font-bold text-orange-500">2 Delayed</span>
               </div>
               <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                 <span className="text-sm font-medium">Data Consumers</span>
                 <span className="font-bold">12 Users</span>
               </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
