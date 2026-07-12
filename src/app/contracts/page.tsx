"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useContracts } from "@/queries/useContracts";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export default function ContractsPage() {
  const router = useRouter();
  const { data: contracts = [], isLoading, isError } = useContracts();

  if (isError) {
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      router.push("/auth/login");
    }
  }

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center hover:text-foreground transition-colors"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        )
      },
      cell: ({ row }) => (
        <div className="font-medium text-foreground">
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "dataset_source",
      header: "Source",
    },
    {
      accessorKey: "dataset_table",
      header: "Table",
    },
    {
      id: "versions",
      header: "Versions",
      cell: ({ row }) => {
        const versions = row.original.versions;
        return (
          <span className="px-2 py-1 bg-muted text-foreground rounded text-xs font-mono border border-border">
            v{versions?.length || 1}
          </span>
        )
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <Link href={`/contracts/${row.original.id}`} className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium">
            View Details →
          </Link>
        )
      }
    }
  ];

  if (isLoading) {
    return <div className="flex justify-center py-20 text-foreground">Loading Contracts...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Contract Registry</h1>
          <p className="text-muted-foreground">Manage all data schemas and quality rules</p>
        </div>
        <Link href="/contracts/author" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg transition shadow-lg inline-flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          New Contract
        </Link>
      </div>

      <DataTable columns={columns} data={contracts} />
    </div>
  );
}
