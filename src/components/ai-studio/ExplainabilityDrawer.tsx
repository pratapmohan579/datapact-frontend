"use client";

import { X, ExternalLink, Lightbulb, BarChart3, Database } from "lucide-react";
import { useAIStudioStore } from "@/store/ai-studio-store";

export default function ExplainabilityDrawer() {
  const { setActiveDrawer } = useAIStudioStore();

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" /> AI Explainability
        </h3>
        <button 
          onClick={() => setActiveDrawer('none')}
          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Why this rule section */}
        <section>
          <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">Why this rule?</h4>
          <div className="p-4 bg-muted/50 rounded-lg border border-border text-sm leading-relaxed text-foreground">
            The AI observed that the <code>order_id</code> column in <code>snowflake.analytics.orders</code> has never contained a NULL value across 120 million rows historically over the last 90 days. Enforcing a NOT NULL constraint prevents upstream pipeline failures caused by incomplete records.
          </div>
        </section>

        {/* Evidence Section */}
        <section>
          <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">Evidence Sources</h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 border border-border rounded-lg bg-background">
              <BarChart3 className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Historical Data Profile</p>
                <p className="text-xs text-muted-foreground mt-1">120,432,001 rows scanned. 0 nulls detected.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 border border-border rounded-lg bg-background">
              <Database className="w-5 h-5 text-emerald-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Schema Metadata</p>
                <p className="text-xs text-muted-foreground mt-1">Column is designated as a Primary Key in upstream dbt model.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SQL Preview */}
        <section>
          <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">Underlying Query</h4>
          <div className="p-4 bg-[#1e1e1e] rounded-lg border border-border">
            <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap">
              <span className="text-blue-400">SELECT</span> count(*) <br/>
              <span className="text-blue-400">FROM</span> snowflake.analytics.orders <br/>
              <span className="text-blue-400">WHERE</span> order_id <span className="text-blue-400">IS NULL</span>
            </pre>
          </div>
          <button className="text-xs mt-3 flex items-center gap-1 text-ai hover:underline">
            Open in Playground <ExternalLink className="w-3 h-3" />
          </button>
        </section>
      </div>
    </div>
  );
}
