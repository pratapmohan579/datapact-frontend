"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const SOURCE_DATA = [
  { name: 'PostgreSQL', value: 400 },
  { name: 'Snowflake', value: 300 },
  { name: 'Delta Lake', value: 300 },
  { name: 'BigQuery', value: 200 },
];

const DOMAIN_DATA = [
  { name: 'Sales', value: 400 },
  { name: 'Marketing', value: 300 },
  { name: 'Analytics', value: 300 },
  { name: 'Finance', value: 200 },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

export function StatisticsDashboard() {
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Assets by Source */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <h3 className="font-bold mb-4">Assets by Source</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={SOURCE_DATA}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {SOURCE_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} Assets`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Assets by Domain */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <h3 className="font-bold mb-4">Assets by Domain</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={DOMAIN_DATA}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {DOMAIN_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} Assets`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Placeholder for more stats */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <h3 className="font-bold mb-4">Largest Tables</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">events_raw</span>
              <span className="text-muted-foreground">4.2 TB</span>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div className="bg-pink-500 h-full w-[90%]"></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">clickstream</span>
              <span className="text-muted-foreground">1.8 TB</span>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full w-[45%]"></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">orders_history</span>
              <span className="text-muted-foreground">850 GB</span>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full w-[25%]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
