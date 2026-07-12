export const contractJsonSchema = {
  uri: "http://datapact/contract-schema.json",
  fileMatch: ["*"], // match all yaml files in Monaco
  schema: {
    type: "object",
    properties: {
      contract_name: {
        type: "string",
        description: "Unique name of the data contract",
        minLength: 3
      },
      owner: {
        type: "string",
        description: "Email address or team name of the owner"
      },
      status: {
        type: "string",
        enum: ["draft", "review", "approved", "published", "paused", "deprecated", "archived"],
        description: "Current lifecycle status"
      },
      dataset: {
        type: "object",
        description: "Target dataset configuration",
        properties: {
          source: {
            type: "string",
            enum: ["snowflake", "delta", "bigquery", "redshift", "postgres"]
          },
          database: { type: "string" },
          schema: { type: "string" },
          table: { type: "string" }
        },
        required: ["source", "database", "schema", "table"]
      },
      rules: {
        type: "array",
        description: "List of data quality and freshness rules",
        items: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: [
                "not_null", "unique", "accepted_values", 
                "freshness", "row_count_drop", "numeric_range", 
                "custom_sql", "anomaly_detection"
              ],
              description: "The type of validation rule"
            },
            category: {
              type: "string",
              enum: ["Quality", "Freshness", "Volume", "Schema", "Business", "Custom SQL", "AI"]
            },
            column: { type: "string", description: "Target column (if applicable)" },
            threshold: { type: "string" },
            min: { type: "number" },
            max: { type: "number" },
            freshness_minutes: { type: "number" },
            values: { type: "array", items: { type: "string" } },
            sql: { type: "string" }
          },
          required: ["type"]
        }
      }
    },
    required: ["contract_name", "owner", "dataset", "rules"]
  }
};
