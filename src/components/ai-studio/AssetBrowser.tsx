"use client";

import { useState, useEffect } from "react";
import { Search, ChevronRight, ChevronDown, Database, LayoutGrid, Table, Loader2 } from "lucide-react";
import { useAIStudioStore } from "@/store/ai-studio-store";
import { api } from "@/lib/apiClient";

export default function AssetBrowser() {
  const [tree, setTree] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  
  const { selectedAssetId, setSelectedAssetId } = useAIStudioStore();

  useEffect(() => {
    async function fetchTree() {
      try {
        const data = await api.get('/ai/contracts/assets');
        if (data.tree) {
          setTree(data.tree);
          // Auto-expand first node
          if (data.tree.length > 0) {
            setExpandedNodes({ [data.tree[0].id]: true });
          }
        }
      } catch (err) {
        console.error("Failed to load asset tree", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTree();
  }, []);

  const toggleNode = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'source': return <Database className="w-4 h-4 text-blue-500" />;
      case 'database': return <LayoutGrid className="w-4 h-4 text-purple-500" />;
      case 'table': return <Table className="w-4 h-4 text-emerald-500" />;
      default: return <Database className="w-4 h-4" />;
    }
  };

  const renderNode = (node: any, depth = 0) => {
    const isExpanded = expandedNodes[node.id];
    const isSelected = selectedAssetId === node.name; // Using name as ID for mock
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id}>
        <div 
          className={`flex items-center gap-2 py-1.5 px-2 cursor-pointer rounded-md transition-colors ${isSelected ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'}`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={(e) => node.type === 'table' ? setSelectedAssetId(node.name) : toggleNode(node.id, e)}
        >
          <div className="w-4 flex items-center justify-center">
            {hasChildren && (
              <button onClick={(e) => toggleNode(node.id, e)} className="text-muted-foreground hover:text-foreground">
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            )}
          </div>
          {getIcon(node.type)}
          <span className="text-sm font-medium truncate">{node.name}</span>
        </div>
        
        {isExpanded && hasChildren && (
          <div>
            {node.children.map((child: any) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground mb-4">Asset Browser</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search assets..." 
            className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          tree.map(node => renderNode(node))
        )}
      </div>
    </div>
  );
}
