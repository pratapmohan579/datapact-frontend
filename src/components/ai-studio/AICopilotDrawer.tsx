"use client";

import { useState } from "react";
import { X, Sparkles, Send } from "lucide-react";
import { useAIStudioStore } from "@/store/ai-studio-store";

export default function AICopilotDrawer() {
  const { setActiveDrawer } = useAIStudioStore();
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hi! I'm your DataPact Copilot. I can help you write contract rules, explain SQL anomalies, or debug validation failures. How can I help?" }
  ]);
  const [input, setInput] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput("");
    setIsLoading(true);
    
    try {
      // Connect to the new AI API Endpoint
      const response = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          session_id: 'default_session',
          user_id: 'current_user',
          context: {
            page: window.location.pathname,
            // In a real app, inject editor state or selected asset here
          }
        })
      });

      if (!response.ok) throw new Error('Failed to fetch AI response');
      const data = await response.json();
      
      setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I'm having trouble connecting to the AI Gateway right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-4 border-b border-border flex items-center justify-between bg-ai/5">
        <h3 className="font-semibold flex items-center gap-2 text-foreground">
          <Sparkles className="w-5 h-5 text-ai" /> Copilot
        </h3>
        <button 
          onClick={() => setActiveDrawer('none')}
          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
              msg.role === 'user' 
                ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                : 'bg-muted text-foreground rounded-tl-sm border border-border'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-border bg-background">
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask Copilot..." 
            className="w-full bg-muted border border-border rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ai"
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-ai text-white rounded-full hover:bg-ai-dark transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          <button className="text-[11px] whitespace-nowrap px-3 py-1.5 bg-muted border border-border rounded-full hover:border-ai text-muted-foreground transition-colors">
            Generate Strict Rules
          </button>
          <button className="text-[11px] whitespace-nowrap px-3 py-1.5 bg-muted border border-border rounded-full hover:border-ai text-muted-foreground transition-colors">
            Explain Null Anomalies
          </button>
        </div>
      </div>
    </div>
  );
}
