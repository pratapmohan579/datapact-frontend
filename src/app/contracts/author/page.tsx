"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useHotkeys } from 'react-hotkeys-hook';
import { toast } from 'sonner';
import { History, Save, Send, Check, Play, Archive, Pause } from 'lucide-react';

import { useContractStore, ContractStatus } from '@/store/useContractStore';
import { VisualBuilder } from '@/components/contracts/VisualBuilder';
import { YamlEditor } from '@/components/contracts/YamlEditor';
import { DiffViewer } from '@/components/contracts/DiffViewer';
import { LivePreviewPanel } from '@/components/contracts/LivePreviewPanel';
import { TemplateMarketplace } from '@/components/contracts/TemplateMarketplace';
import { VersionHistoryPanel } from '@/components/contracts/VersionHistoryPanel';
import { ReviewDeployModal } from '@/components/contracts/ReviewDeployModal';

export default function ContractAuthoringPage() {
  const router = useRouter();
  const { 
    contract, yaml, setYaml, setContract, isDirty, isYamlValid, 
    markSaved, versions, selectedVersion 
  } = useContractStore();
  
  const [showTemplates, setShowTemplates] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Keyboard Shortcuts
  useHotkeys('ctrl+s, cmd+s', (e) => {
    e.preventDefault();
    handleSaveDraft();
  }, { enableOnFormTags: true });

  const handleSaveDraft = () => {
    if (!isYamlValid) {
      toast.error('Cannot save draft: YAML syntax is invalid');
      return;
    }
    markSaved();
    toast.success('Draft saved and version created');
  };

  const handleStatusChange = (newStatus: ContractStatus) => {
    setContract(prev => ({ ...prev, status: newStatus }));
    toast.success(`Contract moved to ${newStatus}`);
    markSaved();
  };

  const executeDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => {
      handleStatusChange('published');
      setIsDeploying(false);
      setShowReviewModal(false);
    }, 1000);
  };

  const getStatusBadge = (status: ContractStatus) => {
    const map = {
      draft: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
      review: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      approved: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      published: 'bg-green-500/10 text-green-400 border-green-500/20',
      paused: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      deprecated: 'bg-red-500/10 text-red-400 border-red-500/20',
      archived: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-bold border uppercase tracking-wider ${map[status] || map.draft}`}>
        {status}
      </span>
    );
  };

  // Determine what to show in the right panel
  const selectedVersionObj = versions.find(v => v.version === selectedVersion);
  const showDiffViewer = selectedVersionObj !== undefined;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="h-14 border-b border-border flex items-center justify-between px-4 shrink-0 bg-card">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-muted-foreground hover:text-foreground">
            &larr; Back
          </button>
          <div className="h-4 w-px bg-border" />
          <h1 className="font-bold text-foreground flex items-center gap-3">
            {contract.contract_name || 'Untitled Contract'}
            {getStatusBadge(contract.status)}
            {isDirty && <span className="text-xs text-yellow-500 font-normal">● Unsaved Changes</span>}
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setShowHistory(!showHistory); setShowTemplates(false); }}
            className={`px-3 py-1.5 text-sm font-medium border rounded transition flex items-center gap-2 ${showHistory ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'border-border hover:bg-muted'}`}
          >
            <History className="w-4 h-4" />
            History
          </button>
          
          <button 
            onClick={handleSaveDraft}
            className="px-3 py-1.5 text-sm font-medium border border-border rounded hover:bg-muted transition flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-muted-foreground" />
            Save Draft
          </button>

          <div className="h-4 w-px bg-border mx-1" />

          {/* Dynamic Lifecycle Actions */}
          {contract.status === 'draft' && (
            <button 
              onClick={() => handleStatusChange('review')}
              disabled={!isYamlValid}
              className="px-4 py-1.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded transition disabled:opacity-50 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Request Review
            </button>
          )}
          
          {contract.status === 'review' && (
            <>
              <button 
                onClick={() => handleStatusChange('draft')}
                className="px-3 py-1.5 text-sm font-medium border border-border rounded hover:bg-muted transition"
              >
                Cancel Review
              </button>
              <button 
                onClick={() => handleStatusChange('approved')}
                className="px-4 py-1.5 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded transition flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Approve Contract
              </button>
            </>
          )}

          {contract.status === 'approved' && (
            <button 
              onClick={() => setShowReviewModal(true)}
              className="px-4 py-1.5 text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white rounded transition flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Publish & Execute
            </button>
          )}

          {contract.status === 'published' && (
            <>
              <button 
                onClick={() => handleStatusChange('paused')}
                className="px-3 py-1.5 text-sm font-medium border border-border rounded hover:bg-muted transition flex items-center gap-2 text-orange-400"
              >
                <Pause className="w-4 h-4" />
                Pause
              </button>
              <button 
                onClick={() => handleStatusChange('archived')}
                className="px-3 py-1.5 text-sm font-medium border border-border rounded hover:bg-muted transition flex items-center gap-2 text-neutral-400"
              >
                <Archive className="w-4 h-4" />
                Archive
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 overflow-hidden relative">
        <PanelGroup direction="horizontal">
          
          {/* Version History Sidebar */}
          {showHistory && (
            <>
              <Panel defaultSize={20} minSize={15} maxSize={30}>
                <VersionHistoryPanel />
              </Panel>
              <PanelResizeHandle className="w-1 bg-border hover:bg-blue-500 transition-colors cursor-col-resize" />
            </>
          )}

          <Panel defaultSize={showHistory ? 80 : 100}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={75} minSize={30}>
                <PanelGroup direction="horizontal">
                  
                  {/* Left: Visual Builder */}
                  <Panel defaultSize={50} minSize={30} className="relative h-full border-r border-border">
                    {showTemplates ? (
                      <div className="p-6 h-full overflow-y-auto custom-scrollbar">
                        <TemplateMarketplace />
                      </div>
                    ) : (
                      <VisualBuilder />
                    )}
                  </Panel>
                  
                  <PanelResizeHandle className="w-1 bg-border hover:bg-blue-500 transition-colors cursor-col-resize" />
                  
                  {/* Right: Monaco Editor or Diff Viewer */}
                  <Panel defaultSize={50} minSize={30}>
                    {showDiffViewer ? (
                      <div className="h-full flex flex-col">
                        <div className="bg-[#1e1e1e] border-b border-[#333] px-4 py-2 flex justify-between items-center shrink-0">
                          <span className="text-sm font-mono text-muted-foreground">Comparing: <span className="text-blue-400 font-bold">Version {selectedVersionObj.version}</span> vs <span className="text-green-400 font-bold">Current</span></span>
                        </div>
                        <div className="flex-1">
                          <DiffViewer original={selectedVersionObj.yaml} modified={yaml} readOnly={true} />
                        </div>
                      </div>
                    ) : (
                      <YamlEditor value={yaml} onChange={(val) => setYaml(val || '')} />
                    )}
                  </Panel>
                </PanelGroup>
              </Panel>
              
              <PanelResizeHandle className="h-1 bg-border hover:bg-blue-500 transition-colors cursor-row-resize" />
              
              {/* Bottom: Live Preview */}
              <Panel defaultSize={25} minSize={15}>
                <LivePreviewPanel />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>

      <ReviewDeployModal 
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onConfirm={executeDeploy}
      />
    </div>
  );
}
