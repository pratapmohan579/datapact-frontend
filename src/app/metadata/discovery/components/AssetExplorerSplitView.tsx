"use client";

import { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Folder, Database, Table2, Columns, Search, ChevronRight, ChevronDown, Shield, Link2, FileText, Activity } from "lucide-react";
import { AiClassificationCard } from "./AiClassificationCard";

export function AssetExplorerSplitView() {
  const [selectedTable, setSelectedTable] = useState<string | null>("Orders");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'Postgres': true,
    'Postgres.Sales': true
  });
  
  const [activeTab, setActiveTab] = useState("overview");

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const TREE = [
    {
      id: 'Postgres', name: 'Postgres', type: 'db', children: [
        {
          id: 'Postgres.Sales', name: 'Sales', type: 'schema', children: [
            { id: 'Postgres.Sales.Orders', name: 'Orders', type: 'table' },
            { id: 'Postgres.Sales.Customers', name: 'Customers', type: 'table' },
            { id: 'Postgres.Sales.Payments', name: 'Payments', type: 'table' },
          ]
        }
      ]
    },
    {
      id: 'Snowflake', name: 'Snowflake', type: 'db', children: [
        {
          id: 'Snowflake.Analytics', name: 'Analytics', type: 'schema', children: [
            { id: 'Snowflake.Analytics.Sessions', name: 'Sessions', type: 'table' },
            { id: 'Snowflake.Analytics.Revenue', name: 'Revenue', type: 'table' },
          ]
        }
      ]
    }
  ];

  const renderTree = (nodes: any[], depth = 0) => {
    return nodes.map(node => {
      const isExpanded = expanded[node.id];
      const isSelected = selectedTable === node.name;
      const hasChildren = node.children && node.children.length > 0;
      
      return (
        <div key={node.id}>
          <div 
            className={`flex items-center gap-1.5 py-1 px-2 cursor-pointer hover:bg-muted/50 rounded-md text-sm
              ${isSelected ? 'bg-blue-50 text-blue-700 font-medium' : 'text-foreground'}`}
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
            onClick={() => {
              if (hasChildren) toggleExpand(node.id);
              if (node.type === 'table') setSelectedTable(node.name);
            }}
          >
            {hasChildren ? (
              isExpanded ? <ChevronDown size={14} className="text-muted-foreground" /> : <ChevronRight size={14} className="text-muted-foreground" />
            ) : <span className="w-[14px]" />}
            
            {node.type === 'db' && <Database size={14} className="text-blue-500" />}
            {node.type === 'schema' && <Folder size={14} className="text-yellow-500" />}
            {node.type === 'table' && <Table2 size={14} className="text-indigo-500" />}
            
            <span className="truncate">{node.name}</span>
          </div>
          {hasChildren && isExpanded && renderTree(node.children, depth + 1)}
        </div>
      );
    });
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm mb-8 overflow-hidden flex flex-col h-[800px]">
      <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/30">
        <h2 className="text-xl font-bold">Asset Explorer</h2>
        <div className="relative w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Search assets..." className="w-full bg-background border border-border rounded-md pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={25} minSize={20} className="border-r border-border bg-card/50 overflow-y-auto p-2 custom-scrollbar">
            {renderTree(TREE)}
          </Panel>
          <PanelResizeHandle className="w-1 bg-border hover:bg-blue-500 transition-colors cursor-col-resize" />
          <Panel defaultSize={75} className="overflow-y-auto bg-background p-6 custom-scrollbar">
            {selectedTable ? (
              <div className="animate-in fade-in duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-indigo-100 text-indigo-700 rounded-lg">
                    <Table2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{selectedTable}</h3>
                    <p className="text-muted-foreground text-sm">Postgres • Sales • {selectedTable}</p>
                  </div>
                </div>
                
                {/* Metrics */}
                <div className="flex gap-6 mb-8 border-b border-border pb-6">
                  <div>
                    <span className="block text-sm text-muted-foreground mb-1">Rows</span>
                    <span className="text-lg font-bold">12M</span>
                  </div>
                  <div>
                    <span className="block text-sm text-muted-foreground mb-1">Columns</span>
                    <span className="text-lg font-bold">18</span>
                  </div>
                  <div>
                    <span className="block text-sm text-muted-foreground mb-1">Owner</span>
                    <span className="text-lg font-bold flex items-center gap-1">Analytics</span>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 border-b border-border mb-6">
                  {['overview', 'columns', 'statistics', 'relationships', 'contracts', 'history', 'lineage'].map(tab => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab ? 'border-blue-500 text-blue-600' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Placeholder for tab content. We inject AI Classifications component here to show how it fits. */}
                    <div className="bg-card border border-border rounded-lg p-5">
                      <h4 className="font-bold mb-4 flex items-center gap-2"><Columns size={18} /> Schema Definition</h4>
                      <table className="w-full text-sm text-left">
                        <thead className="text-muted-foreground border-b border-border">
                          <tr><th className="pb-2 font-medium">Column</th><th className="pb-2 font-medium">Type</th><th className="pb-2 font-medium">Description</th></tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          <tr><td className="py-3 font-semibold text-foreground">order_id</td><td className="py-3 text-indigo-500">uuid</td><td className="py-3 text-muted-foreground">Unique identifier for the order</td></tr>
                          <tr><td className="py-3 font-semibold text-foreground flex items-center gap-2">customer_id <Link2 size={14} className="text-blue-500"/></td><td className="py-3 text-indigo-500">uuid</td><td className="py-3 text-muted-foreground">Reference to customer</td></tr>
                          <tr><td className="py-3 font-semibold text-foreground flex items-center gap-2">email <Shield size={14} className="text-red-500"/></td><td className="py-3 text-indigo-500">varchar</td><td className="py-3 text-muted-foreground">Customer email address</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-1">
                    <AiClassificationCard />
                  </div>
                </div>
                
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Select an asset from the explorer to view details.
              </div>
            )}
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
