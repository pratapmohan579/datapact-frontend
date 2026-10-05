"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { 
  Bot, X, Maximize2, Minimize2, Send, Database, Shield, AlertTriangle, Users, BookOpen, Sparkles 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  context?: { asset: string; type: string };
  actions?: string[];
}

// Mock Conversation History
const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content: "Hi! I'm DataPact AI. I noticed you are viewing the **fct_sales** dataset. The null rate for `customer_id` has spiked to 2.4% today.\n\nWould you like me to run an investigation?",
    context: { asset: "analytics.fct_sales", type: "anomaly" }
  }
];

export default function PersistentCopilot({ overrideVisibility = false }: { overrideVisibility?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const pathname = usePathname();
  
  // If overridden by RightSidebar, it's always "open" and not floating
  const isEffectivelyOpen = overrideVisibility || isOpen;

  // Determine current context based on route
  const getContext = () => {
    if (pathname?.includes('/assets')) return { icon: <Database className="w-4 h-4"/>, label: "Asset Catalog" };
    if (pathname?.includes('/contracts')) return { icon: <Shield className="w-4 h-4"/>, label: "Data Contracts" };
    if (pathname?.includes('/incidents')) return { icon: <AlertTriangle className="w-4 h-4"/>, label: "Incidents" };
    if (pathname?.includes('/ownership')) return { icon: <Users className="w-4 h-4"/>, label: "Ownership" };
    return { icon: <Bot className="w-4 h-4"/>, label: "Workspace" };
  };

  const currentContext = getContext();

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const newMsg: Message = { id: Date.now(), role: "user", content: input };
    setMessages(prev => [...prev, newMsg]);
    setInput("");

    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now(), 
          role: "assistant", 
          content: "I've analyzed the lineage for this dataset. The issue seems to originate from `stg_payments`. \n\n**Confidence: 94%**\n\nI recommend restarting the upstream Airflow DAG.",
          actions: ["Restart DAG", "View Lineage"]
        } as Message
      ]);
    }, 1000);
  };

  if (!isEffectivelyOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        aria-label="Open AyeCan AI Assistant"
        className="fixed right-4 top-1/2 -translate-y-1/2 bg-black text-white hover:bg-zinc-900 border-2 border-cyan-500/60 px-3.5 py-3 rounded-2xl shadow-2xl shadow-cyan-500/25 hover:scale-105 transition-all z-50 flex items-center gap-2 cursor-pointer"
      >
        <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
        <span className="font-extrabold text-xs tracking-wider text-cyan-300 hidden sm:inline-block">AyeCan AI</span>
      </button>
    );
  }

  return (
    <div className={overrideVisibility ? "h-full w-full flex flex-col bg-transparent" : `fixed right-4 top-1/2 -translate-y-1/2 max-h-[85vh] h-[640px] bg-[#12121a]/95 backdrop-blur-xl border border-cyan-500/40 shadow-2xl rounded-2xl transition-all duration-300 z-50 flex flex-col ${isExpanded ? 'w-[750px]' : 'w-[380px]'}`}>
      
      {/* Header */}
      {!overrideVisibility && (
      <div className="p-4 border-b border-border flex items-center justify-between bg-black/20">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold">DataPact AI</h2>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <span>Context:</span>
              <span className="flex items-center gap-1 text-blue-400 font-medium">
                {currentContext.icon} {currentContext.label}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground transition-colors">
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
      )}

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-secondary/50 border border-border text-gray-200 rounded-bl-none'}`}>
              <div className="prose prose-invert prose-sm">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
              
              {/* Optional Actions */}
              {msg.actions && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {msg.actions.map((action, idx) => (
                    <button key={idx} className="text-xs px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors border border-blue-500/30">
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Prompt Suggestions */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto custom-scrollbar">
        <button onClick={() => setInput("Explain this incident")} className="flex-shrink-0 text-xs px-3 py-1.5 bg-secondary hover:bg-muted border border-border rounded-full text-muted-foreground transition-colors">
          Explain incident
        </button>
        <button onClick={() => setInput("Generate contract")} className="flex-shrink-0 text-xs px-3 py-1.5 bg-secondary hover:bg-muted border border-border rounded-full text-muted-foreground transition-colors">
          Generate contract
        </button>
        <button onClick={() => setInput("Show affected dashboards")} className="flex-shrink-0 text-xs px-3 py-1.5 bg-secondary hover:bg-muted border border-border rounded-full text-muted-foreground transition-colors">
          Show dashboards
        </button>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-black/20">
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask DataPact AI..."
            className="w-full bg-secondary border border-border rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute right-2 p-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
