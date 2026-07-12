"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';
import { AlertCircle, ArrowRight, ShieldAlert, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function IncidentsPage() {
  const router = useRouter();
  
  const { data: incidentsData = [], isLoading, isError } = useQuery({
    queryKey: ["incidents"],
    queryFn: () => api.get<any[]>("/incidents"),
  });

  if (isError) {
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      router.push("/auth/login");
    }
  }

  if (isLoading) {
    return <div className="flex justify-center py-20 text-foreground">Loading Incidents...</div>;
  }

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto text-foreground animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Operations Center</h1>
          <p className="text-muted-foreground">Triage and investigate active data incidents with AI.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {incidentsData.length === 0 ? (
          <div className="col-span-full p-12 text-center text-muted-foreground bg-card border border-border rounded-xl">
            <CheckCircle size={48} className="mx-auto mb-4 text-green-500 opacity-50" />
            <h2 className="text-xl font-bold text-foreground">All Systems Operational</h2>
            <p>No active incidents at the moment.</p>
          </div>
        ) : (
          incidentsData.map((inc, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              key={inc.id}
              onClick={() => router.push(`/incidents/${inc.id}`)}
              className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md hover:border-indigo-500/50 cursor-pointer transition-all group relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-1 h-full ${inc.status === 'OPEN' ? 'bg-red-500' : 'bg-gray-500'}`}></div>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${inc.status === 'OPEN' ? 'bg-red-500/10 text-red-500' : 'bg-gray-500/10 text-gray-500'}`}>
                  {inc.status === 'OPEN' ? <ShieldAlert size={24} /> : <CheckCircle size={24} />}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-bold tracking-wider ${inc.status === 'OPEN' ? 'bg-red-500/10 text-red-500' : 'bg-gray-500/10 text-gray-500'}`}>
                  {inc.status}
                </span>
              </div>
              
              <h3 className="font-bold text-lg mb-1 group-hover:text-indigo-500 transition-colors">INC-{inc.id}</h3>
              <p className="text-sm font-medium mb-4">{inc.severity} Validation Failure</p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Asset</span>
                  <span className="text-sm font-mono truncate max-w-[150px]">{inc.asset_id}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  <ArrowRight size={16} />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
