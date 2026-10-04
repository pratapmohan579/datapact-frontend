"use client";

import { useSyncExternalStore } from "react";
import { useAIStudioStore } from "@/store/ai-studio-store";
import AssetBrowser from "@/components/ai-studio/AssetBrowser";
import AssetOverview from "@/components/ai-studio/AssetOverview";
import RecommendationEngine from "@/components/ai-studio/RecommendationEngine";
import YamlEditor from "@/components/ai-studio/YamlEditor";
import ExplainabilityDrawer from "@/components/ai-studio/ExplainabilityDrawer";
import AICopilotDrawer from "@/components/ai-studio/AICopilotDrawer";
import { Loader2, Sparkles } from "lucide-react";

const emptySubscribe = () => () => {};

export default function AIContractStudioPage() {
  const { selectedAssetId, activeDrawer, isAssetBrowserOpen, setActiveDrawer } = useAIStudioStore();
  const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  if (!isMounted) return <div className="h-full flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-ai" /></div>;

  return (
    <div className="h-[calc(100vh-4rem)] -m-6 flex overflow-hidden bg-background">
      {/* Left Sidebar: Asset Browser */}
      {isAssetBrowserOpen && (
        <div className="w-72 border-r border-border h-full flex-shrink-0 flex flex-col bg-card/50">
          <AssetBrowser />
        </div>
      )}

      {/* Center Panel: Data & YAML */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">
        {/* Floating Copilot Button */}
        {activeDrawer !== 'copilot' && (
          <button 
            onClick={() => setActiveDrawer('copilot')}
            className="absolute bottom-6 right-6 z-30 p-3 rounded-full bg-ai hover:bg-ai-dark text-white shadow-lg shadow-ai/30 transition-all transform hover:scale-105 flex items-center justify-center"
            title="Ask AI Copilot"
          >
            <Sparkles className="h-6 w-6" />
          </button>
        )}

        {!selectedAssetId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-ai/10 flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-ai" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">AI Contract Studio</h2>
            <p className="text-muted-foreground max-w-md">
              Select a dataset from the Asset Browser to automatically profile it, generate data contracts, and deploy them to production.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-6 flex-1 flex flex-col mx-auto w-full max-w-7xl">
            <AssetOverview />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1 min-h-[600px]">
              <RecommendationEngine />
              <YamlEditor />
            </div>
          </div>
        )}
      </div>

      {/* Right Drawer: Context */}
      {activeDrawer !== 'none' && (
        <div className="w-[450px] border-l border-border h-full flex-shrink-0 bg-card shadow-2xl z-40 transition-all duration-300">
          {activeDrawer === 'explainability' && <ExplainabilityDrawer />}
          {activeDrawer === 'copilot' && <AICopilotDrawer />}
        </div>
      )}
    </div>
  );
}
