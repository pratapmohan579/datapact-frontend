"use client";

import { useEffect, useState, useMemo } from "react";
import { Activity, AlertTriangle, Shield, CheckCircle, Target, Sparkles, Clock, Database, ArrowUpRight } from "lucide-react";
import { useContracts } from "@/queries/useContracts";
import { useIncidents } from "@/queries/useIncidents";
import { useDashboardMetrics } from "@/queries/useDashboard";
import { useAppStore } from "@/store/useAppStore";
import { useWidgets, useUpdateWidget, useRecentActivity, useFavorites } from "@/api/workspace/workspace";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { SortableWidget } from "@/components/dashboard/SortableWidget";

const DEFAULT_WIDGETS = [
  { id: 'ai-suggestions', title: 'AI Suggestion' },
  { id: 'action-required', title: 'Action Required' },
  { id: 'cost-summary', title: 'Cost Summary' },
  { id: 'active-pipelines', title: 'Active Pipelines' }
];

export default function WorkspaceHome() {
  const { workspaceHealth, currentUser } = useAppStore();
  const [greeting, setGreeting] = useState("Welcome");

  // Fetch persistent customization state
  const { data: dbWidgets, isLoading: loadingWidgets } = useWidgets("overview");
  const updateWidget = useUpdateWidget();
  const { data: recentActivity = [] } = useRecentActivity();
  const { data: favorites = [] } = useFavorites();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const { data: contracts = [], isLoading: loadingContracts } = useContracts();
  const { data: incidents = [], isLoading: loadingIncidents } = useIncidents();
  const { data: metrics, isLoading: loadingMetrics } = useDashboardMetrics();

  // Calculate sorted widgets
  const activeWidgets = useMemo(() => {
    let list = DEFAULT_WIDGETS.map(dw => {
      const dbPref = dbWidgets?.find(w => w.widget_id === dw.id);
      return {
        ...dw,
        position: dbPref?.position ?? DEFAULT_WIDGETS.findIndex(w => w.id === dw.id),
        visibility: dbPref?.visibility ?? true,
      };
    });
    
    // Sort by position and filter hidden
    return list.filter(w => w.visibility).sort((a, b) => a.position - b.position);
  }, [dbWidgets]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = activeWidgets.findIndex((item) => item.id === active.id);
      const newIndex = activeWidgets.findIndex((item) => item.id === over?.id);
      
      const newArray = arrayMove(activeWidgets, oldIndex, newIndex);
      
      // Update positions in backend optimistically
      newArray.forEach((widget, idx) => {
        if (widget.position !== idx) {
          updateWidget.mutate({ dashboardName: "overview", widgetId: widget.id, data: { position: idx } });
        }
      });
    }
  };

  if (loadingContracts || loadingIncidents || loadingWidgets) {
    return <div className="flex items-center justify-center h-full"><div className="animate-pulse text-muted-foreground">Loading Workspace...</div></div>;
  }

  const openIncidents = incidents.filter((i) => i.status === "OPEN");

  // Widget Renderers
  const renderWidgetContent = (id: string) => {
    switch(id) {
      case 'ai-suggestions':
        return (
          <div className="glass-card p-5 border-blue-500/30 bg-blue-500/5 relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-500/20 rounded-lg"><Sparkles className="w-5 h-5 text-blue-400" /></div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">AI Suggestion: Unprotected Revenue Assets</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  The <span className="font-mono text-xs bg-muted px-1 rounded text-foreground">stripe.fct_payments</span> dataset is highly queried but lacks data contracts. 
                  DataPact AI has generated 5 recommended rules based on historical usage.
                </p>
                <div className="mt-3 flex gap-3">
                  <button className="text-xs font-semibold px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Review Contract</button>
                  <button className="text-xs font-semibold px-3 py-1.5 bg-secondary text-foreground border border-border rounded-md hover:bg-muted transition-colors">Dismiss</button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'action-required':
        return (
          <div className="glass-card p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" /> Action Required
              </h3>
              <span className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">View all</span>
            </div>
            <div className="space-y-3">
              {openIncidents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No open incidents!</p>
              ) : (
                openIncidents.slice(0, 3).map((inc) => (
                  <div key={inc.id} className="p-3 bg-secondary/50 border border-border rounded-lg hover:bg-secondary transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-foreground group-hover:text-blue-400 transition-colors">{inc.asset_id}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">{inc.severity}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{inc.error_message || "Anomaly detected"}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      case 'favorite-assets':
        return (
          <div className="glass-card p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Database className="w-4 h-4 text-green-400" /> Favorite Assets
              </h3>
              <span className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">View all</span>
            </div>
            <div className="space-y-3">
              {favorites.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No favorites yet.</p>
              ) : (
                favorites.map((fav, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-secondary/50 border border-border rounded-lg hover:bg-secondary transition-colors cursor-pointer">
                    <div>
                      <p className="text-sm font-medium text-foreground">{fav.item_id}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{fav.item_type}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      case 'recent-activity':
        return (
          <div className="glass-card p-5 h-full">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" /> Recent Pages
            </h3>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent activity.</p>
              ) : (
                recentActivity.slice(0, 5).map((act, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-blue-500/50 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{act.visited_page}</span>
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      case 'cost-summary':
        return (
          <div className="glass-card p-5 h-full">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-green-400" /> Cost Summary (Snowflake)
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Compute</span>
                  <span className="font-medium text-foreground">420 Credits</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[60%]"></div>
                </div>
              </div>
              <div className="pt-3 border-t border-border mt-2">
                <p className="text-xs text-muted-foreground">
                  <Sparkles className="inline w-3 h-3 text-purple-400 mr-1" />
                  AI identifies 4 unused tables. Potential savings: <span className="text-green-400 font-bold">$120/mo</span>
                </p>
              </div>
            </div>
          </div>
        );
      case 'active-pipelines':
        return (
          <div className="glass-card p-5 h-full">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" /> Active Pipelines
            </h3>
            <div className="space-y-4">
              {[
                { name: 'daily_revenue_dbt', status: 'running', progress: 75 },
                { name: 'fivetran_salesforce_sync', status: 'running', progress: 30 },
              ].map((pipe, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground">{pipe.name}</span>
                    <span className="text-blue-400 font-mono text-xs">Running...</span>
                  </div>
                  <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 animate-pulse" style={{ width: `${pipe.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default: return null;
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            {greeting}, {currentUser?.full_name?.split(" ")[0] || "User"}
          </h1>
          <p className="text-muted-foreground mt-1">Here is what's happening in your data platform today.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-secondary hover:bg-muted border border-border text-foreground rounded-lg transition-colors text-sm font-medium">
            Customize Workspace
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Ask AI
          </button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Workspace Health" value={`${metrics?.healthy_assets || 100}%`} icon={<CheckCircle className="text-green-400" />} trend="+2% from yesterday" />
        <MetricCard title="Data Quality Score" value={`${metrics?.quality_score || 94}%`} icon={<Target className="text-blue-400" />} trend="-0.5% (Check orders table)" />
        <MetricCard title="Open Incidents" value={openIncidents.length.toString()} icon={<AlertTriangle className="text-red-400" />} trend={`${openIncidents.length} active anomalies`} isAlert={openIncidents.length > 0} />
        <MetricCard title="Active Contracts" value={contracts.length.toString()} icon={<Shield className="text-purple-400" />} trend={`${metrics?.new_contracts_24h || 0} contracts added this week`} />
      </div>

      {/* Dynamic Widget Area */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={activeWidgets.map(w => w.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
            {activeWidgets.map((widget) => {
              // Specific span logic for AI banner
              const colSpan = widget.id === 'ai-suggestions' ? 'md:col-span-2 lg:col-span-3' : 'col-span-1';
              
              return (
                <div key={widget.id} className={colSpan}>
                  <SortableWidget id={widget.id}>
                    {renderWidgetContent(widget.id)}
                  </SortableWidget>
                </div>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function MetricCard({ title, value, icon, trend, isAlert = false }: { title: string, value: string, icon: React.ReactNode, trend: string, isAlert?: boolean }) {
  return (
    <div className={`glass-card p-5 ${isAlert ? 'border-red-500/30' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-muted-foreground text-sm font-medium">{title}</h3>
        <div className="p-2 bg-secondary rounded-lg">{icon}</div>
      </div>
      <p className="text-3xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-2">{trend}</p>
    </div>
  );
}
