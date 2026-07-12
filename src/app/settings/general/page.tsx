"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Upload, Building, Globe, Shield } from "lucide-react";

export default function GeneralSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; is_active: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // Fallback for demo
        return;
      }
      const res = await fetch("http://localhost:8000/api/v1/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("storage"));
    router.push("/auth/login");
  };

  if (loading) return <div className="p-8 text-muted-foreground animate-pulse">Loading account details...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground mb-2 tracking-tight">Organization Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your workspace identity and general preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h2 className="text-sm font-bold text-foreground">Workspace Profile</h2>
          <p className="text-xs text-muted-foreground mt-1">This information will be displayed publicly to your team members.</p>
        </div>
        
        <div className="md:col-span-2 glass-card p-6 space-y-6 text-left border-border">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-workspace to-blue-600 flex items-center justify-center font-bold text-white shadow-lg text-2xl">
              DP
            </div>
            <div className="space-y-2">
              <button className="flex items-center gap-2 bg-secondary hover:bg-muted text-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors border border-border">
                <Upload className="w-4 h-4" />
                Change Logo
              </button>
              <p className="text-xs text-muted-foreground">JPG, GIF or PNG. 1MB max.</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Workspace Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-4 w-4 text-muted-foreground" />
                </div>
                <input 
                  type="text" 
                  defaultValue="DataPact Enterprise" 
                  className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-foreground focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Organization URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </div>
                <input 
                  type="url" 
                  defaultValue="https://datapact.io" 
                  className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-foreground focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
             <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors">
               Save Changes
             </button>
          </div>
        </div>
      </div>
      
      <div className="h-px bg-border w-full"></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h2 className="text-sm font-bold text-foreground">Your Profile</h2>
          <p className="text-xs text-muted-foreground mt-1">Personal settings for your account.</p>
        </div>
        
        <div className="md:col-span-2 glass-card p-6 space-y-6 text-left border-border">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Email Address</label>
              <div className="flex items-center gap-3">
                <input 
                  type="email" 
                  readOnly 
                  value={user?.email || ""} 
                  className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-purple-500 opacity-70"
                />
                <span className="bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold px-3 py-1.5 rounded-md border border-green-500/20 flex items-center gap-1.5 whitespace-nowrap">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Verified
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Account Role</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-4 w-4 text-blue-500" />
                </div>
                <input 
                  type="text" 
                  readOnly 
                  value="Administrator" 
                  className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-2.5 text-muted-foreground cursor-not-allowed font-medium opacity-70"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-border w-full"></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h2 className="text-sm font-bold text-red-500">Danger Zone</h2>
          <p className="text-xs text-muted-foreground mt-1">Irreversible and destructive actions.</p>
        </div>
        
        <div className="md:col-span-2 glass-card p-6 border-red-500/20 bg-red-500/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">Sign Out</h3>
              <p className="text-xs text-muted-foreground mt-1">Log out of your current session on this device.</p>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold py-2 px-6 rounded-md transition-colors border border-red-500/30 flex items-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Sign Out
            </button>
          </div>
          
          <div className="h-px bg-red-500/20 w-full my-6"></div>
          
           <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">Delete Workspace</h3>
              <p className="text-xs text-muted-foreground mt-1">Permanently delete this workspace and all of its data.</p>
            </div>
            <button 
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md transition-colors text-sm"
            >
              Delete Workspace
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
