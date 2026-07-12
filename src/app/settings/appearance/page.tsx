"use client";

import { useTheme } from "@/providers/ThemeProvider";
import { Sparkles } from "lucide-react";

export default function AppearanceSettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground mb-2 tracking-tight">Appearance</h1>
        <p className="text-muted-foreground text-sm">Customize the look and feel of DataPact to match your preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h2 className="text-sm font-bold text-foreground">Theme Settings</h2>
          <p className="text-xs text-muted-foreground mt-1">Choose between the clean Enterprise Light, polished Enterprise Dark, or the immersive Midnight Pro themes.</p>
        </div>
        
        <div className="md:col-span-2 glass-card p-6 space-y-6 text-left border-border">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Enterprise Light */}
            <button 
              onClick={() => setTheme("light")}
              className={`flex flex-col items-start gap-3 p-4 rounded-xl border-2 transition-all text-left ${theme === 'light' ? 'border-blue-500 bg-blue-500/5' : 'border-border hover:border-muted-foreground bg-card'}`}
            >
              <div className="w-full h-24 rounded-lg bg-[#F7F8FA] border border-gray-200 flex flex-col p-2 gap-2 shadow-sm">
                <div className="w-full h-3 bg-white rounded shadow-sm border border-gray-100"></div>
                <div className="flex gap-2 flex-1">
                  <div className="w-6 h-full bg-white rounded shadow-sm border border-gray-100"></div>
                  <div className="flex-1 h-full bg-white rounded shadow-sm border border-gray-100"></div>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">Enterprise Light</h3>
                <p className="text-xs text-muted-foreground mt-1">Warm, clean, soft shadows.</p>
              </div>
            </button>
            
            {/* Enterprise Dark */}
            <button 
              onClick={() => setTheme("dark")}
              className={`flex flex-col items-start gap-3 p-4 rounded-xl border-2 transition-all text-left ${theme === 'dark' ? 'border-blue-500 bg-blue-500/5' : 'border-border hover:border-muted-foreground bg-card'}`}
            >
              <div className="w-full h-24 rounded-lg bg-[#0F1117] border border-gray-800 flex flex-col p-2 gap-2 shadow-sm">
                <div className="w-full h-3 bg-[#1A1D24] rounded shadow-sm border border-gray-800"></div>
                <div className="flex gap-2 flex-1">
                  <div className="w-6 h-full bg-[#1A1D24] rounded shadow-sm border border-gray-800"></div>
                  <div className="flex-1 h-full bg-[#1A1D24] rounded shadow-sm border border-gray-800"></div>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">Enterprise Dark</h3>
                <p className="text-xs text-muted-foreground mt-1">Polished, layered, muted.</p>
              </div>
            </button>

            {/* Midnight Pro */}
            <button 
              onClick={() => setTheme("midnight-pro")}
              className={`flex flex-col items-start gap-3 p-4 rounded-xl border-2 transition-all text-left relative overflow-hidden ${theme === 'midnight-pro' ? 'border-purple-500 bg-purple-500/10' : 'border-border hover:border-muted-foreground bg-card'}`}
            >
              <div className="absolute top-0 right-0 p-1">
                <Sparkles className="w-3 h-3 text-purple-400" />
              </div>
              <div className="w-full h-24 rounded-lg bg-[#0A0A0F] border border-[#1A1A24] flex flex-col p-2 gap-2 shadow-[inset_0_0_20px_rgba(139,92,246,0.1)]">
                <div className="w-full h-3 bg-[#12121A]/80 backdrop-blur-md rounded shadow-sm border border-[#2A2A35]"></div>
                <div className="flex gap-2 flex-1">
                  <div className="w-6 h-full bg-[#12121A]/80 backdrop-blur-md rounded shadow-sm border border-[#2A2A35]"></div>
                  <div className="flex-1 h-full bg-[#12121A]/80 backdrop-blur-md rounded shadow-sm border border-[#2A2A35]"></div>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">Midnight Pro <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text text-[10px] uppercase tracking-wider">AI</span></h3>
                <p className="text-xs text-muted-foreground mt-1">Charcoal, glassmorphism, neon.</p>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      <div className="h-px bg-border w-full"></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h2 className="text-sm font-bold text-foreground">Density</h2>
          <p className="text-xs text-muted-foreground mt-1">Control the spacing and compactness of UI elements.</p>
        </div>
        
        <div className="md:col-span-2 glass-card p-6 border-border space-y-4">
           <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">Compact Mode</h3>
                <p className="text-xs text-muted-foreground mt-1">Reduce spacing to fit more content on screen. Ideal for large tables.</p>
              </div>
              <div className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </div>
           </div>
        </div>
      </div>

    </div>
  );
}
