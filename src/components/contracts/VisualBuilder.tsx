"use client";

import React, { useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useContractStore, Rule } from '@/store/useContractStore';

// We don't strictly use zodResolver here for the sake of dynamic syncing without getting blocked by intermediate states,
// but we still provide a structured UI. The YAML parser handles true validation.

export function VisualBuilder() {
  const { contract, setContract } = useContractStore();

  const { register, control, watch, setValue, getValues } = useForm({
    defaultValues: {
      contract_name: contract.contract_name || '',
      owner: contract.owner || '',
      dataset: contract.dataset || { source: 'snowflake', database: '', schema: '', table: '' },
      rules: (contract.rules || []) as any[]
    },
    mode: 'onChange',
  });

  const { fields: ruleFields, append: addRule, remove: removeRule } = useFieldArray({
    control,
    name: 'rules',
  });

  const formValues = watch();

  useEffect(() => {
    // Only update Zustand if form actually changed relative to it
    // Deep equality check is simplified here for performance
    const stringifiedContract = JSON.stringify(contract);
    const stringifiedForm = JSON.stringify(formValues);
    
    if (stringifiedContract !== stringifiedForm) {
      setContract(() => formValues as any);
    }
  }, [formValues, contract, setContract]);

  // Sync external changes (from Monaco YAML) back to form
  useEffect(() => {
    const stringifiedContract = JSON.stringify(contract);
    const stringifiedForm = JSON.stringify(getValues());
    
    if (stringifiedContract !== stringifiedForm) {
      setValue('contract_name', contract.contract_name || '');
      setValue('owner', contract.owner || '');
      setValue('dataset', contract.dataset || { source: 'snowflake', database: '', schema: '', table: '' });
      setValue('rules', (contract.rules || []) as any[]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, setValue]);

  const renderRuleInputs = (index: number, ruleType: string) => {
    switch(ruleType) {
      case 'not_null':
      case 'unique':
        return (
          <>
            <span className="text-muted-foreground text-sm font-medium">IS {ruleType === 'not_null' ? 'NOT NULL' : 'UNIQUE'}</span>
          </>
        );
      case 'accepted_values':
        return (
          <>
            <span className="text-muted-foreground text-sm font-medium">IN</span>
            <input 
              type="text" 
              {...register(`rules.${index}.values`)}
              className="bg-muted border border-border rounded-lg px-3 py-1.5 text-foreground focus:ring-2 focus:ring-blue-500 outline-none text-sm placeholder:text-muted-foreground/50 w-48"
              placeholder="e.g. 'A', 'B', 'C'"
            />
          </>
        );
      case 'numeric_range':
        return (
          <>
            <span className="text-muted-foreground text-sm font-medium">BETWEEN</span>
            <input 
              type="number" 
              {...register(`rules.${index}.min`)}
              className="bg-muted border border-border rounded-lg px-3 py-1.5 text-foreground focus:ring-2 focus:ring-blue-500 outline-none text-sm w-24"
              placeholder="Min"
            />
            <span className="text-muted-foreground text-sm font-medium">AND</span>
            <input 
              type="number" 
              {...register(`rules.${index}.max`)}
              className="bg-muted border border-border rounded-lg px-3 py-1.5 text-foreground focus:ring-2 focus:ring-blue-500 outline-none text-sm w-24"
              placeholder="Max"
            />
          </>
        );
      case 'freshness':
        return (
          <>
            <span className="text-muted-foreground text-sm font-medium">DELAY {'<'}</span>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                {...register(`rules.${index}.freshness_minutes`)}
                className="bg-muted border border-border rounded-lg px-3 py-1.5 text-foreground focus:ring-2 focus:ring-blue-500 outline-none text-sm w-24"
                placeholder="60"
              />
              <span className="text-muted-foreground text-sm">minutes</span>
            </div>
          </>
        );
      case 'row_count_drop':
        return (
          <>
            <span className="text-muted-foreground text-sm font-medium">DROP EXCEEDS</span>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                {...register(`rules.${index}.threshold`)}
                className="bg-muted border border-border rounded-lg px-3 py-1.5 text-foreground focus:ring-2 focus:ring-blue-500 outline-none text-sm w-24"
                placeholder="20"
              />
              <span className="text-muted-foreground text-sm">%</span>
            </div>
          </>
        );
      case 'custom_sql':
        return (
          <>
            <span className="text-muted-foreground text-sm font-medium">PASSES SQL</span>
            <textarea 
              {...register(`rules.${index}.sql`)}
              className="bg-[#1e1e1e] border border-border rounded-lg px-3 py-1.5 text-green-400 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full max-w-md h-12"
              placeholder="SELECT COUNT(*) FROM {{table}} WHERE ..."
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-8 bg-background custom-scrollbar pb-32">
      {/* 1. Metadata Form */}
      <div>
        <h3 className="text-lg font-bold mb-4 text-foreground border-b border-border pb-2">1. Metadata</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Contract Name</label>
            <input 
              type="text" 
              {...register("contract_name")}
              className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="e.g. analytics_orders_v1"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Owner Email</label>
            <input 
              type="email" 
              {...register("owner")}
              className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="e.g. data_eng@company.com"
            />
          </div>
        </div>
      </div>

      {/* 2. Dataset Setup */}
      <div>
        <h3 className="text-lg font-bold mb-4 text-foreground border-b border-border pb-2">2. Dataset Details</h3>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Source</label>
            <select 
              {...register("dataset.source")}
              className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            >
              <option value="snowflake">Snowflake</option>
              <option value="delta">Delta Lake</option>
              <option value="bigquery">BigQuery</option>
              <option value="redshift">Redshift</option>
              <option value="postgres">PostgreSQL</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Database</label>
            <input 
              type="text" 
              {...register("dataset.database")}
              className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Schema</label>
            <input 
              type="text" 
              {...register("dataset.schema")}
              className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Table</label>
            <input 
              type="text" 
              {...register("dataset.table")}
              className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
            />
          </div>
        </div>
      </div>

      {/* 3. Visual Rule Builder */}
      <div>
        <div className="flex items-center justify-between mb-4 border-b border-border pb-2">
          <h3 className="text-lg font-bold text-foreground">3. Quality Rules</h3>
          <button 
            type="button" 
            onClick={() => addRule({ type: 'not_null', severity: 'error' })}
            className="text-xs bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 font-semibold px-3 py-1.5 rounded-md transition border border-blue-500/30"
          >
            + Add Rule
          </button>
        </div>
        
        <div className="space-y-3">
          {ruleFields.map((field, index) => {
            const ruleType = watch(`rules.${index}.type`);
            const ruleSeverity = watch(`rules.${index}.severity`) || 'error';
            
            const severityColor = {
              info: 'border-blue-500/30 bg-blue-500/5',
              warning: 'border-yellow-500/30 bg-yellow-500/5',
              error: 'border-red-500/30 bg-red-500/5',
              critical: 'border-purple-500/30 bg-purple-500/5',
            }[ruleSeverity as string] || 'border-border bg-card';

            return (
              <div key={field.id} className={`flex flex-col gap-3 p-4 rounded-xl border shadow-sm relative group transition-colors ${severityColor}`}>
                
                {/* Delete Button */}
                <button 
                  type="button"
                  onClick={() => removeRule(index)}
                  className="absolute top-3 right-3 text-muted-foreground hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                </button>

                {/* Grafana-style Sentence Builder */}
                <div className="flex flex-wrap items-center gap-3 w-full pr-8">
                  <span className="text-muted-foreground text-sm font-bold uppercase tracking-wide">IF</span>
                  
                  {/* Target (Column or Table level) */}
                  {ruleType !== 'row_count_drop' && ruleType !== 'custom_sql' ? (
                    <input 
                      type="text" 
                      {...register(`rules.${index}.column`)}
                      className="bg-muted border border-border rounded-lg px-3 py-1.5 text-foreground focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono w-48 placeholder:font-sans placeholder:text-muted-foreground/50"
                      placeholder="column_name"
                    />
                  ) : (
                    <span className="bg-muted border border-border rounded-lg px-3 py-1.5 text-foreground text-sm font-mono opacity-80 cursor-not-allowed">
                      Dataset (Table)
                    </span>
                  )}
                  
                  {/* Operator / Rule Type */}
                  <select 
                    {...register(`rules.${index}.type`)}
                    className="bg-muted border border-border rounded-lg px-3 py-1.5 text-foreground focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                  >
                    <option value="not_null">Not Null</option>
                    <option value="unique">Unique</option>
                    <option value="accepted_values">Accepted Values</option>
                    <option value="freshness">Freshness</option>
                    <option value="row_count_drop">Row Count Drop</option>
                    <option value="numeric_range">Numeric Range</option>
                    <option value="custom_sql">Custom SQL</option>
                  </select>

                  {/* Dynamic Inputs */}
                  {renderRuleInputs(index, ruleType)}

                  <span className="text-muted-foreground text-sm font-bold uppercase tracking-wide ml-2">THEN</span>

                  {/* Severity */}
                  <select 
                    {...register(`rules.${index}.severity`)}
                    className={`border rounded-lg px-3 py-1.5 outline-none text-sm font-bold transition-colors focus:ring-2 focus:ring-blue-500 ${
                      ruleSeverity === 'info' ? 'bg-blue-500/10 text-blue-500 border-blue-500/30' :
                      ruleSeverity === 'warning' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' :
                      ruleSeverity === 'critical' ? 'bg-purple-500/10 text-purple-500 border-purple-500/30' :
                      'bg-red-500/10 text-red-500 border-red-500/30'
                    }`}
                  >
                    <option value="info">INFO</option>
                    <option value="warning">WARNING</option>
                    <option value="error">ERROR</option>
                    <option value="critical">CRITICAL</option>
                  </select>
                </div>
                
                {/* Optional Description */}
                <div className="w-full mt-1">
                  <input
                    type="text"
                    {...register(`rules.${index}.description`)}
                    className="w-full bg-transparent border-none text-xs text-muted-foreground outline-none placeholder:text-muted-foreground/30 px-1"
                    placeholder="Add an optional description or runbook link for this rule..."
                  />
                </div>
              </div>
            );
          })}
          
          {ruleFields.length === 0 && (
            <div className="text-center py-10 border-2 border-dashed border-border rounded-xl bg-muted/20">
              <p className="text-muted-foreground text-sm mb-3">No rules defined for this contract yet.</p>
              <button 
                type="button"
                onClick={() => addRule({ type: 'not_null', severity: 'error' })}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition shadow-sm"
              >
                Create Your First Rule
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
