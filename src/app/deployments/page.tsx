"use client"

import React, { useState } from 'react';
import { Rocket, Search, CheckCircle, XOctagon } from 'lucide-react';

const deployments = [
  { id: 'DEP-1001', repo: 'analytics', status: 'Success', date: '2 hours ago', risk: 'Low', reason: '-' },
  { id: 'DEP-1002', repo: 'finance', status: 'Blocked', date: '5 hours ago', risk: 'Critical', reason: 'Column Removed' },
  { id: 'DEP-1003', repo: 'marketing', status: 'Success', date: '1 day ago', risk: 'Medium', reason: '-' },
];

export default function DeploymentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDep, setSelectedDep] = useState<any>(null);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto text-foreground">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center">
            <Rocket className="mr-3 text-green-500" size={28} /> Deployment History
          </h1>
          <p className="text-muted-foreground">Audit log of all successful and blocked data deployments.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3 border border-border rounded-xl bg-card shadow-sm overflow-hidden flex flex-col">
          <div className="bg-secondary/50 p-4 border-b border-border flex justify-between items-center">
            <h2 className="font-semibold">All Deployments</h2>
          </div>
          <div className="overflow-auto flex-1">
             <table className="w-full text-left">
              <thead className="bg-secondary text-muted-foreground text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold">Deployment</th>
                  <th className="px-4 py-3 font-semibold">Repository</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {deployments.map((dep) => (
                  <tr 
                    key={dep.id} 
                    className={`hover:bg-secondary/50 cursor-pointer transition-colors ${selectedDep?.id === dep.id ? 'bg-secondary/50 border-l-4 border-blue-500' : ''}`}
                    onClick={() => setSelectedDep(dep)}
                  >
                    <td className="px-4 py-4 font-bold font-mono">{dep.id}</td>
                    <td className="px-4 py-4 text-sm font-mono">{dep.repo}</td>
                    <td className="px-4 py-4">
                      {dep.status === 'Success' ? (
                        <span className="flex items-center text-green-500 text-xs font-bold uppercase"><CheckCircle size={14} className="mr-1" /> Success</span>
                      ) : (
                        <span className="flex items-center text-red-500 text-xs font-bold uppercase"><XOctagon size={14} className="mr-1" /> Blocked</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-xs text-muted-foreground">{dep.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedDep ? (
          <div className="w-full md:w-1/3 border border-border rounded-xl bg-card shadow-sm flex flex-col p-6 h-fit">
            <h2 className="text-xl font-bold mb-4 border-b border-border pb-2">Deployment Detail</h2>
            <div className="space-y-4">
              <div>
                <span className="text-xs text-muted-foreground block mb-1 uppercase tracking-wider">ID</span>
                <span className="font-mono font-bold text-lg">{selectedDep.id}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block mb-1 uppercase tracking-wider">Status</span>
                <span className={`px-2 py-1 inline-flex items-center rounded text-sm font-bold uppercase ${selectedDep.status === 'Success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {selectedDep.status}
                </span>
              </div>
              
              {selectedDep.status === 'Blocked' && (
                <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg mt-4 space-y-3">
                  <h3 className="font-bold text-red-500 flex items-center">
                    <XOctagon size={18} className="mr-2" /> Block Reason
                  </h3>
                  <div>
                    <span className="text-xs text-muted-foreground block">Trigger</span>
                    <span className="font-mono text-sm">{selectedDep.reason}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Affected Assets</span>
                    <span className="font-bold">12</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Risk Engine Verdict</span>
                    <span className="font-black text-red-500 uppercase">{selectedDep.risk}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full md:w-1/3 border border-dashed border-border rounded-xl bg-secondary/20 flex items-center justify-center text-muted-foreground h-64">
            Select a deployment to view details
          </div>
        )}
      </div>
    </div>
  );
}
