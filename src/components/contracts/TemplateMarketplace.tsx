"use client";

import React from 'react';
import { useContractStore } from '@/store/useContractStore';

const TEMPLATES = [
  {
    id: 'finance',
    name: 'Financial Reporting',
    description: 'Strict quality checks for revenue and billing data.',
    icon: '💰',
    rules: [
      { type: 'not_null', category: 'Quality', column: 'amount' },
      { type: 'not_null', category: 'Quality', column: 'currency' },
      { type: 'numeric_range', category: 'Business', column: 'amount', min: 0, max: 1000000 },
      { type: 'anomaly_detection', category: 'AI', column: 'amount' },
      { type: 'freshness', category: 'Freshness', freshness_minutes: 15 }
    ]
  },
  {
    id: 'healthcare',
    name: 'Healthcare (HIPAA)',
    description: 'Ensures PHI is protected and valid.',
    icon: '🏥',
    rules: [
      { type: 'not_null', category: 'Quality', column: 'patient_id' },
      { type: 'unique', category: 'Quality', column: 'patient_id' },
      { type: 'custom_sql', category: 'Quality', sql: "SELECT COUNT(*) FROM {{table}} WHERE ssn IS NOT NULL AND LENGTH(ssn) != 9" }
    ]
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce Sales',
    description: 'Volume checks and core order validations.',
    icon: '🛒',
    rules: [
      { type: 'row_count_drop', category: 'Volume', threshold: '15%' },
      { type: 'not_null', category: 'Quality', column: 'order_id' },
      { type: 'not_null', category: 'Quality', column: 'customer_id' },
      { type: 'accepted_values', category: 'Quality', column: 'status', values: ['pending', 'shipped', 'delivered', 'cancelled'] }
    ]
  },
  {
    id: 'iot',
    name: 'IoT Telemetry',
    description: 'High volume freshness and boundary checks.',
    icon: '📡',
    rules: [
      { type: 'freshness', category: 'Freshness', freshness_minutes: 5 },
      { type: 'numeric_range', category: 'Business', column: 'temperature', min: -50, max: 150 },
      { type: 'not_null', category: 'Quality', column: 'device_id' }
    ]
  }
];

export function TemplateMarketplace() {
  const { setContract } = useContractStore();

  const applyTemplate = (template: typeof TEMPLATES[0]) => {
    setContract((prev) => ({
      ...prev,
      rules: [...prev.rules, ...template.rules]
    }));
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {TEMPLATES.map((tpl) => (
        <button
          key={tpl.id}
          onClick={() => applyTemplate(tpl)}
          className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted transition text-left group"
        >
          <div className="text-3xl p-2 bg-background rounded-lg border border-border group-hover:scale-110 transition-transform">
            {tpl.icon}
          </div>
          <div>
            <h4 className="font-bold text-foreground">{tpl.name}</h4>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{tpl.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
