"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navConfigs: Record<
  string,
  { links: { label: string; href: string }[]; cta: { label: string; href: string } }
> = {
  "/": {
    links: [
      { label: "Nos formules", href: "#formulas" },
      { label: "Comment ça marche", href: "#how" },
    ],
    cta: { label: "Trouver un golf", href: "#book" },
  },
  "/golf": {
    links: [
      { label: "Le concept", href: "#concept" },
      { label: "Comment ça marche", href: "#process" },
      { label: "Le container", href: "#container" },
      { label: "Spécifications", href: "/specs" },
    ],
    cta: { label: "Estimer mes revenus", href: "#simulator" },
  },
  "/rejoindre": {
    links: [
      { label: "Les avantages", href: "#advantages" },
      { label: "Le parcours", href: "#apply" },
    ],
    cta: { label: "Postuler", href: "#apply" },
  },
};

const audienceTabs = [
  { label: "Clients", href: "/" },
  { label: "Golfs partenaires", href: "/golf" },
  { label: "Devenir laveur", href: "/rejoindre" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const config = navConfigs[pathname] || navConfigs["/"];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border">
      {/* Audience tabs bar */}
      <div className="bg-charcoal-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 h-8 text-xs overflow-x-auto">
            {audienceTabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-3 py-1 rounded-sm whitespace-nowrap transition-colors ${
                  pathname === tab.href
                    ? "text-white font-semibold bg-white/15"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main nav */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="The Green Valet"
              width={300}
              height={168}
              className="h-16 w-auto"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {config.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-charcoal-600 hover:text-green-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={config.cta.href}
              className="inline-flex items-center justify-center rounded-lg bg-green-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 transition-colors"
            >
              {config.cta.label}
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white">
          <nav className="flex flex-col px-4 py-4 gap-3">
            {config.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-charcoal-600 hover:text-green-900 py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={config.cta.href}
              className="inline-flex items-center justify-center rounded-lg bg-green-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 transition-colors mt-2"
              onClick={() => setMobileOpen(false)}
            >
              {config.cta.label}
            </Link>

            {/* Audience links in mobile */}
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-500 mb-2">
                Vous êtes
              </p>
              {audienceTabs
                .filter((tab) => tab.href !== pathname)
                .map((tab) => (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className="block text-sm text-green-800 hover:text-green-900 py-1.5 font-medium"
                    onClick={() => setMobileOpen(false)}
                  >
                    {tab.label} &rarr;
                  </Link>
                ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
