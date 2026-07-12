"use client";

import { useState } from "react";
import { useAIStudioStore } from "@/store/ai-studio-store";
import { api } from "@/lib/apiClient";
import { Loader2, Sparkles, CheckCircle2, Play, Check, X, Edit, MessageSquareText } from "lucide-react";

export default function RecommendationEngine() {
  const { selectedAssetId, isGenerating, setIsGenerating, setActiveDrawer, setCurrentYaml } = useAIStudioStore();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // For the sake of UI we use a mock payload, but in a real scenario we'd call the /generate API
      await new Promise(r => setTimeout(r, 2000));
      const mockRules = [
        {
          id: 'rule-1',
          column: 'order_id',
          type: 'NOT NULL',
          confidence: 99,
          reason: 'Detected stable historical behavior',
          evidence: '0 nulls across 120 million rows during 90 days',
          sql_preview: 'SELECT count(*) FROM orders WHERE order_id IS NULL'
        },
        {
          id: 'rule-2',
          column: 'status',
          type: 'ACCEPTED VALUES',
          confidence: 97,
          reason: 'Categorical distribution is very tight',
          evidence: 'Only 4 distinct values observed: PENDING, SHIPPED, DELIVERED, CANCELLED',
          sql_preview: "SELECT status FROM orders WHERE status NOT IN ('PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED')"
        },
        {
          id: 'rule-3',
          column: 'amount',
          type: 'NUMERIC RANGE',
          confidence: 85,
          reason: 'Values rarely exceed typical purchase limits',
          evidence: '99.9% of transactions are between $0 and $5000',
          sql_preview: 'SELECT amount FROM orders WHERE amount < 0 OR amount > 5000'
        }
      ];
      setRecommendations(mockRules);
      setHasGenerated(true);
      
      // Update YAML editor with the generated rules
      const yamlStr = `version: 1\ncontract_name: ${selectedAssetId}_contract\ndataset: ${selectedAssetId}\nrules:\n  - type: not_null\n    column: order_id\n  - type: accepted_values\n    column: status\n    values: [PENDING, SHIPPED, DELIVERED, CANCELLED]\n  - type: numeric_range\n    column: amount\n    min: 0\n    max: 5000`;
      setCurrentYaml(yamlStr);
      
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!hasGenerated && !isGenerating) {
    return (
      <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col items-center justify-center p-8 text-center h-full">
        <div className="w-16 h-16 rounded-full bg-ai/10 flex items-center justify-center mb-6">
          <Sparkles className="w-8 h-8 text-ai" />
        </div>
        <h3 className="text-xl font-bold mb-2">AI Contract Generator</h3>
        <p className="text-muted-foreground max-w-sm mb-6">
          Let our AI analyze historical patterns, profiling stats, and schema metadata to automatically suggest data contracts.
        </p>
        <button 
          onClick={handleGenerate}
          className="bg-ai hover:bg-ai-dark text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all shadow-lg shadow-ai/20 hover:shadow-ai/40"
        >
          <Sparkles className="w-4 h-4" /> Generate Contract
        </button>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col items-center justify-center p-8 text-center h-full">
        <Loader2 className="w-12 h-12 animate-spin text-ai mb-6" />
        <h3 className="text-xl font-bold mb-2">Analyzing Dataset...</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-2 justify-center"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Profiling 120M rows...</p>
          <p className="flex items-center gap-2 justify-center"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Scanning schema metadata...</p>
          <p className="flex items-center gap-2 justify-center animate-pulse"><Play className="w-3 h-3 text-ai" /> Detecting behavioral patterns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-ai" />
          <h3 className="font-semibold text-foreground">AI Recommendations</h3>
        </div>
        <span className="text-xs font-medium px-2 py-1 bg-emerald-500/10 text-emerald-600 rounded-md">
          {recommendations.length} Rules Generated
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {recommendations.map(rule => (
          <div key={rule.id} className="border border-border rounded-lg p-4 bg-background hover:border-primary/30 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-bold">{rule.column}</span>
                  <span className="text-xs px-1.5 py-0.5 bg-secondary rounded text-muted-foreground">{rule.type}</span>
                </div>
                <p className="text-sm text-foreground">{rule.reason}</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-muted-foreground mb-1">Confidence</span>
                <span className={`text-sm font-bold ${rule.confidence > 95 ? 'text-emerald-500' : rule.confidence > 80 ? 'text-amber-500' : 'text-red-500'}`}>
                  {rule.confidence}%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/50">
              <button 
                onClick={() => setActiveDrawer('explainability')}
                className="text-xs flex items-center gap-1 text-muted-foreground hover:text-ai transition-colors mr-auto"
              >
                <MessageSquareText className="w-3.5 h-3.5" /> Why?
              </button>
              
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 rounded-md hover:bg-emerald-500/10 hover:text-emerald-500 text-muted-foreground" title="Accept">
                  <Check className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-md hover:bg-red-500/10 hover:text-red-500 text-muted-foreground" title="Reject">
                  <X className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground" title="Edit">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
