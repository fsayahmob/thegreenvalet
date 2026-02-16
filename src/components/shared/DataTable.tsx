"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  className?: string;
  sortValue?: (item: T) => string | number;
  render: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyState?: React.ReactNode;
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (item: T) => string;
}

// ─── Skeleton Row ─────────────────────────────────────

function SkeletonRow({ colCount }: { colCount: number }) {
  return (
    <tr className="border-b border-border/50">
      {Array.from({ length: colCount }).map((_, i) => (
        <td key={i} className="py-3.5 px-4">
          <div className="skeleton h-4 w-3/4" />
          {i === 0 && <div className="skeleton h-3 w-1/2 mt-2" />}
        </td>
      ))}
    </tr>
  );
}

// ─── Component ────────────────────────────────────────

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyState,
  loading,
  searchable,
  searchPlaceholder = "Rechercher…",
  searchKeys,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [query, setQuery] = useState("");

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  // Filter by search query
  const filtered = useMemo(() => {
    if (!query || !searchKeys) return data;
    const q = query.toLowerCase();
    return data.filter((item) => searchKeys(item).toLowerCase().includes(q));
  }, [data, query, searchKeys]);

  // Sort data
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortValue) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = col.sortValue!(a);
      const bVal = col.sortValue!(b);
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortDir === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filtered, sortKey, sortDir, columns]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-white overflow-hidden">
        {searchable && (
          <div className="px-4 py-3 border-b border-border">
            <div className="skeleton h-10 w-full max-w-sm" />
          </div>
        )}
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-charcoal-50/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-charcoal-500",
                    col.className,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} colCount={columns.length} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Empty state
  if (data.length === 0 && emptyState) {
    return (
      <div className="rounded-xl border border-border bg-white">
        {emptyState}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden">
      {/* Search bar */}
      {searchable && (
        <div className="px-4 py-3 border-b border-border">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-lg border border-border bg-charcoal-50/50 py-2 pl-9 pr-3 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors duration-150"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-charcoal-50/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "sticky top-0 z-10 bg-charcoal-50/50 py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-charcoal-500",
                    col.sortable && "cursor-pointer select-none hover:text-charcoal-700 transition-colors duration-150",
                    col.className,
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                  aria-sort={sortKey === col.key ? (sortDir === "asc" ? "ascending" : "descending") : undefined}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      sortKey === col.key
                        ? sortDir === "asc"
                          ? <ChevronUp size={12} className="transition-transform duration-150" />
                          : <ChevronDown size={12} className="transition-transform duration-150" />
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
                  "border-b border-border/50 transition-colors duration-150",
                  onRowClick && "cursor-pointer hover:bg-charcoal-50",
                )}
                onClick={() => onRowClick?.(item)}
                onKeyDown={onRowClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onRowClick(item); } } : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                role={onRowClick ? "button" : undefined}
              >
                {columns.map((col) => (
                  <td key={col.key} className={cn("py-3.5 px-4", col.className)}>
                    {col.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer with result count */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-border text-xs text-charcoal-400">
        <span>
          {sorted.length} résultat{sorted.length > 1 ? "s" : ""}
          {query && ` sur ${data.length}`}
        </span>
      </div>

      {/* No results from search */}
      {sorted.length === 0 && query && (
        <div className="px-4 pb-6 text-center">
          <p className="text-sm text-charcoal-500">Aucun résultat pour &ldquo;{query}&rdquo;</p>
        </div>
      )}
    </div>
  );
}
