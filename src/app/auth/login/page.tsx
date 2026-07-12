"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/axios";
import { useAppStore } from "@/store/useAppStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [isMfaRequired, setIsMfaRequired] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { fetchCurrentUser } = useAppStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const res = await apiClient.post("/auth/login", formData.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });

      if (res.data.mfa_required) {
        setIsMfaRequired(true);
        // Store temp token if backend requires it for the MFA call, though currently our MFA call just takes email + code.
      } else {
        localStorage.setItem("access_token", res.data.access_token);
        await fetchCurrentUser();
        router.push("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await apiClient.post("/auth/login/mfa", {
        email: email,
        mfa_code: mfaCode
      });
      
      localStorage.setItem("access_token", res.data.access_token);
      await fetchCurrentUser();
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-[70vh]">
      <div className="glass-card p-10 w-full max-w-md animate-float">
        <h2 className="text-3xl font-bold mb-2 text-foreground">
          {isMfaRequired ? "Two-Factor Authentication" : "Welcome Back"}
        </h2>
        <p className="text-muted-foreground mb-8">
          {isMfaRequired 
            ? "Enter the code from your authenticator app"
            : "Sign in to your DataPact workspace"}
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {!isMfaRequired ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="you@company.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-lg"
            >
              Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={handleMfaSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Authentication Code</label>
              <input
                type="text"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all tracking-widest text-center text-xl"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-lg"
            >
              Verify Code
            </button>
            <button
              type="button"
              onClick={() => setIsMfaRequired(false)}
              className="w-full text-muted-foreground text-sm hover:text-foreground mt-2"
            >
              Back to Login
            </button>
          </form>
        )}
        
        {!isMfaRequired && (
          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account? <Link href="/auth/signup" className="text-purple-500 hover:text-purple-400 font-medium">Sign up</Link>
          </p>
        )}
      </div>
    </div>
  );
}
