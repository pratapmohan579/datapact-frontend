"use client";

import { Handle, Position } from '@xyflow/react';

export default function CustomNode({ data }: any) {
  // Determine border color based on status
  let borderColor = "border-green-500/50";
  let statusTextClass = "text-green-400";
  
  if (data.status === "Warning") {
    borderColor = "border-yellow-500/50";
    statusTextClass = "text-yellow-400";
  } else if (data.status === "Failed") {
    borderColor = "border-red-500/50";
    statusTextClass = "text-red-400";
  }

  // Icons based on type
  const getIcon = () => {
    switch (data.node_type) {
      case "table": return "🗄️";
      case "view": return "👁️";
      case "dashboard": return "📊";
      case "pipeline": return "⚙️";
      case "ml_model": return "🤖";
      default: return "📄";
    }
  };

  return (
    <div className={`px-4 py-3 shadow-md rounded-xl bg-gray-900 border-2 ${borderColor} min-w-[200px] hover:shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer`}>
      <Handle type="target" position={Position.Top} className="w-16 !bg-gray-600 rounded-none h-1" />
      
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{getIcon()}</span>
          <div>
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{data.source_system}</div>
            <div className="text-sm font-bold text-foreground truncate max-w-[140px]">{data.name}</div>
          </div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-700/50 flex justify-between items-center">
        <div className="text-xs text-gray-500">{data.owner}</div>
        <div className={`text-xs font-bold ${statusTextClass}`}>
          {data.health_score} / 100
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-gray-600 rounded-none h-1" />
    </div>
  );
}
