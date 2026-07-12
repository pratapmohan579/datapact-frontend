"use client";

import { useState } from "react";
import { 
  flexRender, 
  getCoreRowModel, 
  useReactTable, 
  getSortedRowModel, 
  SortingState 
} from "@tanstack/react-table";
import { Play, Pause, Unplug, Settings, Terminal, ArrowUpDown } from "lucide-react";

const DATA = [
  { id: 1, name: "Production DB", type: "PostgreSQL", version: "15.3", schemas: "14", status: "Connected", lastScan: "2 min ago" },
  { id: 2, name: "Analytics DW", type: "Snowflake", version: "Enterprise", schemas: "42", status: "Scanning (78%)", lastScan: "Right now" },
  { id: 3, name: "Raw Data Lake", type: "Delta Lake", version: "3.0", schemas: "3", status: "Scanning (92%)", lastScan: "Right now" },
  { id: 4, name: "Legacy Events", type: "BigQuery", version: "Standard", schemas: "2", status: "Scanning (15%)", lastScan: "Right now" },
  { id: 5, name: "Marketing App", type: "MySQL", version: "8.0", schemas: "1", status: "Disconnected", lastScan: "3 days ago" },
];

export function ConnectedSourcesTable() {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = [
    {
      accessorKey: "name",
      header: ({ column }: any) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1 hover:text-foreground">
          Name <ArrowUpDown size={14} />
        </button>
      ),
      cell: (info: any) => <span className="font-semibold">{info.getValue()}</span>,
    },
    { accessorKey: "type", header: "Type" },
    { accessorKey: "version", header: "Version" },
    { accessorKey: "schemas", header: "Schemas" },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info: any) => {
        const val = info.getValue();
        let color = "text-muted-foreground";
        if (val === "Connected") color = "text-green-500 bg-green-50 px-2 py-1 rounded-full text-xs font-bold";
        else if (val.includes("Scanning")) color = "text-blue-500 bg-blue-50 px-2 py-1 rounded-full text-xs font-bold animate-pulse";
        else if (val === "Disconnected") color = "text-red-500 bg-red-50 px-2 py-1 rounded-full text-xs font-bold";
        
        return <span className={color}>{val}</span>;
      }
    },
    { accessorKey: "lastScan", header: "Last Scan" },
    {
      id: "actions",
      header: "Actions",
      cell: () => (
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-blue-500 hover:bg-blue-50 rounded" title="Scan"><Play size={16} /></button>
          <button className="p-1.5 text-amber-500 hover:bg-amber-50 rounded" title="Pause"><Pause size={16} /></button>
          <button className="p-1.5 text-red-500 hover:bg-red-50 rounded" title="Disconnect"><Unplug size={16} /></button>
          <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded" title="Settings"><Settings size={16} /></button>
          <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded" title="Logs"><Terminal size={16} /></button>
        </div>
      )
    }
  ];

  const table = useReactTable({
    data: DATA,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm mb-8 overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold">Connected Sources</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary/50 text-muted-foreground text-xs uppercase font-semibold">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-6 py-4 whitespace-nowrap">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-muted/50 transition-colors">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
