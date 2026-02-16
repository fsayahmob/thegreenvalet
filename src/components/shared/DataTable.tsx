"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  className?: string;
  render: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyState?: React.ReactNode;
  loading?: boolean;
}

// ─── Component ────────────────────────────────────────

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyState,
  loading,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  // Sort data if sortKey is set
  const sorted = sortKey
    ? [...data].sort((a, b) => {
        const col = columns.find((c) => c.key === sortKey);
        if (!col) return 0;
        const aVal = String(col.render(a) ?? "");
        const bVal = String(col.render(b) ?? "");
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      })
    : data;

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-white p-12 text-center">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
        <p className="mt-3 text-sm text-charcoal-500">Chargement…</p>
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return (
      <div className="rounded-xl border border-border bg-white">
        {emptyState}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-charcoal-50/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-charcoal-500",
                    col.sortable && "cursor-pointer select-none hover:text-charcoal-700",
                    col.className,
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      sortKey === col.key
                        ? sortDir === "asc"
                          ? <ChevronUp size={12} />
                          : <ChevronDown size={12} />
                        : <ChevronsUpDown size={12} className="opacity-30" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((item) => (
              <tr
                key={keyExtractor(item)}
                className={cn(
                  "border-b border-border/50 transition-colors",
                  onRowClick && "cursor-pointer hover:bg-charcoal-50/50",
                )}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((col) => (
                  <td key={col.key} className={cn("py-3 px-4", col.className)}>
                    {col.render(item)}
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
