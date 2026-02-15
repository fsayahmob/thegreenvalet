"use client";

import { Menu, LogOut } from "lucide-react";
import { useLayoutStore } from "@/stores/useLayoutStore";
import { useAuthStore } from "@/stores/useAuthStore";

export function Topbar() {
  const toggleSidebar = useLayoutStore((s) => s.toggleSidebar);
  const { displayName, role, signOut } = useAuthStore();

  const roleLabel: Record<string, string> = {
    admin: "Administrateur",
    partner: "Partenaire",
    operator: "Opérateur",
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-[var(--border)] bg-white/90 backdrop-blur-md px-4 sm:px-6">
      <button
        className="lg:hidden p-2 text-charcoal-600 hover:text-charcoal-900"
        onClick={toggleSidebar}
        aria-label="Ouvrir le menu"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1" />

      {/* User info */}
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-charcoal-900">{displayName}</p>
          <p className="text-xs text-charcoal-500">
            {role ? roleLabel[role] ?? role : "—"}
          </p>
        </div>
        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-green-800 font-semibold text-xs">
            {displayName?.charAt(0)?.toUpperCase() ?? "?"}
          </span>
        </div>
        <button
          onClick={signOut}
          className="p-2 text-charcoal-400 hover:text-red-600 transition-colors"
          title="Déconnexion"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
