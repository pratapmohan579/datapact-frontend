"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/apiClient";
import { Plus, Trash2, Database, AlertCircle, RefreshCw } from "lucide-react";

interface DataSource {
  id: number;
  workspace_id: number;
  name: string;
  source_type: string;
  status: string;
  last_sync_at: string | null;
  created_at: string;
}

export default function DataSourcesPage() {
  const [sources, setSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    source_type: "PostgreSQL",
    credentials: ""
  });

  const fetchSources = async () => {
    try {
      setLoading(true);
      const data = await api.get<DataSource[]>("/data-sources");
      setSources(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch data sources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await api.post("/data-sources", formData);
      setIsModalOpen(false);
      setFormData({ name: "", source_type: "PostgreSQL", credentials: "" });
      fetchSources();
    } catch (err: any) {
      alert("Failed to add data source: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSource = async (id: number) => {
    if (!confirm("Are you sure you want to delete this data source?")) return;
    try {
      // Handle 204 No Content response
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/data-sources/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchSources();
    } catch (err: any) {
      alert("Failed to delete data source: " + err.message);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif mb-2">Data Sources</h1>
          <p className="text-muted-foreground">Manage connections to your databases and data warehouses.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Add Source
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2 border border-red-200">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center text-muted-foreground">
            <RefreshCw size={24} className="animate-spin" />
          </div>
        ) : sources.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <Database size={48} className="mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium text-foreground mb-2">No Data Sources Connected</h3>
            <p className="mb-6">Connect your first data source to start discovering metadata and enforcing contracts.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-secondary hover:bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-colors border border-border"
            >
              Add Data Source
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/50 border-b border-border">
                  <th className="p-4 font-semibold text-muted-foreground">Name</th>
                  <th className="p-4 font-semibold text-muted-foreground">Type</th>
                  <th className="p-4 font-semibold text-muted-foreground">Status</th>
                  <th className="p-4 font-semibold text-muted-foreground">Added On</th>
                  <th className="p-4 font-semibold text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sources.map(source => (
                  <tr key={source.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                    <td className="p-4 font-medium flex items-center gap-2">
                      <Database size={16} className="text-blue-500" />
                      {source.name}
                    </td>
                    <td className="p-4">
                      <span className="bg-secondary px-2.5 py-1 rounded text-xs font-semibold border border-border">
                        {source.source_type}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        {source.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(source.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDeleteSource(source.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                        title="Delete Source"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Source Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card w-full max-w-md rounded-xl shadow-xl overflow-hidden border border-border animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold">Add Data Source</h2>
              <p className="text-sm text-muted-foreground mt-1">Connect a new database or data warehouse.</p>
            </div>
            
            <form onSubmit={handleAddSource} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Source Name</label>
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Production Postgres"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Source Type</label>
                <select 
                  value={formData.source_type}
                  onChange={e => setFormData({...formData, source_type: e.target.value})}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <optgroup label="Databases">
                    <option value="PostgreSQL">PostgreSQL</option>
                    <option value="MySQL">MySQL</option>
                    <option value="SQL Server">SQL Server</option>
                    <option value="Oracle">Oracle</option>
                    <option value="SQLite">SQLite</option>
                  </optgroup>
                  <optgroup label="Data Lakes">
                    <option value="Delta Lake">Delta Lake</option>
                    <option value="Iceberg">Iceberg</option>
                    <option value="Hudi">Hudi</option>
                  </optgroup>
                  <optgroup label="File Sources">
                    <option value="CSV">CSV</option>
                    <option value="Parquet">Parquet</option>
                    <option value="JSON">JSON</option>
                    <option value="Excel">Excel</option>
                  </optgroup>
                  <optgroup label="Cloud Warehouses">
                    <option value="Snowflake">Snowflake</option>
                    <option value="BigQuery">BigQuery</option>
                    <option value="Redshift">Redshift</option>
                    <option value="Databricks SQL">Databricks SQL</option>
                    <option value="Azure Synapse">Azure Synapse</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Connection String / Credentials</label>
                <textarea 
                  required
                  value={formData.credentials}
                  onChange={e => setFormData({...formData, credentials: e.target.value})}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono h-24"
                  placeholder="postgres://user:pass@localhost:5432/db"
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg font-medium text-muted-foreground hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {isSubmitting ? 'Connecting...' : 'Connect Source'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
