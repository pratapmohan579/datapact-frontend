"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { PlayCircle, Check, X, TrendingUp, AlertTriangle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ContractLearningPage() {
  const params = useParams();
  const contractId = params?.id as string || "1";

  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [recsRes, statsRes] = await Promise.all([
        fetch(`http://localhost:8000/api/v1/learning/contracts/${contractId}/recommendations`),
        fetch(`http://localhost:8000/api/v1/learning/contracts/${contractId}/statistics`)
      ]);
      const recs = await recsRes.json();
      const st = await statsRes.json();
      setRecommendations(Array.isArray(recs) ? recs : []);
      setStats(Array.isArray(st) ? st : []);
    } catch (e) {
      console.error("Failed to fetch learning data", e);
    } finally {
      setLoading(false);
    }
  }, [contractId]);

  useEffect(() => {
    Promise.resolve().then(fetchData);
  }, [fetchData]);

  const triggerLearning = async () => {
    setTriggering(true);
    try {
      await fetch(`http://localhost:8000/api/v1/learning/contracts/${contractId}/trigger`, {
        method: "POST"
      });
      alert("Learning cycle queued! Please refresh in a moment.");
    } catch (e) {
      alert("Failed to trigger learning");
    } finally {
      setTriggering(false);
    }
  };

  const approveRecommendation = async (recId: number) => {
    await fetch(`http://localhost:8000/api/v1/learning/contracts/${contractId}/recommendations/${recId}/approve`, {
      method: "POST"
    });
    fetchData();
  };

  const rejectRecommendation = async (recId: number) => {
    await fetch(`http://localhost:8000/api/v1/learning/contracts/${contractId}/recommendations/${recId}/reject?reason=UserRejected`, {
      method: "POST"
    });
    fetchData();
  };

  if (loading) {
    return <div className="p-8 text-slate-500">Loading AI Learning Engine...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Contract Learning Engine</h1>
          <p className="text-slate-500 text-sm mt-1">Autonomous evaluation of rule stability based on historical validation runs.</p>
        </div>
        <button 
          onClick={triggerLearning}
          disabled={triggering}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center space-x-2 disabled:opacity-50"
        >
          <PlayCircle className="w-4 h-4" />
          <span>{triggering ? "Running..." : "Run Learning Cycle"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              Recommendation Queue
            </h2>
            {recommendations.length === 0 ? (
              <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                No new recommendations for this contract. It is perfectly optimized!
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="border border-indigo-100 bg-indigo-50/30 rounded-lg p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium text-slate-900">Update Rule: {rec.rule_name}</h3>
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            {rec.confidence}% Confidence
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-2">{rec.explanation}</p>
                        
                        <div className="mt-4 flex items-center space-x-6 text-sm">
                          <div>
                            <span className="text-slate-500 block text-xs uppercase tracking-wider mb-1">Old Threshold</span>
                            <span className="font-mono bg-slate-100 px-2 py-1 rounded line-through text-slate-500">{rec.old_threshold}</span>
                          </div>
                          <div className="text-slate-400">→</div>
                          <div>
                            <span className="text-indigo-600 block text-xs uppercase tracking-wider font-semibold mb-1">New Recommendation</span>
                            <span className="font-mono bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-medium">{rec.new_threshold}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-4">
                        <button onClick={() => approveRecommendation(rec.id)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center justify-center gap-1 transition-colors">
                          <Check className="w-4 h-4" /> Approve
                        </button>
                        <button onClick={() => rejectRecommendation(rec.id)} className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-md text-sm font-medium flex items-center justify-center gap-1 transition-colors">
                          <X className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Metric Drift Dashboard</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.slice().reverse()}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="calculated_at" hide />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                  <Tooltip />
                  <Area type="monotone" dataKey="mean" stroke="#6366F1" fill="#EEF2FF" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Latest Statistics
            </h3>
            {stats.length === 0 ? (
              <p className="text-sm text-slate-500">No learning history available.</p>
            ) : (
              <div className="space-y-3">
                {stats.slice(0, 5).map((s, i) => (
                  <div key={i} className="flex justify-between items-center text-sm border-b border-slate-100 pb-2 last:border-0">
                    <span className="text-slate-600">{s.metric_name}</span>
                    <span className="font-mono font-medium text-slate-900">μ={s.mean?.toFixed(2)} σ={s.std?.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
