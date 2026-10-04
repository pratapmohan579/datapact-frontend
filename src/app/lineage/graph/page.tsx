"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import CustomNode from "./CustomNode";

const nodeTypes = {
  customNode: CustomNode,
};

// Very basic layout function since we don't have dagre installed
const getLayoutedElements = (nodes: any[], edges: any[]) => {
  const outgoingCounts: Record<string, number> = {};
  const incomingCounts: Record<string, number> = {};
  
  nodes.forEach(n => {
    outgoingCounts[n.id] = 0;
    incomingCounts[n.id] = 0;
  });
  
  edges.forEach(e => {
    outgoingCounts[e.source] = (outgoingCounts[e.source] || 0) + 1;
    incomingCounts[e.target] = (incomingCounts[e.target] || 0) + 1;
  });

  // Level 0: no incoming (sources)
  // Level 1: incoming but also outgoing
  // Level 2: no outgoing (dashboards/destinations)
  const levels: Record<number, any[]> = { 0: [], 1: [], 2: [], 3: [] };
  
  nodes.forEach(n => {
    if (incomingCounts[n.id] === 0) levels[0].push(n);
    else if (outgoingCounts[n.id] === 0) levels[3].push(n);
    else if (n.data.node_type === "view") levels[1].push(n);
    else levels[2].push(n);
  });

  const newNodes = nodes.map((node) => {
    let level = 0;
    if (levels[0].includes(node)) level = 0;
    else if (levels[1].includes(node)) level = 1;
    else if (levels[2].includes(node)) level = 2;
    else if (levels[3].includes(node)) level = 3;

    const indexInLevel = levels[level].indexOf(node);
    const spacingX = 350;
    const spacingY = 250;
    
    // Center alignment roughly
    const offsetX = (levels[level].length * spacingX) / 2;

    return {
      ...node,
      position: {
        x: indexInLevel * spacingX - offsetX + 400,
        y: level * spacingY + 100
      }
    };
  });

  return { nodes: newNodes, edges };
};


export default function LineageGraph() {
  const router = useRouter();
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [loading, setLoading] = useState(true);

  const fetchGraph = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }
      
      const res = await fetch("/api/v1/lineage/graph", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error("Failed to fetch graph");
      const data = await res.json();
      
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(data.nodes, data.edges);
      
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    } catch {
      // Fallback mock graph on backend error
      const mockNodes = [
        { id: "1", type: "custom", data: { label: "raw_orders", type: "source", status: "healthy" }, position: { x: 0, y: 0 } },
        { id: "2", type: "custom", data: { label: "stg_orders", type: "model", status: "healthy" }, position: { x: 0, y: 0 } },
        { id: "3", type: "custom", data: { label: "fct_orders", type: "model", status: "warning" }, position: { x: 0, y: 0 } }
      ];
      const mockEdges = [
        { id: "e1-2", source: "1", target: "2", animated: true },
        { id: "e2-3", source: "2", target: "3", animated: true }
      ];
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(mockNodes, mockEdges);
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    } finally {
      setLoading(false);
    }
  }, [router, setEdges, setNodes]);

  useEffect(() => {
    fetchGraph();
  }, [fetchGraph]);

  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  if (loading) return <div className="p-12 text-foreground">Loading interactive graph...</div>;

  return (
    <div className="h-[calc(100vh-6rem)] w-full flex flex-col animate-in fade-in duration-500">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Link href="/lineage" className="text-muted-foreground hover:text-foreground transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </Link>
            Data Lineage Map
          </h2>
          <p className="text-sm text-muted-foreground">Interactive dependency tracking across your entire stack.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-3 h-3 rounded-full bg-green-500"></div> Healthy
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div> Warning
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-3 h-3 rounded-full bg-red-500"></div> Failed
          </div>
        </div>
      </div>

      <div className="flex-1 w-full border border-border rounded-xl overflow-hidden glass-card">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-right"
          proOptions={{ hideAttribution: true }}
        >
          <Controls className="rounded-lg overflow-hidden border border-border shadow-xl !bg-card" />
          <MiniMap 
            nodeColor={(n: any) => {
              if (n.data?.status === 'Failed') return '#ef4444';
              if (n.data?.status === 'Warning') return '#eab308';
              return '#22c55e';
            }}
            maskColor="rgba(0,0,0,0.1)"
            className="!bg-card border border-border rounded-lg overflow-hidden"
          />
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} className="dark:!text-slate-600 !text-slate-300" />
        </ReactFlow>
      </div>
    </div>
  );
}
