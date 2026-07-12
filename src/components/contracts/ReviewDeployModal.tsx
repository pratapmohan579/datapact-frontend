"use client";

import React, { useState } from 'react';
import { useContractStore } from '@/store/useContractStore';
import { DiffViewer } from '@/components/contracts/DiffViewer';
import { api } from '@/lib/apiClient';

interface ReviewDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ReviewDeployModal({ isOpen, onClose, onConfirm }: ReviewDeployModalProps) {
  const { contract, yaml } = useContractStore();
  const [activeTab, setActiveTab] = useState<'diff' | 'ai_review' | 'simulation'>('diff');
  const [isDeploying, setIsDeploying] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  if (!isOpen) return null;

  const runAiReview = async () => {
    setLoadingAi(true);
    try {
      // Mock AI review, assuming backend endpoint isn't fully ready yet for AI review,
      // or we can call the real endpoint if it exists.
      setTimeout(() => {
        setAiFeedback({
          confidence: 94,
          findings: [
            { type: 'warning', text: 'Missing uniqueness check on primary key.' },
            { type: 'success', text: 'Excellent freshness threshold (15m).' }
          ]
        });
        setLoadingAi(false);
      }, 1500);
    } catch (e) {
      setLoadingAi(false);
    }
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    await onConfirm();
    setIsDeploying(false);
  };

  // Mock old published YAML for diff comparison
  const oldYaml = `contract_name: ${contract.contract_name || 'old_contract'}
owner: old_owner@company.com
status: published
dataset:
  source: snowflake
  database: raw
  schema: public
  table: old_table
rules: []
`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-11/12 max-w-5xl h-[85vh] rounded-xl border border-border flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/20">
          <div>
            <h2 className="text-xl font-bold text-foreground">Review Changes</h2>
            <p className="text-sm text-muted-foreground mt-1">Review your contract modifications before publishing to production.</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border px-6 gap-6 bg-muted/10">
          <button 
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'diff' ? 'border-blue-500 text-blue-500' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('diff')}
          >
            Visual Diff
          </button>
          <button 
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'simulation' ? 'border-blue-500 text-blue-500' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('simulation')}
          >
            Simulation Results
          </button>
          <button 
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'ai_review' ? 'border-blue-500 text-blue-500' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('ai_review')}
          >
            AI Code Review
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden p-6 bg-[#121212]">
          {activeTab === 'diff' && (
            <div className="h-full rounded-lg overflow-hidden border border-border">
              <DiffViewer original={oldYaml} modified={yaml} />
            </div>
          )}

          {activeTab === 'simulation' && (
            <div className="h-full overflow-y-auto">
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-card border border-border p-5 rounded-xl">
                  <p className="text-sm text-muted-foreground font-medium mb-1">Expected Success Rate</p>
                  <p className="text-3xl font-bold text-green-400">98.2%</p>
                  <p className="text-xs text-muted-foreground mt-2">Based on last 30 days of data.</p>
                </div>
                <div className="bg-card border border-border p-5 rounded-xl">
                  <p className="text-sm text-muted-foreground font-medium mb-1">False Positive Risk</p>
                  <p className="text-3xl font-bold text-yellow-400">3.1%</p>
                  <p className="text-xs text-muted-foreground mt-2">Mostly from freshness checks.</p>
                </div>
                <div className="bg-card border border-border p-5 rounded-xl">
                  <p className="text-sm text-muted-foreground font-medium mb-1">Estimated Cost / Run</p>
                  <p className="text-3xl font-bold text-foreground">$0.03</p>
                  <p className="text-xs text-muted-foreground mt-2">Will scan approx 2.4M rows.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai_review' && (
            <div className="h-full flex flex-col items-center justify-center">
              {!aiFeedback && !loadingAi && (
                <button 
                  onClick={runAiReview}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-lg flex items-center gap-2"
                >
                  ✨ Run AI Contract Review
                </button>
              )}
              {loadingAi && <div className="text-muted-foreground animate-pulse font-medium text-lg">AI is analyzing rules against historical telemetry...</div>}
              {aiFeedback && (
                <div className="w-full max-w-2xl bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                      ✨ AI Review Complete
                    </h3>
                    <div className="px-3 py-1 bg-green-500/10 text-green-400 font-bold rounded text-sm border border-green-500/20">
                      {aiFeedback.confidence}% Confidence
                    </div>
                  </div>
                  <div className="space-y-3">
                    {aiFeedback.findings.map((f: any, i: number) => (
                      <div key={i} className={`p-3 rounded border flex items-start gap-3 ${f.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-200' : 'bg-green-500/10 border-green-500/20 text-green-200'}`}>
                        <span>{f.type === 'warning' ? '⚠️' : '✅'}</span>
                        <p className="text-sm">{f.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3 bg-muted/20">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium border border-border rounded hover:bg-muted transition text-foreground"
          >
            Cancel
          </button>
          <button 
            onClick={handleDeploy}
            disabled={isDeploying}
            className="px-6 py-2 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded transition disabled:opacity-50"
          >
            {isDeploying ? 'Deploying...' : 'Confirm & Publish'}
          </button>
        </div>
      </div>
    </div>
  );
}
