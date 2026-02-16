"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Building2,
  Users,
  MapPin,
  FileText,
  FileStack,
  Settings,
  X,
} from "lucide-react";
import { useLayoutStore } from "@/stores/useLayoutStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";

interface NavSection {
  title: string;
  items: { label: string; href: string; icon: typeof LayoutDashboard }[];
}

const navSections: NavSection[] = [
  {
    title: "Opérations",
    items: [
      { label: "Vue d'ensemble", href: "/overview", icon: LayoutDashboard },
      { label: "Leads", href: "/leads", icon: Inbox },
      { label: "Partenaires", href: "/partners", icon: Building2 },
      { label: "Opérateurs", href: "/operators", icon: Users },
      { label: "Sites", href: "/sites", icon: MapPin },
    ],
  },
  {
    title: "Documents",
    items: [
      { label: "Documents", href: "/documents", icon: FileText },
      { label: "Templates", href: "/templates", icon: FileStack },
    ],
  },
  {
    title: "Système",
    items: [
      { label: "Paramètres", href: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useLayoutStore();
  const role = useAuthStore((s) => s.role);

  // Filter nav items based on role
  const allowedHrefs = (() => {
    if (role === "admin") return null; // admin sees everything
    if (role === "partner") return ["/overview", "/documents", "/settings"];
    if (role === "operator") return ["/overview", "/documents", "/settings"];
    return [];
  })();

  const filteredSections = navSections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => !allowedHrefs || allowedHrefs.includes(item.href),
      ),
    }))
    .filter((section) => section.items.length > 0);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-[var(--border)]">
        <Link href="/overview" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="The Green Valet"
            width={140}
            height={78}
            className="h-8 w-auto"
          />
        </Link>
        <button
          className="lg:hidden p-1 text-charcoal-500 hover:text-charcoal-900"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-6">
        {filteredSections.map((section) => (
          <div key={section.title}>
            <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-charcoal-400">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-green-50 text-green-900"
                        : "text-charcoal-600 hover:bg-charcoal-50 hover:text-charcoal-900"
                    )}
                  >
                    <item.icon size={18} className={isActive ? "text-green-700" : ""} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-[var(--border)]">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/30"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white flex flex-col shadow-xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
