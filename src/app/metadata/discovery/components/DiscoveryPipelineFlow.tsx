"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";

const STAGES = [
  { id: "auth", label: "Authentication", status: "success" },
  { id: "schema", label: "Schema Discovery", status: "success" },
  { id: "table", label: "Table Discovery", status: "success" },
  { id: "column", label: "Column Discovery", status: "success" },
  { id: "relationship", label: "Relationship Detection", status: "running" },
  { id: "stats", label: "Statistics Collection", status: "pending" },
  { id: "classify", label: "Classification", status: "pending" },
  { id: "publish", label: "Publishing", status: "pending" },
];

export function DiscoveryPipelineFlow() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-8 overflow-x-auto custom-scrollbar">
      <h2 className="text-xl font-bold mb-6">Discovery Pipeline (Snowflake)</h2>
      
      <div className="flex items-center min-w-max pb-4 px-2">
        {STAGES.map((stage, idx) => (
          <div key={stage.id} className="flex items-center">
            {/* Node */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`flex flex-col items-center justify-center w-32 gap-2 relative`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border-2 z-10 bg-card
                ${stage.status === 'success' ? 'border-green-500 text-green-500' : 
                  stage.status === 'running' ? 'border-blue-500 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 
                  'border-muted text-muted-foreground'}`}
              >
                {stage.status === 'success' && <Check size={20} strokeWidth={3} />}
                {stage.status === 'running' && <Loader2 size={20} className="animate-spin" />}
                {stage.status === 'pending' && <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />}
              </div>
              <span className={`text-xs font-semibold text-center leading-tight
                ${stage.status === 'success' ? 'text-green-600' : 
                  stage.status === 'running' ? 'text-blue-600' : 
                  'text-muted-foreground'}`}
              >
                {stage.label}
              </span>
            </motion.div>
            
            {/* Edge */}
            {idx < STAGES.length - 1 && (
              <div className="w-12 relative flex items-center justify-center -mx-2 -mt-6">
                <div className={`h-1 w-full absolute ${stage.status === 'success' ? 'bg-green-500' : 'bg-muted/50'}`} />
                <ArrowRight size={14} className={`z-10 bg-card ${stage.status === 'success' ? 'text-green-500' : 'text-muted-foreground'}`} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
