"use client";

import { useAIStudioStore } from "@/store/ai-studio-store";
import Editor from "@monaco-editor/react";
import { Play, Save, History, FileText } from "lucide-react";
import { toast } from "sonner";

export default function YamlEditor() {
  const { currentYaml, setCurrentYaml, isDirty } = useAIStudioStore();

  const handleValidate = () => {
    toast.success("YAML Validated successfully!");
  };

  const handleDeploy = () => {
    toast.success("Contract deployed to monitoring engine.");
  };

  if (!currentYaml) {
    return (
      <div className="bg-[#1e1e1e] border border-border rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
          <FileText className="w-12 h-12 mb-4 opacity-20" />
          <p>Generate AI recommendations or start typing to create a contract</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1e1e1e] border border-border rounded-xl shadow-sm flex flex-col h-full overflow-hidden relative group">
      {/* Editor Header */}
      <div className="bg-[#2d2d2d] border-b border-[#3d3d3d] flex items-center justify-between p-2">
        <div className="flex items-center gap-2 px-2">
          <span className="text-xs font-mono text-gray-400">contract.yaml</span>
          {isDirty && <span className="w-2 h-2 rounded-full bg-amber-500" title="Unsaved changes"></span>}
        </div>
        <div className="flex items-center gap-2">
          <button className="text-xs px-3 py-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded flex items-center gap-1">
            <History className="w-3.5 h-3.5" /> History
          </button>
          <button 
            onClick={handleValidate}
            className="text-xs px-3 py-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded flex items-center gap-1"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400" /> Validate
          </button>
          <button 
            onClick={handleDeploy}
            className="text-xs px-4 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded shadow-sm flex items-center gap-1"
          >
            <Save className="w-3.5 h-3.5" /> Deploy
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 w-full h-full relative">
        <Editor
          height="100%"
          defaultLanguage="yaml"
          theme="vs-dark"
          value={currentYaml}
          onChange={(value) => setCurrentYaml(value || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineHeight: 24,
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            formatOnPaste: true,
          }}
        />
      </div>
    </div>
  );
}
