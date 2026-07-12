import { z } from "zod";

export const datasetSchema = z.object({
  source: z.enum(["snowflake", "delta", "bigquery", "redshift", "postgres"]),
  database: z.string().min(1, "Database is required"),
  schema: z.string().min(1, "Schema is required"),
  table: z.string().min(1, "Table is required"),
});

export const ruleSchema = z.object({
  type: z.enum([
    "not_null", "unique", "accepted_values", 
    "freshness", "row_count_drop", "numeric_range", 
    "custom_sql", "anomaly_detection"
  ]),
  category: z.enum(["Quality", "Freshness", "Volume", "Schema", "Business", "Custom SQL", "AI"]).optional(),
  column: z.string().optional(),
  
  // Dynamic fields
  threshold: z.string().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  freshness_minutes: z.number().optional(),
  values: z.array(z.string()).optional(),
  sql: z.string().optional(),
});

export const contractSchema = z.object({
  contract_name: z.string().min(3, "Name must be at least 3 characters"),
  owner: z.string().email("Must be a valid email"),
  status: z.enum(['draft', 'review', 'approved', 'published', 'paused', 'deprecated', 'archived']).default('draft'),
  dataset: datasetSchema,
  rules: z.array(ruleSchema).min(1, "At least one rule is required"),
});

export type ContractFormData = z.infer<typeof contractSchema>;
