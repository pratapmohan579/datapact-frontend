"use client";

import { useState } from "react";
import { BookOpen, Search, Filter, Plus, FileText, Activity } from "lucide-react";

export default function BusinessGlossaryPage() {
  const [search, setSearch] = useState("");

  const glossaryTerms = [
    {
      id: 1,
      term: "Net Revenue",
      definition: "Total revenue minus refunds and discounts.",
      owner: "Finance Team",
      relatedKPIs: ["Gross Revenue", "Refund Rate"],
      status: "Approved",
      tables: ["fct_sales", "dim_orders"]
    },
    {
      id: 2,
      term: "Active Customer",
      definition: "A customer who has placed an order in the last 30 days.",
      owner: "Marketing Team",
      relatedKPIs: ["Retention Rate", "Churn Rate"],
      status: "Draft",
      tables: ["dim_customers", "fct_orders"]
    },
    {
      id: 3,
      term: "Churn Rate",
      definition: "Percentage of customers who stopped ordering over a given period.",
      owner: "Growth Team",
      relatedKPIs: ["Active Customer"],
      status: "Approved",
      tables: ["fct_churn", "dim_customers"]
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-600">
            Business Glossary
          </h1>
          <p className="text-muted-foreground mt-2">
            AI-generated definitions and KPIs bridging technical metadata with business meaning.
          </p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition">
          <Plus className="w-4 h-4" /> Add Term
        </button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search business terms..."
            className="pl-9 pr-4 py-2 w-full bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {glossaryTerms.map((term) => (
          <div key={term.id} className="bg-card border rounded-xl p-5 hover:border-indigo-500/50 hover:shadow-md transition group cursor-pointer">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                {term.term}
              </h3>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${term.status === 'Approved' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                {term.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {term.definition}
            </p>
            
            <div className="space-y-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Owner</div>
                <div className="text-sm">{term.owner}</div>
              </div>
              
              <div>
                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1 uppercase tracking-wider font-semibold">
                  <Activity className="w-3 h-3" /> Related KPIs
                </div>
                <div className="flex flex-wrap gap-1">
                  {term.relatedKPIs.map(kpi => (
                    <span key={kpi} className="bg-muted text-xs px-2 py-0.5 rounded border">{kpi}</span>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1 uppercase tracking-wider font-semibold">
                  <FileText className="w-3 h-3" /> Technical Assets
                </div>
                <div className="flex flex-wrap gap-1">
                  {term.tables.map(t => (
                    <span key={t} className="text-indigo-400 bg-indigo-500/10 text-xs px-2 py-0.5 rounded">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
