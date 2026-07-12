"use client";

import { CheckCircle2, CircleDashed, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const SOURCES = [
  { name: "PostgreSQL", status: "completed", progress: 100, stage: "Publishing Complete", duration: "1m 42s", assets: 412 },
  { name: "Snowflake", status: "running", progress: 78, stage: "Statistics Collection", duration: "3m 15s", assets: 841 },
  { name: "Delta Lake", status: "running", progress: 92, stage: "Classification", duration: "4m 10s", assets: 32 },
  { name: "BigQuery", status: "running", progress: 15, stage: "Schema Discovery", duration: "0m 45s", assets: 0 },
];

export function ScanProgressTimeline() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-8">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Loader2 className="animate-spin text-blue-500" size={20} />
        Live Scan Progress
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SOURCES.map((source, idx) => (
          <motion.div 
            key={source.name} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="border border-border/50 bg-secondary/20 rounded-lg p-5 flex flex-col gap-3"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {source.status === "completed" ? (
                  <CheckCircle2 className="text-green-500" size={18} />
                ) : (
                  <CircleDashed className="text-blue-500 animate-spin-slow" size={18} />
                )}
                <span className="font-semibold text-foreground">{source.name}</span>
              </div>
              <span className="text-sm font-medium text-muted-foreground">{source.progress}%</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full ${source.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}`}
                initial={{ width: 0 }}
                animate={{ width: `${source.progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-muted-foreground">
              <div>
                <span className="block text-foreground/50 mb-0.5">Stage</span>
                <span className="font-medium text-foreground truncate">{source.stage}</span>
              </div>
              <div>
                <span className="block text-foreground/50 mb-0.5">Duration</span>
                <span className="font-medium text-foreground">{source.duration}</span>
              </div>
              <div>
                <span className="block text-foreground/50 mb-0.5">Assets Found</span>
                <span className="font-medium text-foreground">{source.assets}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
