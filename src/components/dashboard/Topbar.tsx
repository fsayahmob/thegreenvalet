"use client";

import { usePathname } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import { useLayoutStore } from "@/stores/useLayoutStore";
import { useAuthStore } from "@/stores/useAuthStore";

const PAGE_TITLES: Record<string, string> = {
  "/overview": "Vue d'ensemble",
  "/leads": "Leads",
  "/partners": "Partenaires",
  "/operators": "Opérateurs",
  "/sites": "Sites",
  "/documents": "Documents",
  "/templates": "Templates",
  "/settings": "Paramètres",
};

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrateur",
  partner: "Partenaire",
  operator: "Opérateur",
};

function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.charAt(0).toUpperCase();
}

export function Topbar() {
  const pathname = usePathname();
  const toggleSidebar = useLayoutStore((s) => s.toggleSidebar);
  const { displayName, role, signOut } = useAuthStore();

  // Derive page title from pathname (supports /partners/[id] → "Partenaires")
  const basePath = "/" + (pathname.split("/")[1] ?? "");
  const pageTitle = PAGE_TITLES[basePath] ?? "";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-white/90 backdrop-blur-md px-4 sm:px-6">
      {/* Mobile menu toggle */}
      <button
        className="lg:hidden rounded-lg p-2 text-charcoal-600 hover:text-charcoal-900 hover:bg-charcoal-100 transition-colors duration-150"
        onClick={toggleSidebar}
        aria-label="Ouvrir le menu"
      >
        <Menu size={20} />
      </button>

      {/* Page title */}
      <h1 className="text-lg font-semibold text-charcoal-900 hidden sm:block">
        {pageTitle}
      </h1>

      <div className="flex-1" />

      {/* User info */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-charcoal-900">{displayName}</p>
          <p className="text-xs text-charcoal-500">
            {role ? ROLE_LABELS[role] ?? role : "—"}
          </p>
        </div>

        {/* Avatar */}
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center ring-2 ring-white shadow-sm">
          <span className="text-green-800 font-semibold text-xs leading-none">
            {getInitials(displayName)}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={signOut}
          className="rounded-lg p-2 text-charcoal-400 hover:text-red-600 hover:bg-red-50 transition-colors duration-150"
          title="Déconnexion"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
