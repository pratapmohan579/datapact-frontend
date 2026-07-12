"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/axios";
import { useAppStore } from "@/store/useAppStore";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgName, setOrgName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [copied, setCopied] = useState(false);
  const { fetchCurrentUser } = useAppStore();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiClient.post("/provisioning/signup", {
        email,
        password,
        organization_name: orgName,
        workspace_name: "Default Workspace"
      });

      // Auto-login after signup to get token
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);
      
      const loginRes = await apiClient.post("/auth/login", formData.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });
      
      localStorage.setItem("access_token", loginRes.data.access_token);
      await fetchCurrentUser();
      
      // Show API key info in UI
      setApiKey(res.data.api_key);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 glass-card p-8 animate-in fade-in duration-500">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
            {apiKey ? "Welcome to DataPact!" : "Create an account"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {apiKey ? "Your account has been created successfully." : "Start your free trial today."}
          </p>
        </div>
        
        {apiKey ? (
          <div className="mt-8 space-y-6">
            <div className="bg-purple-500/10 border border-purple-500/30 p-6 rounded-lg text-center">
              <h3 className="text-lg font-bold text-foreground mb-2">Your Agent API Key</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Please copy and save this key now. For security reasons, it will never be shown again.
              </p>
              
              <div className="flex items-center gap-2 mb-6">
                <input 
                  type="text" 
                  readOnly 
                  value={apiKey} 
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 font-mono text-sm text-foreground focus:outline-none"
                />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(apiKey);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="bg-secondary hover:bg-muted border border-border text-foreground px-4 py-3 rounded-lg font-medium transition whitespace-nowrap"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              
              <button
                onClick={() => router.push("/")}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition"
              >
                Continue to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <>
            {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-lg">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Organization Name</label>
              <input
                type="text"
                required
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full bg-background border border-input rounded-lg px-4 py-2.5 text-foreground focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="Acme Corp"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-input rounded-lg px-4 py-2.5 text-foreground focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-input rounded-lg px-4 py-2.5 text-foreground focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>
        
          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account? <Link href="/auth/login" className="text-purple-500 hover:text-purple-400 font-medium">Sign in</Link>
          </p>
          </>
        )}
      </div>
    </div>
  );
}
