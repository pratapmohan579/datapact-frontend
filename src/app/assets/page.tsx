"use client";

import { useState } from "react";
import { useAssets } from "@/queries/useAssets";
import { Search, Filter, BookOpen, AlertCircle, CheckCircle, Database, Server } from "lucide-react";
import Link from "next/link";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";

interface Asset {
  id: string;
  name: string;
  type: string;
  source_system: string;
  health_score: number;
  status: string;
  owner: string;
  created_at: string;
}

export default function AssetCatalogPage() {
  const { data: assets = [], isLoading: loading } = useAssets();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAssets = assets.filter((asset) => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.source_system?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: ColumnDef<Asset>[] = [
    {
      accessorKey: "name",
      header: "Asset Name",
      cell: ({ row }) => {
        const asset = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 flex-shrink-0">
              {asset.type === 'dashboard' ? <LayoutGrid className="w-5 h-5" /> : <Database className="w-5 h-5" />}
            </div>
            <div>
              <Link href={`/assets/${asset.id}`} className="font-semibold text-foreground hover:text-blue-400 transition-colors cursor-pointer">
                {asset.name}
              </Link>
              <p className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">ID: {asset.id}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        return (
          <span className="px-2.5 py-1 bg-secondary rounded-md border border-border text-sm font-medium capitalize">
            {type?.replace('_', ' ') || 'Unknown'}
          </span>
        );
      },
    },
    {
      accessorKey: "source_system",
      header: "Source System",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Server className="w-4 h-4" />
          {row.getValue("source_system")}
        </div>
      ),
    },
    {
      accessorKey: "owner",
      header: "Owner",
      cell: ({ row }) => {
        const owner = row.getValue("owner") as string;
        return (
          <div className="flex items-center gap-2 text-sm">
            {owner ? (
              <>
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm flex-shrink-0">
                  {owner.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-foreground">{owner}</span>
              </>
            ) : (
              <span className="text-muted-foreground italic">Unassigned</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "health_score",
      header: "Health",
      cell: ({ row }) => {
        const score = row.getValue("health_score") as number || 0;
        const style = score >= 90 ? 'text-green-500 border-green-500/20 bg-green-500/10' :
                      score >= 70 ? 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10' :
                      'text-red-500 border-red-500/20 bg-red-500/10';
        return (
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm border-2 ${style}`}>
              {score}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        if (status === 'Healthy') {
          return (
            <span className="inline-flex items-center gap-1.5 text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full border border-green-400/20">
              <CheckCircle className="w-3.5 h-3.5" /> Healthy
            </span>
          );
        } else if (status === 'Warning') {
          return (
            <span className="inline-flex items-center gap-1.5 text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-full border border-yellow-400/20">
              <AlertCircle className="w-3.5 h-3.5" /> Warning
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1.5 text-red-400 bg-red-400/10 px-2.5 py-1 rounded-full border border-red-400/20">
            <AlertCircle className="w-3.5 h-3.5" /> Failed
          </span>
        );
      },
    },
  ];

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Database className="w-8 h-8 text-blue-400" />
            Asset Catalog
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Discover and govern every data asset across your organization.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by asset name, type, or source..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow text-foreground"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button className="flex items-center gap-2 px-3 py-2 bg-secondary border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
              <Filter className="w-4 h-4" />
              Source: All
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-secondary border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
              <Filter className="w-4 h-4" />
              Type: All
            </button>
          </div>
        </div>

        {/* Data Table */}
        {loading ? (
          <div className="p-8 text-center text-muted-foreground glass-card rounded-xl">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              <p>Loading catalog...</p>
            </div>
          </div>
        ) : (
          <DataTable columns={columns} data={filteredAssets} />
        )}
      </div>
    </div>
  );
}

// Ensure LayoutGrid is available if used
function LayoutGrid(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>
    </svg>
  )
}
