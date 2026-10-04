"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Target, Activity, FileJson, Play, Save, History, BookOpen } from 'lucide-react';
import Editor from '@monaco-editor/react';

// Mock Contract Variants
const variants = {
  balanced: `dataset: analytics.fct_sales
schema:
  columns:
    - name: order_id
      type: string
      rules:
        - type: not_null
        - type: unique
    - name: amount
      type: float
      rules:
        - type: not_null
        - type: min
          value: 0
    - name: status
      type: string
      rules:
        - type: accepted_values
          values: ['pending', 'shipped', 'delivered', 'cancelled']
metrics:
  - type: row_count
    min: 1000
  - type: freshness
    max_delay: 24h
`,
  strict: `dataset: analytics.fct_sales
schema:
  columns:
    - name: order_id
      type: string
      rules:
        - type: not_null
        - type: unique
    - name: amount
      type: float
      rules:
        - type: not_null
        - type: min
          value: 0.01
    - name: status
      type: string
      rules:
        - type: accepted_values
          values: ['pending', 'shipped', 'delivered', 'cancelled']
metrics:
  - type: row_count
    min: 5000
  - type: freshness
    max_delay: 1h
`,
  relaxed: `dataset: analytics.fct_sales
schema:
  columns:
    - name: order_id
      type: string
      rules:
        - type: not_null
metrics:
  - type: freshness
    max_delay: 48h
`
};

export default function ContractGenerationWizard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [activeVariant, setActiveVariant] = useState<'balanced'|'strict'|'relaxed'>('balanced');
  const [yamlContent, setYamlContent] = useState(variants.balanced);
  const [activeStep, setActiveStep] = useState(3);
  
  const handleVariantChange = (variant: 'balanced'|'strict'|'relaxed') => {
    setActiveVariant(variant);
    setYamlContent(variants[variant]);
  };

  const steps = [
    "AI Analysis", "Recommendations", "Review & Compare", "Simulation", "Approval"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-h-screen">
      
      {/* Top Navigation */}
      <header className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-border glass z-10">
        <div className="flex items-center gap-4">
          <Link href="/ai/contracts">
            <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Contract Studio <span className="text-muted-foreground font-normal">/</span> analytics.fct_sales
            </h1>
            <div className="flex items-center gap-4 text-sm mt-1">
              <span className="text-green-400 font-medium">AI Confidence: 94%</span>
              <span className="text-muted-foreground text-xs bg-secondary px-2 py-0.5 rounded">Policies: GDPR, Finance Standard</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg text-sm hover:bg-muted transition-colors border border-border">
            <Play className="w-4 h-4" /> Run Simulation
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            <Save className="w-4 h-4" /> Approve & Deploy
          </button>
        </div>
      </header>

      {/* Progress Wizard */}
      <div className="flex-shrink-0 px-8 py-4 bg-background border-b border-border flex justify-center items-center">
        <div className="flex items-center gap-2 w-full max-w-4xl">
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                  idx < activeStep ? 'bg-green-500 border-green-500 text-black' : 
                  idx === activeStep ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 
                  'bg-secondary border-border text-muted-foreground'
                }`}>
                  {idx < activeStep ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                </div>
                <span className={`text-xs font-medium ${idx === activeStep ? 'text-white' : 'text-muted-foreground'}`}>
                  {step}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`h-1 w-full flex-1 rounded ${idx < activeStep ? 'bg-green-500' : 'bg-secondary'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Split Screen Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: AI Reasoning & Suggestions */}
        <div className="w-1/2 flex flex-col border-r border-border bg-background/50 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">AI Reasoning & Evidence</h2>
            
            <div className="flex bg-secondary p-1 rounded-lg">
              {(['strict', 'balanced', 'relaxed'] as const).map(variant => (
                <button 
                  key={variant}
                  onClick={() => handleVariantChange(variant)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${activeVariant === variant ? 'bg-blue-500 text-white shadow-md' : 'text-muted-foreground hover:text-white'}`}
                >
                  {variant}
                </button>
              ))}
            </div>
          </div>

          {/* Reasoning Cards */}
          <ReasoningCard 
            title="Freshness SLA: 24h"
            confidence={98}
            rationale="Historical analysis shows fct_sales is updated via Airflow DAG 'daily_sales' at 02:00 UTC every day. 24h delay covers the standard interval with 0% false positives historically."
            evidence="Pattern Detection: Daily Batch"
          />

          <ReasoningCard 
            title="Null Constraints: order_id, amount"
            confidence={95}
            rationale="Statistical profile indicates these columns have 0% nulls over the last 90 days. Lineage shows they are used in Executive Dashboards which break if nulls exist."
            evidence="Lineage Impact: High"
          />

          <ReasoningCard 
            title="Value Constraint: status in ['pending', 'shipped',...]"
            confidence={89}
            rationale="Based on 2.4M rows analyzed, only 4 distinct values exist. Added to prevent data drift."
            evidence="Statistical Profiling"
          />

          <div className="mt-8">
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              Simulation Results (90 Days)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary/50 p-4 rounded-xl border border-border">
                <div className="text-xs text-muted-foreground mb-1">Incidents Prevented</div>
                <div className="text-2xl font-bold text-green-400">14</div>
              </div>
              <div className="bg-secondary/50 p-4 rounded-xl border border-border">
                <div className="text-xs text-muted-foreground mb-1">False Positives</div>
                <div className="text-2xl font-bold text-white">0</div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Panel: Live YAML Editor */}
        <div className="w-1/2 flex flex-col bg-[#1e1e1e]">
          <div className="px-4 py-2 border-b border-[#333] flex justify-between items-center bg-[#252526]">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <FileJson className="w-4 h-4" />
              contract.yaml
            </div>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="yaml"
              theme="vs-dark"
              value={yamlContent}
              onChange={(value) => setYamlContent(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineHeight: 24,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
              }}
            />
          </div>
        </div>
        
      </div>
    </div>
  );
}

interface ReasoningCardProps {
  title: string;
  confidence: number;
  rationale: string;
  evidence: string;
}

function ReasoningCard({ title, confidence, rationale, evidence }: ReasoningCardProps) {
  return (
    <div className="glass p-5 rounded-xl border border-border hover:border-blue-500/50 transition-colors group cursor-pointer relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <BookOpen className="w-4 h-4 text-blue-400" />
      </div>
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-white pr-8">{title}</h4>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Confidence</span>
          <span className="text-sm font-bold text-green-400">{confidence}%</span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{rationale}</p>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium px-2 py-1 bg-secondary text-muted-foreground rounded flex items-center gap-1">
          <Target className="w-3 h-3" /> {evidence}
        </span>
      </div>
    </div>
  );
}
