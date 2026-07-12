"use client";

import { Terminal } from "lucide-react";

export function DiscoveryLogsConsole() {
  return (
    <div className="bg-[#0D1117] border border-[#30363D] rounded-xl shadow-sm overflow-hidden font-mono text-sm">
      <div className="bg-[#161B22] border-b border-[#30363D] px-4 py-2 flex items-center gap-2 text-[#8B949E]">
        <Terminal size={14} />
        <span>Discovery Logs</span>
      </div>
      <div className="p-4 h-64 overflow-y-auto text-[#C9D1D9] space-y-1 custom-scrollbar">
        <div className="flex gap-4"><span className="text-[#8B949E]">09:20:01</span><span className="text-blue-400">[INFO]</span><span>Connecting to postgresql://prod-db.internal...</span></div>
        <div className="flex gap-4"><span className="text-[#8B949E]">09:20:05</span><span className="text-green-400">[SUCCESS]</span><span>Connection established.</span></div>
        <div className="flex gap-4"><span className="text-[#8B949E]">09:21:12</span><span className="text-blue-400">[INFO]</span><span>Discovering schemas... Found 14 schemas.</span></div>
        <div className="flex gap-4"><span className="text-[#8B949E]">09:21:45</span><span className="text-blue-400">[INFO]</span><span>Discovering tables in 'Sales' schema... Found 12 tables.</span></div>
        <div className="flex gap-4"><span className="text-[#8B949E]">09:22:10</span><span className="text-blue-400">[INFO]</span><span>Collecting statistics for 'Orders'...</span></div>
        <div className="flex gap-4"><span className="text-[#8B949E]">09:22:55</span><span className="text-yellow-400">[WARN]</span><span>Table 'legacy_logs' is too large (4.2TB). Skipping deep profiling.</span></div>
        <div className="flex gap-4"><span className="text-[#8B949E]">09:23:20</span><span className="text-blue-400">[INFO]</span><span>Running AI classification model...</span></div>
        <div className="flex gap-4"><span className="text-[#8B949E]">09:23:45</span><span className="text-blue-400">[INFO]</span><span>Publishing metadata to DataPact Cloud...</span></div>
        <div className="flex gap-4"><span className="text-[#8B949E]">09:24:00</span><span className="text-green-400">[SUCCESS]</span><span>Discovery completed successfully. 1,284 assets synced.</span></div>
        <div className="flex gap-4 animate-pulse"><span className="text-[#8B949E]">09:24:01</span><span className="text-blue-400">[INFO]</span><span>Waiting for next scheduled run...</span></div>
      </div>
    </div>
  );
}
