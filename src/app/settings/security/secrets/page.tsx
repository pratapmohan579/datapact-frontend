"use client";

import React, { useState, useEffect } from "react";
import { Shield, Key, RefreshCw, AlertCircle, CheckCircle2, Server, Clock } from "lucide-react";
import api from "@/lib/api"; // Assuming typical next.js api client

interface SecretHealth {
  status: string;
  latency_ms?: number;
  version?: string;
  namespace?: string;
  reason?: string;
}

export default function SecretsManagementPage() {
  const [health, setHealth] = useState<SecretHealth | null>(null);
  const [secrets, setSecrets] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [healthRes, secretsRes] = await Promise.all([
        api.get("/secrets/health").catch((e) => e.response?.data?.detail || { status: "UNHEALTHY" }),
        api.get("/secrets/").catch(() => ({ data: { keys: [] } }))
      ]);
      setHealth(healthRes.data || healthRes);
      setSecrets(secretsRes.data?.keys || []);
    } catch (error) {
      console.error("Failed to fetch secrets data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRotate = async (path: string) => {
    try {
      await api.post(`/secrets/${path}/rotate`);
      alert(`Rotation triggered for ${path}`);
    } catch (e) {
      alert("Failed to rotate secret");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto text-slate-100 min-h-screen font-inter">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 flex items-center gap-3">
            <Shield className="text-blue-500 w-8 h-8" />
            Enterprise Secrets Management
          </h1>
          <p className="text-slate-400 mt-2">Manage secure connections, API keys, and OpenBao infrastructure</p>
        </div>
        <button 
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm font-medium rounded-lg transition-colors border border-slate-700 hover:border-slate-600"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Status
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Health Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-sm font-medium text-slate-400">Vault Health</p>
              <h2 className="text-2xl font-bold mt-1 text-white flex items-center gap-2">
                {health?.status === "HEALTHY" ? (
                  <><CheckCircle2 className="text-green-500 w-6 h-6" /> Online</>
                ) : (
                  <><AlertCircle className="text-red-500 w-6 h-6" /> Offline</>
                )}
              </h2>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
              <Server className="w-6 h-6" />
            </div>
          </div>
          {health?.status === "HEALTHY" && (
            <div className="mt-4 flex gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {health.latency_ms}ms ping</span>
              <span>v{health.version}</span>
            </div>
          )}
        </div>

        {/* Managed Secrets Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-sm font-medium text-slate-400">Managed Secrets</p>
              <h2 className="text-2xl font-bold mt-1 text-white">{secrets.length}</h2>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500">
              <Key className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-lg font-semibold text-white">Active Secret Paths</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50">
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Path</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Provider</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500">Loading secrets...</td>
                </tr>
              ) : secrets.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500">No secrets found in vault.</td>
                </tr>
              ) : (
                secrets.map((path) => (
                  <tr key={path} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-200 font-mono">{path}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-cyan-500/10 text-cyan-400 text-xs rounded border border-cyan-500/20">
                        OpenBao
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleRotate(path)}
                        className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 rounded border border-purple-500/20"
                      >
                        Rotate Key
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
