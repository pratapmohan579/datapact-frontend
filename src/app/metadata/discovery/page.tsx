import { DiscoveryHeader } from "./components/DiscoveryHeader";
import { DiscoverySummary } from "./components/DiscoverySummary";
import { ScanProgressTimeline } from "./components/ScanProgressTimeline";
import { DiscoveryPipelineFlow } from "./components/DiscoveryPipelineFlow";
import { ConnectedSourcesTable } from "./components/ConnectedSourcesTable";
import { AssetExplorerSplitView } from "./components/AssetExplorerSplitView";
import { StatisticsDashboard } from "./components/StatisticsDashboard";
import { MetadataChangesTimeline } from "./components/MetadataChangesTimeline";
import { DiscoveryLogsConsole } from "./components/DiscoveryLogsConsole";
import { AiScanReport } from "./components/AiScanReport";
import { HealthScore } from "./components/HealthScore";
import { AiChatPanel } from "./components/AiChatPanel";

export default function MetadataDiscoveryStudioPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 relative">
        
        {/* Section 1: Header */}
        <DiscoveryHeader />
        
        {/* Section 2: Summary Cards */}
        <DiscoverySummary />
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column (Main) */}
          <div className="xl:col-span-2 space-y-8">
            {/* Section 3: Scan Progress */}
            <ScanProgressTimeline />
            
            {/* Section 4: Pipeline Workflow */}
            <DiscoveryPipelineFlow />
            
            {/* Section 5: Sources Table */}
            <ConnectedSourcesTable />
            
            {/* Section 6 & 7 & 8: Explorer, Details, AI Classification */}
            <AssetExplorerSplitView />
            
            {/* Section 10: Statistics */}
            <StatisticsDashboard />
            
            {/* Section 14: AI Report */}
            <AiScanReport />
          </div>
          
          {/* Right Column (Sidebar) */}
          <div className="space-y-8">
            {/* Section 15: Health Score */}
            <HealthScore />
            
            {/* Section 11: Timeline */}
            <MetadataChangesTimeline />
            
            {/* Section 12: Logs */}
            <DiscoveryLogsConsole />
            
            {/* Placeholder for Section 13: Scan History (Can be a smaller table here) */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="font-bold mb-4">Scan History</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm border-b border-border pb-2">
                  <div>
                    <p className="font-medium">Postgres</p>
                    <p className="text-muted-foreground text-xs">Today, 09:20 AM</p>
                  </div>
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">Success</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-border pb-2">
                  <div>
                    <p className="font-medium">Snowflake</p>
                    <p className="text-muted-foreground text-xs">Yesterday, 14:00 PM</p>
                  </div>
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">Success</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-border pb-2">
                  <div>
                    <p className="font-medium">BigQuery</p>
                    <p className="text-muted-foreground text-xs">2 days ago</p>
                  </div>
                  <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold">Failed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Section 16: AI Chat Panel */}
        <AiChatPanel />
      </div>
    </div>
  );
}
