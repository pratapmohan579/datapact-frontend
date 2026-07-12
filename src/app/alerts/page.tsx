"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAlerts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }
      try {
        const res = await fetch("/api/v1/alerts", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setAlerts(await res.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, [router]);

  if (loading) return <div className="text-foreground text-center py-20">Loading Alerts...</div>;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground mb-2">Notification & Alerts</h1>
        <p className="text-muted-foreground">View SLA breaches and data quality anomalies that have been dispatched.</p>
      </div>

      <div className="glass-card overflow-hidden">
        {alerts.length === 0 ? (
          <div className="px-6 py-12 text-center text-muted-foreground">
            <svg className="w-12 h-12 mx-auto text-muted-foreground mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p>No active alerts! Your data pipelines are running smoothly.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {alerts.map((alert: any) => (
              <div key={alert.id} className="p-6 hover:bg-muted transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${alert.status === 'ACTIVE' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                      {alert.status}
                    </span>
                    <h3 className="text-lg font-bold text-foreground">Contract #{alert.contract_id}</h3>
                    <span className="text-muted-foreground text-sm">{alert.alert_type}</span>
                  </div>
                </div>
                
                {alert.history && alert.history.length > 0 && (
                  <div className="mt-4 pl-4 border-l-2 border-border space-y-4">
                    {alert.history.map((hist: any) => (
                      <div key={hist.id} className="text-sm bg-muted/50 p-4 rounded-md">
                        <div className="text-muted-foreground mb-2 font-mono text-xs">{new Date(hist.sent_at).toLocaleString()}</div>
                        <div className="text-foreground whitespace-pre-wrap font-mono text-sm leading-relaxed">{hist.message}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
