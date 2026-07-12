"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Shield, Smartphone, Clock, MapPin, History, LogOut } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading profile
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("storage"));
    router.push("/auth/login");
  };

  if (loading) return <div className="p-8 text-muted-foreground animate-pulse max-w-4xl mx-auto mt-10">Loading profile...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto p-8 pt-10">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Left Column: Identity & Primary Actions */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="glass-card p-6 border-border flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl mb-4 border-4 border-background">
              KA
            </div>
            <h2 className="text-xl font-bold text-foreground">Kazi Alam</h2>
            <p className="text-sm text-muted-foreground mb-4">admin@datapact.io</p>
            
            <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 bg-green-500/10 text-green-500 rounded-full border border-green-500/20 mb-6">
              <Shield className="w-3 h-3" />
              Workspace Admin
            </div>

            <button className="w-full bg-secondary hover:bg-muted text-foreground border border-border py-2 rounded-lg text-sm font-medium transition-colors mb-3">
              Edit Profile
            </button>
            <button 
              onClick={handleLogout}
              className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          <div className="glass-card p-6 border-border space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">Security Overview</h3>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2"><Smartphone className="w-4 h-4" /> 2FA Setup</span>
              <span className="text-green-500 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2"><Mail className="w-4 h-4" /> Email Auth</span>
              <span className="text-green-500 font-medium">Verified</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2"><Clock className="w-4 h-4" /> Last Password Change</span>
              <span className="text-foreground">3 months ago</span>
            </div>
          </div>
        </div>

        {/* Right Column: Active Sessions & History */}
        <div className="w-full md:w-2/3 space-y-6">
          <div className="glass-card p-0 border-border overflow-hidden">
            <div className="p-6 border-b border-border bg-card/50">
              <h2 className="text-lg font-bold text-foreground">Active Sessions</h2>
              <p className="text-sm text-muted-foreground">Manage devices currently logged into your account.</p>
            </div>
            <div className="divide-y divide-border">
              <div className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground flex items-center gap-2">MacBook Pro (Chrome) <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-green-500/20 text-green-500 rounded">Current</span></h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> San Francisco, US • IP: 192.168.1.1</p>
                  </div>
                </div>
              </div>
              <div className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">iPhone 14 Pro (Safari)</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> New York, US • IP: 104.28.1.2</p>
                  </div>
                </div>
                <button className="text-sm font-medium text-red-500 hover:text-red-400 bg-red-500/10 px-3 py-1.5 rounded transition-colors">
                  Revoke
                </button>
              </div>
            </div>
          </div>

          <div className="glass-card p-0 border-border overflow-hidden">
             <div className="p-6 border-b border-border bg-card/50 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">Security History</h2>
                <p className="text-sm text-muted-foreground">Recent authentication events on your account.</p>
              </div>
              <button className="text-xs font-medium text-blue-500 hover:text-blue-400 flex items-center gap-1">
                View All <History className="w-3 h-3" />
              </button>
            </div>
            <div className="p-0">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Event</th>
                    <th className="px-6 py-3 font-semibold">Location</th>
                    <th className="px-6 py-3 font-semibold">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">Successful Login</td>
                    <td className="px-6 py-4 text-muted-foreground">San Francisco, US</td>
                    <td className="px-6 py-4 text-muted-foreground">Oct 24, 2024, 09:41 AM</td>
                  </tr>
                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">2FA Enabled</td>
                    <td className="px-6 py-4 text-muted-foreground">San Francisco, US</td>
                    <td className="px-6 py-4 text-muted-foreground">Oct 20, 2024, 02:15 PM</td>
                  </tr>
                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">Password Changed</td>
                    <td className="px-6 py-4 text-muted-foreground">San Francisco, US</td>
                    <td className="px-6 py-4 text-muted-foreground">Jul 15, 2024, 11:30 AM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
