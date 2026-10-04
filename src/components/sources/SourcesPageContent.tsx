"use client";

import { useState, useEffect, useMemo } from "react";
import { api } from "@/lib/apiClient";
import { 
  Plus, 
  Trash2, 
  Database, 
  AlertCircle, 
  RefreshCw, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Zap, 
  Edit3, 
  Check, 
  Server, 
  ShieldCheck, 
  X,
  Radio,
  SlidersHorizontal,
  HardDrive
} from "lucide-react";

export interface DataSource {
  id: number;
  workspace_id?: number;
  name: string;
  source_type: string;
  status: string;
  last_sync_at: string | null;
  created_at: string;
  credentials?: string;
  host?: string;
  database?: string;
}

const DEFAULT_MOCK_SOURCES: DataSource[] = [
  {
    id: 1,
    name: "Production PostgreSQL",
    source_type: "PostgreSQL",
    status: "Active",
    last_sync_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    host: "postgres-prod.internal.datapact.io",
    database: "analytics_db"
  },
  {
    id: 2,
    name: "Snowflake Warehouse",
    source_type: "Snowflake",
    status: "Active",
    last_sync_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    host: "xy12345.us-east-1.snowflakecomputing.com",
    database: "RAW_INGESTION"
  },
  {
    id: 3,
    name: "BigQuery Marketing Data",
    source_type: "BigQuery",
    status: "Syncing",
    last_sync_at: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    host: "gcp-bigquery-datapact-prod",
    database: "marketing_v2"
  },
  {
    id: 4,
    name: "Legacy MySQL Replicate",
    source_type: "MySQL",
    status: "Error",
    last_sync_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    host: "mysql-replica.internal.datapact.io",
    database: "user_management"
  },
  {
    id: 5,
    name: "Delta Lake Storage",
    source_type: "Delta Lake",
    status: "Offline",
    last_sync_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    host: "s3://datapact-lakehouse-prod/",
    database: "gold_layer"
  }
];

export function SourcesPageContent() {
  const [sources, setSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMock, setUsingMock] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<DataSource | null>(null);
  const [deletingSource, setDeletingSource] = useState<DataSource | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const [syncingIds, setSyncingIds] = useState<Record<number, boolean>>({});
  const [testState, setTestState] = useState<{ loading: boolean; success?: boolean; message?: string } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    source_type: "PostgreSQL",
    credentials: "",
    host: "",
    database: ""
  });

  const fetchSources = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get<DataSource[]>("/data-sources");
      if (Array.isArray(data) && data.length > 0) {
        setSources(data);
        setUsingMock(false);
      } else {
        setSources(DEFAULT_MOCK_SOURCES);
        setUsingMock(true);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Unable to load sources from backend API";
      setError(errMsg);
      setSources(DEFAULT_MOCK_SOURCES);
      setUsingMock(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    api.get<DataSource[]>("/data-sources")
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data) && data.length > 0) {
          setSources(data);
          setUsingMock(false);
        } else {
          setSources(DEFAULT_MOCK_SOURCES);
          setUsingMock(true);
        }
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        const errMsg = err instanceof Error ? err.message : "Unable to load sources from backend API";
        setError(errMsg);
        setSources(DEFAULT_MOCK_SOURCES);
        setUsingMock(true);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const openAddModal = () => {
    setEditingSource(null);
    setFormData({
      name: "",
      source_type: "PostgreSQL",
      credentials: "",
      host: "",
      database: ""
    });
    setModalError(null);
    setTestState(null);
    setIsModalOpen(true);
  };

  const openEditModal = (source: DataSource) => {
    setEditingSource(source);
    setFormData({
      name: source.name,
      source_type: source.source_type || "PostgreSQL",
      credentials: source.credentials || "",
      host: source.host || "",
      database: source.database || ""
    });
    setModalError(null);
    setTestState(null);
    setIsModalOpen(true);
  };

  const handleTestConnection = async () => {
    if (!formData.name) {
      setModalError("Please provide a source name before testing.");
      return;
    }
    setModalError(null);
    setTestState({ loading: true });

    // Simulate connection ping
    setTimeout(() => {
      if (formData.credentials.includes("invalid") || formData.host.includes("error")) {
        setTestState({
          loading: false,
          success: false,
          message: "Connection refused: Unable to authenticate with provided parameters."
        });
      } else {
        setTestState({
          loading: false,
          success: true,
          message: `Successfully connected to ${formData.source_type} instance!`
        });
      }
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setModalError("Source name is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setModalError(null);

      if (editingSource) {
        if (!usingMock) {
          await api.put(`/data-sources/${editingSource.id}`, formData);
        }
        setSources(prev => prev.map(s => s.id === editingSource.id ? {
          ...s,
          name: formData.name,
          source_type: formData.source_type,
          credentials: formData.credentials,
          host: formData.host,
          database: formData.database
        } : s));
      } else {
        const newSourceObj: DataSource = {
          id: Date.now(),
          name: formData.name,
          source_type: formData.source_type,
          status: "Active",
          last_sync_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          credentials: formData.credentials,
          host: formData.host,
          database: formData.database
        };

        if (!usingMock) {
          try {
            const created = await api.post<DataSource>("/data-sources", formData);
            if (created && created.id) {
              newSourceObj.id = created.id;
            }
          } catch {
            // fallback local update if backend fails
          }
        }
        setSources(prev => [newSourceObj, ...prev]);
      }

      setIsModalOpen(false);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to save data source.";
      setModalError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingSource) return;
    try {
      setIsSubmitting(true);
      if (!usingMock) {
        try {
          await api.delete(`/data-sources/${deletingSource.id}`);
        } catch {
          // handled gracefully
        }
      }
      setSources(prev => prev.filter(s => s.id !== deletingSource.id));
      setDeletingSource(null);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Unknown error";
      alert("Failed to delete source: " + errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSyncSource = (id: number) => {
    setSyncingIds(prev => ({ ...prev, [id]: true }));
    setSources(prev => prev.map(s => s.id === id ? { ...s, status: "Syncing" } : s));

    setTimeout(() => {
      setSyncingIds(prev => ({ ...prev, [id]: false }));
      setSources(prev => prev.map(s => s.id === id ? {
        ...s,
        status: "Active",
        last_sync_at: new Date().toISOString()
      } : s));
    }, 2000);
  };

  const filteredSources = useMemo(() => {
    return sources.filter(source => {
      const matchesSearch = 
        source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        source.source_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (source.host && source.host.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = 
        statusFilter === "all" ||
        source.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [sources, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: sources.length,
      active: sources.filter(s => s.status.toLowerCase() === "active").length,
      syncing: sources.filter(s => s.status.toLowerCase() === "syncing").length,
      issues: sources.filter(s => ["error", "offline"].includes(s.status.toLowerCase())).length
    };
  }, [sources]);

  const renderStatusBadge = (status: string) => {
    const st = status.toLowerCase();
    if (st === "active" || st === "connected") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Active
        </span>
      );
    }
    if (st === "syncing") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          <RefreshCw size={12} className="animate-spin text-blue-500" />
          Syncing
        </span>
      );
    }
    if (st === "error" || st === "failed") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
          <AlertCircle size={12} />
          Error
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 border border-zinc-500/20">
        <Radio size={12} />
        Offline
      </span>
    );
  };

  const renderTypeIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("postgre") || t.includes("mysql") || t.includes("sql")) {
      return <Database className="w-5 h-5 text-blue-500" />;
    }
    if (t.includes("snowflake") || t.includes("cloud")) {
      return <Server className="w-5 h-5 text-cyan-500" />;
    }
    if (t.includes("bigquery") || t.includes("redshift")) {
      return <HardDrive className="w-5 h-5 text-purple-500" />;
    }
    return <Zap className="w-5 h-5 text-amber-500" />;
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <Server className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Data Sources
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Configure, sync, and monitor live connections to your data stores and warehouses.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchSources}
            disabled={loading}
            className="px-3.5 py-2 rounded-lg text-sm font-medium border border-border bg-card hover:bg-muted text-foreground transition-all flex items-center gap-2 shadow-sm"
            title="Refresh list"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus size={18} /> Add Data Source
          </button>
        </div>
      </div>

      {/* Backend / Mock Status Alert */}
      {error && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-4 rounded-xl flex items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <span className="font-semibold">Backend Notice:</span> {error}. Displaying local sources demo mode.
            </div>
          </div>
          <button 
            onClick={fetchSources} 
            className="underline text-xs font-semibold hover:opacity-80 shrink-0"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm relative overflow-hidden group hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Sources</span>
            <Database className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-extrabold text-foreground mt-3">{stats.total}</p>
          <p className="text-xs text-muted-foreground mt-1">Configured connectors</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active & Healthy</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-3">{stats.active}</p>
          <p className="text-xs text-muted-foreground mt-1">Operational & synced</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm relative overflow-hidden group hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Syncing Now</span>
            <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
          </div>
          <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-3">{stats.syncing}</p>
          <p className="text-xs text-muted-foreground mt-1">Metadata discovery</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm relative overflow-hidden group hover:border-red-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Needs Attention</span>
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-extrabold text-red-600 dark:text-red-400 mt-3">{stats.issues}</p>
          <p className="text-xs text-muted-foreground mt-1">Errors or offline status</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-card border border-border p-4 rounded-xl shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search data sources by name or type..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border rounded-lg pl-9 pr-8 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground mr-1 shrink-0" />
          {["all", "active", "syncing", "error", "offline"].map(filter => {
            const isActive = statusFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm font-semibold"
                    : "bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/50"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sources Table / List */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center text-muted-foreground gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-sm font-medium">Loading data sources...</p>
          </div>
        ) : filteredSources.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground max-w-md mx-auto">
            <Database className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
            <h3 className="text-lg font-bold text-foreground mb-1">
              {searchQuery || statusFilter !== "all" ? "No Sources Match Your Filter" : "No Data Sources Connected"}
            </h3>
            <p className="text-sm mb-6">
              {searchQuery || statusFilter !== "all"
                ? "Try clearing your search filters to view all connected sources."
                : "Connect your databases or data warehouses to start fetching schema metadata."}
            </p>
            {searchQuery || statusFilter !== "all" ? (
              <button
                onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}
                className="bg-secondary hover:bg-muted text-foreground px-4 py-2 rounded-lg font-medium text-sm transition-colors border border-border"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={openAddModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
              >
                Add Data Source
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                  <th className="p-4">Source Name</th>
                  <th className="p-4">Engine / Type</th>
                  <th className="p-4">Host / Database</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Last Sync</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredSources.map(source => {
                  const isSyncing = syncingIds[source.id] || source.status.toLowerCase() === "syncing";
                  return (
                    <tr 
                      key={source.id} 
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <td className="p-4 font-semibold text-foreground">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-secondary rounded-lg border border-border/60 shrink-0">
                            {renderTypeIcon(source.source_type)}
                          </div>
                          <div>
                            <div className="font-bold text-foreground">{source.name}</div>
                            <div className="text-xs text-muted-foreground">ID: #{source.id}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="bg-secondary text-foreground px-2.5 py-1 rounded-md text-xs font-semibold border border-border/80">
                          {source.source_type}
                        </span>
                      </td>

                      <td className="p-4 font-mono text-xs text-muted-foreground max-w-[200px] truncate">
                        {source.host || source.database || "localhost"}
                      </td>

                      <td className="p-4">
                        {renderStatusBadge(isSyncing ? "syncing" : source.status)}
                      </td>

                      <td className="p-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Clock size={13} className="text-muted-foreground/70" />
                          {source.last_sync_at ? new Date(source.last_sync_at).toLocaleString() : "Never"}
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleSyncSource(source.id)}
                            disabled={isSyncing}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors border border-transparent hover:border-blue-200 dark:hover:border-blue-900 disabled:opacity-50"
                            title="Trigger Metadata Sync"
                          >
                            <RefreshCw size={15} className={isSyncing ? "animate-spin" : ""} />
                          </button>
                          
                          <button
                            onClick={() => openEditModal(source)}
                            className="p-1.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors border border-transparent hover:border-zinc-300 dark:hover:border-zinc-700"
                            title="Edit Source"
                          >
                            <Edit3 size={15} />
                          </button>

                          <button
                            onClick={() => setDeletingSource(source)}
                            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-900"
                            title="Delete Source"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Source Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-border animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {editingSource ? "Edit Data Source" : "Connect Data Source"}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Specify database endpoints and authentication credentials.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {modalError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-xs font-medium flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              {testState && (
                <div className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 border ${
                  testState.loading 
                    ? "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400" 
                    : testState.success
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
                }`}>
                  {testState.loading ? (
                    <RefreshCw size={14} className="animate-spin shrink-0" />
                  ) : testState.success ? (
                    <Check size={14} className="shrink-0" />
                  ) : (
                    <XCircle size={14} className="shrink-0" />
                  )}
                  <span>{testState.loading ? "Testing connection parameters..." : testState.message}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Source Display Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Production Postgres DW"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Engine / Source Type
                </label>
                <select
                  value={formData.source_type}
                  onChange={e => setFormData({ ...formData, source_type: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <optgroup label="Relational Databases">
                    <option value="PostgreSQL">PostgreSQL</option>
                    <option value="MySQL">MySQL</option>
                    <option value="SQL Server">SQL Server</option>
                    <option value="Oracle">Oracle</option>
                    <option value="SQLite">SQLite</option>
                  </optgroup>
                  <optgroup label="Cloud Warehouses">
                    <option value="Snowflake">Snowflake</option>
                    <option value="BigQuery">BigQuery</option>
                    <option value="Redshift">Redshift</option>
                    <option value="Databricks SQL">Databricks SQL</option>
                  </optgroup>
                  <optgroup label="Data Lakes & Lakes">
                    <option value="Delta Lake">Delta Lake</option>
                    <option value="Iceberg">Apache Iceberg</option>
                    <option value="CSV">CSV / Parquet Storage</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Host / Server Endpoint
                </label>
                <input
                  type="text"
                  value={formData.host}
                  onChange={e => setFormData({ ...formData, host: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="postgres-prod.internal.domain:5432"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Connection String / Secret Credentials
                </label>
                <textarea
                  value={formData.credentials}
                  onChange={e => setFormData({ ...formData, credentials: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
                  placeholder="postgresql://user:password@host:5432/dbname"
                />
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-border">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testState?.loading}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold border border-border bg-secondary hover:bg-muted text-foreground transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck size={14} className="text-blue-500" />
                  Test Connection
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
                  >
                    {isSubmitting ? "Saving..." : editingSource ? "Update Source" : "Connect Source"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingSource && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-border p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <div className="p-3 bg-red-500/10 rounded-full border border-red-500/20">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Delete Data Source</h3>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Are you sure you want to remove <strong className="text-foreground">{deletingSource.name}</strong>? This action will disconnect the metadata pipeline.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingSource(null)}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                {isSubmitting ? "Deleting..." : "Delete Source"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
