"use client";

import React from 'react';
import { useContractStore, ContractVersion } from '@/store/useContractStore';
import { formatDistanceToNow } from 'date-fns';
import { History, FileText, CheckCircle, RotateCcw } from 'lucide-react';

export function VersionHistoryPanel() {
  const { versions, selectedVersion, setSelectedVersion, setYaml, setContract, markSaved } = useContractStore();

  const handleSelectVersion = (version: ContractVersion) => {
    if (selectedVersion === version.version) {
      // Toggle off
      setSelectedVersion(null);
    } else {
      setSelectedVersion(version.version);
    }
  };

  const handleRollback = (version: ContractVersion) => {
    // A real rollback would POST to backend. Here we just set the store.
    setYaml(version.yaml);
    setSelectedVersion(null); // Return to standard editor
    markSaved(); // Save as new head
  };

  if (!versions || versions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-70 p-6 text-center">
        <History className="w-12 h-12 mb-4 opacity-50" />
        <h4 className="font-semibold text-foreground mb-1">No Version History</h4>
        <p className="text-sm">Save or deploy this contract to start tracking versions.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="px-4 py-3 border-b border-border bg-muted/20 flex items-center gap-2">
        <History className="w-4 h-4 text-muted-foreground" />
        <h3 className="font-semibold text-foreground text-sm">Version History</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
        {versions.map((v, i) => {
          const isLatest = i === 0;
          const isSelected = selectedVersion === v.version;
          
          return (
            <div 
              key={v.version}
              className={`p-3 rounded-lg border transition-all cursor-pointer relative ${
                isSelected 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-border bg-muted/10 hover:border-muted-foreground/30'
              }`}
              onClick={() => handleSelectVersion(v)}
            >
              {isLatest && (
                <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> CURRENT
                </div>
              )}
              
              <div className="flex justify-between items-start mb-2">
                <span className={`text-sm font-bold ${isSelected ? 'text-blue-400' : 'text-foreground'}`}>
                  Version {v.version}
                </span>
                <span className="text-xs text-muted-foreground" title={v.created_at}>
                  {formatDistanceToNow(new Date(v.created_at), { addSuffix: true })}
                </span>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                <FileText className="w-3 h-3" />
                <span>{v.change_summary}</span>
              </div>
              
              <div className="text-[10px] text-muted-foreground font-mono truncate">
                by {v.created_by}
              </div>

              {isSelected && !isLatest && (
                <div className="mt-3 pt-3 border-t border-blue-500/20 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRollback(v);
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Restore this version
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
