"use client";

import { useState } from "react";
import { Search as SearchIcon, FileText, Database, Sparkles } from "lucide-react";

export default function SemanticSearchPage() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    // Mocking an API call
    setTimeout(() => {
      setResults([
        {
          id: 1,
          type: "TABLE",
          name: "fct_sales",
          description: "Main fact table for all completed sales transactions.",
          match_score: 98,
          match_reason: "Semantic similarity to 'revenue' and 'orders'."
        },
        {
          id: 2,
          type: "CONTRACT",
          name: "Sales_Data_Contract",
          description: "Ensures no nulls in order_id and amount > 0.",
          match_score: 85,
          match_reason: "Governs fct_sales."
        },
        {
          id: 3,
          type: "COLUMN",
          name: "net_amount",
          description: "Total amount after tax and discounts.",
          match_score: 76,
          match_reason: "Lexical match on BM25 index."
        }
      ]);
      setIsSearching(false);
    }, 800);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4 pt-10">
        <div className="w-16 h-16 bg-teal-500/20 border border-teal-500/50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(20,184,166,0.3)]">
          <SearchIcon className="w-8 h-8 text-teal-400" />
        </div>
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
          Semantic Search
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Search across datasets, contracts, incidents, and business terms using natural language.
        </p>
      </div>

      <form onSubmit={handleSearch} className="relative max-w-3xl mx-auto">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex items-center bg-background border-2 border-muted rounded-xl p-2 shadow-xl focus-within:border-teal-500 transition-colors">
            <SearchIcon className="w-6 h-6 text-muted-foreground ml-3" />
            <input
              type="text"
              placeholder="e.g. Show me tables related to customer revenue..."
              className="w-full bg-transparent border-none text-lg px-4 py-3 focus:outline-none focus:ring-0 placeholder:text-muted-foreground/50"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button 
              type="submit"
              disabled={isSearching}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50 flex items-center gap-2"
            >
              {isSearching ? "Searching..." : "Search"}
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      {results.length > 0 && (
        <div className="max-w-3xl mx-auto mt-12 space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Top Results
          </h3>
          {results.map((res) => (
            <div key={res.id} className="bg-card border rounded-xl p-5 hover:border-teal-500/50 transition flex items-start gap-4">
              <div className="mt-1 bg-muted p-2 rounded-lg">
                {res.type === "TABLE" ? <Database className="w-5 h-5 text-blue-400" /> : <FileText className="w-5 h-5 text-amber-400" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-lg font-semibold text-teal-400">{res.name}</h4>
                  <div className="flex items-center gap-1 bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded text-xs font-bold">
                    Score: {res.match_score}
                  </div>
                </div>
                <p className="text-muted-foreground mt-1">{res.description}</p>
                <div className="mt-3 text-xs bg-muted/50 border px-3 py-1.5 rounded-md inline-block text-muted-foreground">
                  <span className="font-semibold text-foreground/80">AI Reasoning:</span> {res.match_reason}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
