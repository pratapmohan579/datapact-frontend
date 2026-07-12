"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/apiClient";

export default function NewContract() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    contract_name: "",
    owner: "",
    dataset: {
      source: "snowflake",
      database: "",
      schema: "",
      table: "",
    },
    rules: [{ type: "not_null", column: "" }]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleDatasetChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      dataset: { ...formData.dataset, [field]: value }
    });
  };

  const addRule = () => {
    setFormData({
      ...formData,
      rules: [...formData.rules, { type: "not_null", column: "" }]
    });
  };

  const updateRule = (index: number, field: string, value: any) => {
    const newRules = [...formData.rules];
    newRules[index] = { ...newRules[index], [field]: value };
    setFormData({ ...formData, rules: newRules });
  };

  const handleTypeChange = (index: number, type: string) => {
    const newRules = [...formData.rules];
    let defaultRule: any = { type, column: "" };
    
    if (type === "freshness") {
      defaultRule = { type, freshness_minutes: 60 };
    } else if (type === "row_count_drop") {
      defaultRule = { type, threshold: "20%" };
    } else if (type === "numeric_range") {
      defaultRule = { type, column: "", min: 0, max: 100000 };
    }
    
    newRules[index] = defaultRule;
    setFormData({ ...formData, rules: newRules });
  };

  const removeRule = (index: number) => {
    const newRules = formData.rules.filter((_, i) => i !== index);
    setFormData({ ...formData, rules: newRules });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const payload = {
        structured_data: formData
      };

      await api.post("/contracts", payload);

      router.push("/contracts");
    } catch (err: any) {
      setError(err.message || "Failed to create contract");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-foreground">New Contract</h2>
          <p className="text-muted-foreground">Define your data quality rules</p>
        </div>
        <Link href="/contracts" className="text-muted-foreground hover:text-foreground transition-colors">
          Cancel
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 glass-card p-8">
        {/* Metadata */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-foreground border-b border-border pb-2">1. Metadata</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Contract Name</label>
              <input 
                type="text" 
                required
                className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.contract_name}
                onChange={(e) => setFormData({...formData, contract_name: e.target.value})}
                placeholder="e.g. analytics_orders_v1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Owner Email / Team</label>
              <input 
                type="text" 
                required
                className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.owner}
                onChange={(e) => setFormData({...formData, owner: e.target.value})}
                placeholder="e.g. data_eng@company.com"
              />
            </div>
          </div>
        </div>

        {/* Dataset */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-foreground border-b border-border pb-2">2. Dataset Setup</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Source</label>
              <select 
                className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.dataset.source}
                onChange={(e) => handleDatasetChange("source", e.target.value)}
              >
                <option value="snowflake">Snowflake</option>
                <option value="delta">Delta Lake</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Database</label>
              <input 
                type="text" 
                required
                className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.dataset.database}
                onChange={(e) => handleDatasetChange("database", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Schema</label>
              <input 
                type="text" 
                required
                className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.dataset.schema}
                onChange={(e) => handleDatasetChange("schema", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Table</label>
              <input 
                type="text" 
                required
                className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.dataset.table}
                onChange={(e) => handleDatasetChange("table", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Rules */}
        <div>
          <div className="flex items-center justify-between mb-4 border-b border-border pb-2">
            <h3 className="text-xl font-bold text-foreground">3. Quality Rules</h3>
            <button 
              type="button" 
              onClick={addRule}
              className="text-sm bg-muted hover:bg-border border border-border text-foreground px-3 py-1 rounded-md transition"
            >
              + Add Rule
            </button>
          </div>
          
          <div className="space-y-4">
            {formData.rules.map((rule: any, index: number) => (
              <div key={index} className="flex flex-col gap-4 bg-card p-4 rounded-lg border border-border">
                <div className="flex items-start gap-4">
                  <div className="w-1/3">
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Rule Type</label>
                    <select 
                      className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-blue-500 outline-none"
                      value={rule.type}
                      onChange={(e) => handleTypeChange(index, e.target.value)}
                    >
                      <option value="not_null">Not Null</option>
                      <option value="unique">Unique</option>
                      <option value="freshness">Freshness SLA</option>
                      <option value="row_count_drop">Row Count Drop</option>
                      <option value="numeric_range">Numeric Range</option>
                    </select>
                  </div>
                  
                  {/* Dynamic Fields */}
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    {['not_null', 'unique', 'numeric_range'].includes(rule.type) && (
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Column</label>
                        <input 
                          type="text" 
                          required
                          className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-blue-500 outline-none"
                          value={rule.column || ""}
                          onChange={(e) => updateRule(index, "column", e.target.value)}
                          placeholder="e.g. order_id"
                        />
                      </div>
                    )}
                    
                    {rule.type === 'freshness' && (
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Max Delay (Minutes)</label>
                        <input 
                          type="number" 
                          required
                          className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-blue-500 outline-none"
                          value={rule.freshness_minutes || 60}
                          onChange={(e) => updateRule(index, "freshness_minutes", parseInt(e.target.value))}
                        />
                      </div>
                    )}

                    {rule.type === 'row_count_drop' && (
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Drop Threshold (%)</label>
                        <input 
                          type="text" 
                          required
                          className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-blue-500 outline-none"
                          value={rule.threshold || "20%"}
                          onChange={(e) => updateRule(index, "threshold", e.target.value)}
                          placeholder="20%"
                        />
                      </div>
                    )}

                    {rule.type === 'numeric_range' && (
                      <>
                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-1">Minimum</label>
                          <input 
                            type="number" 
                            required
                            className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-blue-500 outline-none"
                            value={rule.min !== undefined ? rule.min : 0}
                            onChange={(e) => updateRule(index, "min", parseInt(e.target.value))}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-1">Maximum</label>
                          <input 
                            type="number" 
                            required
                            className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-blue-500 outline-none"
                            value={rule.max !== undefined ? rule.max : 100000}
                            onChange={(e) => updateRule(index, "max", parseInt(e.target.value))}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-5 ml-2">
                    <button 
                      type="button" 
                      onClick={() => removeRule(index)}
                      className="text-red-500 hover:text-red-400 text-sm font-medium transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-border">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition shadow-lg disabled:opacity-50"
          >
            {isSubmitting ? "Deploying..." : "Deploy Contract"}
          </button>
        </div>
      </form>
    </div>
  );
}
