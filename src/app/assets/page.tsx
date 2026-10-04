"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { useAssets } from "@/queries/useAssets";
import { 
  Search, AlertCircle, Database, Server, 
  LayoutGrid, List, ChevronDown, Check, X, Activity, Cpu, HardDrive, ChevronRight
} from "lucide-react";
import Link from "next/link";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { motion } from "framer-motion";

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

function getAssetTypeIcon(type: string) {
  switch (type?.toLowerCase()) {
    case "dashboard":
      return <LayoutGrid className="w-4 h-4 text-purple-400" />;
    case "table":
      return <Database className="w-4 h-4 text-blue-400" />;
    case "model":
      return <Cpu className="w-4 h-4 text-pink-400" />;
    case "view":
      return <HardDrive className="w-4 h-4 text-cyan-400" />;
    case "pipeline":
      return <Server className="w-4 h-4 text-orange-400" />;
    default:
      return <Database className="w-4 h-4 text-slate-400" />;
  }
}

function getAssetTypeColor(type: string) {
  switch (type?.toLowerCase()) {
    case "dashboard":
      return "bg-purple-500/10 border-purple-500/20 text-purple-400";
    case "table":
      return "bg-blue-500/10 border-blue-500/20 text-blue-400";
    case "model":
      return "bg-pink-500/10 border-pink-500/20 text-pink-400";
    case "view":
      return "bg-cyan-500/10 border-cyan-500/20 text-cyan-400";
    case "pipeline":
      return "bg-orange-500/10 border-orange-500/20 text-orange-400";
    default:
      return "bg-slate-500/10 border-slate-500/20 text-slate-400";
  }
}

function getAssetGlowColor(type: string) {
  switch (type?.toLowerCase()) {
    case "dashboard":
      return "bg-purple-500/5 group-hover:bg-purple-500/10";
    case "table":
      return "bg-blue-500/5 group-hover:bg-blue-500/10";
    case "model":
      return "bg-pink-500/5 group-hover:bg-pink-500/10";
    case "view":
      return "bg-cyan-500/5 group-hover:bg-cyan-500/10";
    case "pipeline":
      return "bg-orange-500/5 group-hover:bg-orange-500/10";
    default:
      return "bg-zinc-500/5 group-hover:bg-zinc-500/10";
  }
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'Healthy') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-green-400 bg-green-500/10 px-2.5 py-0.5 rounded-full border border-green-500/20 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        Healthy
      </span>
    );
  } else if (status === 'Warning') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-yellow-400 bg-yellow-500/10 px-2.5 py-0.5 rounded-full border border-yellow-500/20 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
        Warning
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-red-400 bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/20 shadow-sm">
      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
      Failed
    </span>
  );
}

function OwnerAvatar({ name }: { name: string }) {
  if (!name) return <span className="text-muted-foreground italic text-xs">Unassigned</span>;
  const initial = name.charAt(0).toUpperCase();
  const charCode = name.charCodeAt(0);
  const gradients = [
    "from-blue-500 to-indigo-500",
    "from-purple-500 to-pink-500",
    "from-teal-500 to-emerald-500",
    "from-orange-500 to-red-500",
    "from-pink-500 to-rose-500",
    "from-cyan-500 to-blue-500",
  ];
  const gradient = gradients[charCode % gradients.length];
  return (
    <div className="flex items-center gap-2">
      <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center text-[10px] font-bold text-white shadow-sm flex-shrink-0`}>
        {initial}
      </div>
      <span className="text-sm font-medium text-foreground">{name}</span>
    </div>
  );
}

function CircularProgress({ value, size = 36 }: { value: number; size?: number }) {
  const radius = size * 0.4;
  const strokeWidth = size * 0.08;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  
  const color = value >= 90 ? 'rgb(34, 197, 94)' : // Green-500
                value >= 70 ? 'rgb(234, 179, 8)' :  // Yellow-500
                'rgb(239, 68, 68)';                  // Red-500
                
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-muted/20"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <span className="absolute text-[10px] font-bold" style={{ color }}>{value}</span>
    </div>
  );
}

export default function AssetCatalogPage() {
  const { theme } = useTheme();
  const { data: assets = [], isLoading: loading } = useAssets();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSource, setSelectedSource] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  
  const [isSourceOpen, setIsSourceOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);

  // Dynamically set background and force theme on parent <main> for Assets Page
  useEffect(() => {
    const mainEl = document.querySelector("main");
    if (mainEl) {
      const originalBg = mainEl.style.background;
      const originalTheme = mainEl.getAttribute("data-theme");

      if (theme === "light") {
        mainEl.style.background = "#F8FAFC";
        mainEl.setAttribute("data-theme", "light");
      } else {
        mainEl.style.background = "radial-gradient(circle at 50% 0%, #13132B 0%, #030308 60%, #000000 100%)";
        mainEl.setAttribute("data-theme", "dark");
      }

      return () => {
        mainEl.style.background = originalBg;
        if (originalTheme) {
          mainEl.setAttribute("data-theme", originalTheme);
        } else {
          mainEl.removeAttribute("data-theme");
        }
      };
    }
  }, [theme]);

  // Compute options dynamically
  const uniqueSources: string[] = ["All", ...Array.from(new Set(assets.map((a: Asset) => a.source_system).filter(Boolean) as string[]))];
  const uniqueTypes: string[] = ["All", ...Array.from(new Set(assets.map((a: Asset) => a.type).filter(Boolean) as string[]))];

  const getSourceCount = (source: string) => {
    if (source === "All") return assets.length;
    return assets.filter((a: Asset) => a.source_system === source).length;
  };

  const getTypeCount = (type: string) => {
    if (type === "All") return assets.length;
    return assets.filter((a: Asset) => a.type === type).length;
  };

  const filteredAssets = assets.filter((asset: Asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.source_system?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.type?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSource = selectedSource === "All" || asset.source_system === selectedSource;
    const matchesType = selectedType === "All" || asset.type === selectedType;

    return matchesSearch && matchesSource && matchesType;
  });

  // Calculate Metrics
  const avgHealthScore = assets.length 
    ? Math.round(assets.reduce((sum: number, a: Asset) => sum + (a.health_score || 0), 0) / assets.length) 
    : 0;
  
  const issuesCount = assets.filter((a: Asset) => a.status !== 'Healthy').length;

  const columns: ColumnDef<Asset>[] = [
    {
      accessorKey: "name",
      header: "Asset Name",
      cell: ({ row }) => {
        const asset = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center border flex-shrink-0 ${getAssetTypeColor(asset.type)}`}>
              {getAssetTypeIcon(asset.type)}
            </div>
            <div>
              <Link href={`/assets/${asset.id}`} className="font-semibold text-foreground hover:text-blue-400 transition-colors cursor-pointer block">
                {asset.name}
              </Link>
              <p className="text-[11px] text-muted-foreground font-mono truncate max-w-[200px]">ID: {asset.id}</p>
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
          <span className={`px-2.5 py-1 rounded-lg border text-xs font-semibold capitalize tracking-wide ${getAssetTypeColor(type)}`}>
            {type?.replace('_', ' ') || 'Unknown'}
          </span>
        );
      },
    },
    {
      accessorKey: "source_system",
      header: "Source System",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
          <Server className="w-4 h-4 text-muted-foreground/80" />
          {row.getValue("source_system")}
        </div>
      ),
    },
    {
      accessorKey: "owner",
      header: "Owner",
      cell: ({ row }) => {
        const owner = row.getValue("owner") as string;
        return <OwnerAvatar name={owner} />;
      },
    },
    {
      accessorKey: "health_score",
      header: "Health",
      cell: ({ row }) => {
        const score = row.getValue("health_score") as number || 0;
        return (
          <div className="flex justify-center">
            <CircularProgress value={score} size={36} />
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return <StatusBadge status={status} />;
      },
    },
  ];

  return (
    <div 
      className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 relative text-zinc-900 dark:text-zinc-100"
      style={{
        "--background": theme === "light" ? "210 40% 98%" : "240 5.9% 2.7%",
        "--card": theme === "light" ? "0 0% 100%" : "240 5.9% 10%",
        "--border": theme === "light" ? "214.3 31.8% 91.4%" : "240 5.2% 26.1%",
        "--muted": theme === "light" ? "210 40% 96.1%" : "240 5.9% 5%",
        "--muted-foreground": theme === "light" ? "215.4 16.3% 46.9%" : "240 5% 65%",
        "--foreground": theme === "light" ? "222.2 47.4% 11.2%" : "240 5% 96%",
      } as React.CSSProperties}
    >
      
      {/* Decorative backdrop gradients for dark mode */}
      <div className="absolute top-0 right-10 w-[500px] h-[500px] bg-blue-400/8 dark:bg-blue-400/12 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute top-1/3 left-5 w-[400px] h-[400px] bg-teal-400/6 dark:bg-teal-400/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-10 right-20 w-[450px] h-[450px] bg-purple-500/6 dark:bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800/40 pb-4">
        <div>
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-555 dark:text-zinc-400 font-medium mb-1">
            <span>Home</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-zinc-800 dark:text-zinc-100">Asset Catalog</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 via-indigo-600 to-teal-605 dark:from-cyan-300 dark:via-blue-200 dark:to-teal-300 bg-clip-text text-transparent">Asset Catalog</h1>
        </div>
      </div>

      {/* Main Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full relative overflow-hidden rounded-2xl border border-blue-500/25 dark:border-primary/20 bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-transparent p-6 sm:p-8"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="max-w-xl relative z-10 space-y-2">
          <p className="text-sm text-zinc-750 dark:text-zinc-200 leading-relaxed font-medium">
            Discover and govern every data asset across your organization. Monitor health scores, track source systems, and manage active issues across your data warehouse.
          </p>
        </div>
      </motion.div>

      {/* Metrics Cards Section */}
      {!loading && assets.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Assets */}
          <div className="bg-white dark:bg-[#18181B] border-t-2 border-t-blue-500 border-x border-b border-zinc-205 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-505 rounded-2xl p-5 shadow-lg transition-all duration-300 relative group overflow-hidden hover:scale-[1.01] hover:shadow-blue-500/5">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-colors"></div>
            <div className="flex justify-between items-start mb-3 relative z-10">
              <span className="text-xs font-bold text-zinc-555 dark:text-zinc-300 uppercase tracking-wider">Total Assets</span>
              <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl"><Database className="w-4 h-4" /></div>
            </div>
            <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white relative z-10">{assets.length}</h3>
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-normal mt-3 relative z-10">
              <span>Governed in Catalog</span>
            </div>
          </div>

          {/* Catalog Health */}
          <div className="bg-white dark:bg-[#18181B] border-t-2 border-t-teal-500 border-x border-b border-zinc-205 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-505 rounded-2xl p-5 shadow-lg transition-all duration-300 relative group overflow-hidden hover:scale-[1.01] hover:shadow-teal-500/5">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-xl group-hover:bg-teal-500/10 transition-colors"></div>
            <div className="flex justify-between items-start mb-3 relative z-10">
              <span className="text-xs font-bold text-zinc-555 dark:text-zinc-300 uppercase tracking-wider">Catalog Health</span>
              <div className="p-2 bg-teal-500/10 text-teal-555 rounded-xl"><Activity className="w-4 h-4" /></div>
            </div>
            <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white relative z-10">{avgHealthScore}%</h3>
            <div className="flex items-center gap-1.5 text-xs text-zinc-555 dark:text-zinc-400 font-normal mt-3 relative z-10">
              <span>Average Health Score</span>
            </div>
          </div>

          {/* Active Issues */}
          <div className="bg-white dark:bg-[#18181B] border-t-2 border-t-rose-500 border-x border-b border-zinc-205 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-505 rounded-2xl p-5 shadow-lg transition-all duration-300 relative group overflow-hidden hover:scale-[1.01] hover:shadow-rose-500/5">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl group-hover:bg-rose-500/10 transition-colors"></div>
            <div className="flex justify-between items-start mb-3 relative z-10">
              <span className="text-xs font-bold text-zinc-555 dark:text-zinc-300 uppercase tracking-wider">Active Issues</span>
              <div className={`p-2 rounded-xl ${issuesCount > 0 ? "bg-rose-500/10 text-rose-500" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"}`}><AlertCircle className="w-4 h-4" /></div>
            </div>
            <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white relative z-10">{issuesCount}</h3>
            <div className="flex items-center gap-1.5 text-xs text-zinc-555 dark:text-zinc-400 font-normal mt-3 relative z-10">
              <span>Warning or Failed Assets</span>
            </div>
          </div>

          {/* Connected Sources */}
          <div className="bg-white dark:bg-[#18181B] border-t-2 border-t-amber-500 border-x border-b border-zinc-205 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-505 rounded-2xl p-5 shadow-lg transition-all duration-300 relative group overflow-hidden hover:scale-[1.01] hover:shadow-amber-500/5">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-colors"></div>
            <div className="flex justify-between items-start mb-3 relative z-10">
              <span className="text-xs font-bold text-zinc-555 dark:text-zinc-300 uppercase tracking-wider">Connected Sources</span>
              <div className="p-2 bg-amber-500/10 text-amber-550 dark:text-amber-550 rounded-xl"><Server className="w-4 h-4" /></div>
            </div>
            <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white relative z-10">{uniqueSources.length - 1}</h3>
            <div className="flex items-center gap-1.5 text-xs text-zinc-555 dark:text-zinc-400 font-normal mt-3 relative z-10">
              <span>Data Warehouses & Systems</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-white dark:bg-[#18181B] p-4 border border-zinc-200 dark:border-zinc-700/60 rounded-xl shadow-sm">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
            <input 
              type="text" 
              placeholder="Search by asset name, type, or source..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-10 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/50 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-550"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-450 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filters & View Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Source Dropdown */}
            <div className="relative">
              <button 
                onClick={() => { setIsSourceOpen(!isSourceOpen); setIsTypeOpen(false); }}
                className="flex items-center justify-between gap-2 px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-205 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-805 transition-all cursor-pointer min-w-[140px]"
              >
                <span className="flex items-center gap-2">
                  <Server className="w-3.5 h-3.5 text-zinc-555 dark:text-zinc-400" />
                  <span className="truncate max-w-[100px]">Source: {selectedSource}</span>
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-555 dark:text-zinc-400" />
              </button>
              {isSourceOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsSourceOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-2xl py-1.5 z-20 animate-in fade-in duration-200">
                    {uniqueSources.map(source => (
                      <button
                        key={source}
                        onClick={() => {
                          setSelectedSource(source);
                          setIsSourceOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white flex items-center justify-between cursor-pointer"
                      >
                        <span className="truncate">{source}</span>
                        <span className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[10px] text-zinc-500">({getSourceCount(source)})</span>
                          {selectedSource === source && <Check className="w-3.5 h-3.5 text-blue-400" />}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Type Dropdown */}
            <div className="relative">
              <button 
                onClick={() => { setIsTypeOpen(!isTypeOpen); setIsSourceOpen(false); }}
                className="flex items-center justify-between gap-2 px-4 py-2 bg-zinc-55 dark:bg-zinc-900 border border-zinc-205 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-100 hover:bg-zinc-105 dark:hover:bg-zinc-805 transition-all cursor-pointer min-w-[140px]"
              >
                <span className="flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-zinc-555 dark:text-zinc-400" />
                  <span className="truncate max-w-[100px]">Type: {selectedType}</span>
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-555 dark:text-zinc-400" />
              </button>
              {isTypeOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsTypeOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-2xl py-1.5 z-20 animate-in fade-in duration-200">
                    {uniqueTypes.map(type => (
                      <button
                        key={type}
                        onClick={() => {
                          setSelectedType(type);
                          setIsTypeOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs hover:bg-zinc-55 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white flex items-center justify-between cursor-pointer"
                      >
                        <span className="truncate capitalize">{type?.replace('_', ' ')}</span>
                        <span className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[10px] text-zinc-500">({getTypeCount(type)})</span>
                          {selectedType === type && <Check className="w-3.5 h-3.5 text-blue-400" />}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />

            {/* View Switcher */}
            <div className="flex bg-zinc-100 dark:bg-zinc-955 p-1 rounded-xl w-fit border border-zinc-205 dark:border-zinc-800">
              <button 
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === "grid" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-505 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === "table" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-505 dark:text-zinc-455 hover:text-zinc-800 dark:hover:text-zinc-200"}`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(selectedSource !== "All" || selectedType !== "All" || searchTerm) && (
          <div className="flex flex-wrap items-center gap-2 pt-1 animate-in fade-in duration-300">
            <span className="text-xs text-zinc-555 dark:text-zinc-400 font-semibold">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-blue-500/10 text-blue-450 dark:text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full shadow-sm animate-in fade-in">
                Search: &quot;{searchTerm}&quot;
                <button onClick={() => setSearchTerm("")} className="hover:text-zinc-900 dark:hover:text-white cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedSource !== "All" && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-purple-500/10 text-purple-550 dark:text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full shadow-sm animate-in fade-in">
                Source: {selectedSource}
                <button onClick={() => setSelectedSource("All")} className="hover:text-zinc-900 dark:hover:text-white cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedType !== "All" && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-cyan-500/10 text-cyan-555 dark:text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full shadow-sm capitalize animate-in fade-in">
                Type: {selectedType?.replace('_', ' ')}
                <button onClick={() => setSelectedType("All")} className="hover:text-zinc-900 dark:hover:text-white cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button 
              onClick={() => {
                setSearchTerm("");
                setSelectedSource("All");
                setSelectedType("All");
              }}
              className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white underline transition-colors cursor-pointer ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Data List/Grid/Table */}
        {loading ? (
          <div className="p-16 text-center text-zinc-500 dark:text-zinc-450 bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-700/60 rounded-2xl">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-sm font-medium">Loading asset catalog...</p>
            </div>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="p-16 text-center text-zinc-555 dark:text-zinc-400 bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-700/60 rounded-2xl flex flex-col items-center justify-center max-w-md mx-auto mt-8 space-y-4 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-450 dark:text-zinc-505 border border-zinc-200 dark:border-zinc-800">
              <Database className="w-8 h-8 opacity-60" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">No assets found</h3>
              <p className="text-sm text-zinc-550 dark:text-zinc-450">We couldn&apos;t find any assets matching your search query or filters.</p>
            </div>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedSource("All");
                setSelectedType("All");
              }}
              className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 text-blue-400 font-semibold text-sm rounded-xl transition-all cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAssets.map((asset: Asset, index: number) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
                className="bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-700 hover:border-zinc-450 dark:hover:border-zinc-500 rounded-2xl p-5 shadow-lg transition-all duration-300 relative group overflow-hidden hover:scale-[1.01] flex flex-col justify-between min-h-[190px]"
              >
                {/* Hover gradient glow */}
                <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-xl transition-colors pointer-events-none ${getAssetGlowColor(asset.type)}`} />
                
                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg border ${getAssetTypeColor(asset.type)}`}>
                        {getAssetTypeIcon(asset.type)}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-505 dark:text-zinc-400 capitalize">
                        {asset.type?.replace('_', ' ')}
                      </span>
                    </div>
                    <StatusBadge status={asset.status} />
                  </div>

                  <div>
                    <Link 
                      href={`/assets/${asset.id}`} 
                      className="font-bold text-sm text-zinc-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition-colors line-clamp-1 block cursor-pointer"
                    >
                      {asset.name}
                    </Link>
                    <span className="text-[10px] text-zinc-500 font-mono truncate block max-w-full">ID: {asset.id}</span>
                  </div>
                </div>

                <div className="border-t border-zinc-150 dark:border-zinc-800/80 pt-3 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 relative z-10 mt-4">
                  <div className="flex items-center gap-1.5 font-medium text-zinc-750 dark:text-zinc-300">
                    <Server className="w-3.5 h-3.5" />
                    <span>{asset.source_system}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <OwnerAvatar name={asset.owner} />
                    <CircularProgress value={asset.health_score} size={30} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <DataTable columns={columns} data={filteredAssets} />
        )}
      </div>
    </div>
  );
}
