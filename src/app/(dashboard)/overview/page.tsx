"use client";

import { useEffect } from "react";
import {
  Building2,
  Users,
  MapPin,
  AlertTriangle,
  Clock,
  Inbox,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";
import { useLeadStore, useLeadCounts, useBreachedLeads } from "@/stores/useLeadStore";
import { usePartnerStore } from "@/stores/usePartnerStore";
import { useOperatorStore } from "@/stores/useOperatorStore";
import { useSiteStore } from "@/stores/useSiteStore";

// ─── Skeleton ─────────────────────────────────────────

function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="skeleton h-4 w-24" />
        <div className="skeleton h-9 w-9 rounded-lg" />
      </div>
      <div className="skeleton h-7 w-16 mt-3" />
    </div>
  );
}

function AlertSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <div className="skeleton h-4 w-40 mb-4" />
      <div className="space-y-3">
        <div className="skeleton h-12 w-full rounded-lg" />
        <div className="skeleton h-12 w-3/4 rounded-lg" />
      </div>
    </div>
  );
}

// ─── Components ───────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  href?: string;
}

function StatCard({ label, value, icon: Icon, color, href }: StatCardProps) {
  const content = (
    <div className="group rounded-xl border border-border bg-white p-5 transition-all duration-200 hover:shadow-md hover:border-charcoal-200">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-charcoal-500">{label}</p>
        <div className={`rounded-lg p-2 ${color} transition-transform duration-200 group-hover:scale-110`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold text-charcoal-900">{value}</p>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

interface AlertProps {
  type: "warning" | "info" | "success";
  message: string;
  href?: string;
}

function AlertItem({ type, message, href }: AlertProps) {
  const styles = {
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
    success: "bg-green-50 text-green-800 border-green-200",
  };
  const icons = {
    warning: AlertTriangle,
    info: Clock,
    success: TrendingUp,
  };
  const Icon = icons[type];

  const content = (
    <div className={`flex items-start gap-3 rounded-lg px-4 py-3 text-sm border transition-all duration-150 ${styles[type]} ${href ? "hover:shadow-sm cursor-pointer" : ""}`}>
      <Icon size={16} className="mt-0.5 shrink-0" />
      <span className="flex-1">{message}</span>
      {href && <ArrowRight size={16} className="mt-0.5 shrink-0 opacity-40 transition-transform duration-150 group-hover:translate-x-0.5" />}
    </div>
  );

  return href ? <Link href={href} className="group">{content}</Link> : content;
}

// ─── Page ─────────────────────────────────────────────

export default function OverviewPage() {
  const displayName = useAuthStore((s) => s.displayName);

  const partners = usePartnerStore((s) => s.partners);
  const partnersLoading = usePartnerStore((s) => s.loading);
  const operators = useOperatorStore((s) => s.operators);
  const operatorsLoading = useOperatorStore((s) => s.loading);
  const sites = useSiteStore((s) => s.sites);
  const sitesLoading = useSiteStore((s) => s.loading);
  const leadsLoading = useLeadStore((s) => s.loading);
  const leadCounts = useLeadCounts();
  const breached = useBreachedLeads();

  useEffect(() => {
    const u1 = useLeadStore.getState().subscribe();
    const u2 = usePartnerStore.getState().subscribe();
    const u3 = useOperatorStore.getState().subscribe();
    const u4 = useSiteStore.getState().subscribe();
    return () => { u1(); u2(); u3(); u4(); };
  }, []);

  const isLoading = partnersLoading || operatorsLoading || sitesLoading || leadsLoading;

  const onboardingPartners = partners.filter((p) => p.status === "onboarding").length;
  const activeOperators = operators.filter((o) => o.status === "active").length;
  const onboardingOperators = operators.filter((o) => o.status === "onboarding").length;
  const activeSites = sites.filter((s) => s.isActive).length;

  // Build alerts dynamically
  const alerts: AlertProps[] = [];

  if (breached.length > 0) {
    alerts.push({
      type: "warning",
      message: `${breached.length} lead${breached.length > 1 ? "s" : ""} en dépassement SLA — réponse immédiate requise`,
      href: "/leads",
    });
  }

  if (leadCounts.new > 0) {
    alerts.push({
      type: "info",
      message: `${leadCounts.new} nouveau${leadCounts.new > 1 ? "x" : ""} lead${leadCounts.new > 1 ? "s" : ""} en attente de premier contact`,
      href: "/leads",
    });
  }

  if (onboardingPartners > 0) {
    alerts.push({
      type: "info",
      message: `${onboardingPartners} partenaire${onboardingPartners > 1 ? "s" : ""} en onboarding`,
      href: "/partners",
    });
  }

  if (onboardingOperators > 0) {
    alerts.push({
      type: "info",
      message: `${onboardingOperators} opérateur${onboardingOperators > 1 ? "s" : ""} en formation`,
      href: "/operators",
    });
  }

  if (activeOperators === 0 && activeSites > 0) {
    alerts.push({
      type: "warning",
      message: "Aucun opérateur actif — recrutement nécessaire pour les sites actifs",
      href: "/operators",
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      type: "success",
      message: "Tout est en ordre. Aucune action immédiate requise.",
    });
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal-900">
          Bonjour, {displayName?.split(" ")[0] ?? "Admin"}
        </h1>
        <p className="mt-1 text-sm text-charcoal-500">
          Voici un résumé de l&apos;activité The Green Valet.
        </p>
      </div>

      {/* KPI Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 animate-slide-up">
          <StatCard
            label="Leads en attente"
            value={leadCounts.new + leadCounts.contacted}
            icon={Inbox}
            color="bg-amber-100 text-amber-700"
            href="/leads"
          />
          <StatCard
            label="Partenaires"
            value={partners.length}
            icon={Building2}
            color="bg-green-100 text-green-700"
            href="/partners"
          />
          <StatCard
            label="Opérateurs"
            value={operators.length}
            icon={Users}
            color="bg-blue-100 text-blue-700"
            href="/operators"
          />
          <StatCard
            label="Sites actifs"
            value={activeSites}
            icon={MapPin}
            color="bg-purple-100 text-purple-700"
            href="/sites"
          />
          <StatCard
            label="Taux conversion"
            value={leadCounts.total > 0 ? `${Math.round((leadCounts.converted / leadCounts.total) * 100)}%` : "—"}
            icon={TrendingUp}
            color="bg-green-100 text-green-700"
          />
        </div>
      )}

      {/* Alerts */}
      {isLoading ? (
        <AlertSkeleton />
      ) : (
        <div className="rounded-xl border border-border bg-white p-5 animate-slide-up">
          <h2 className="text-sm font-semibold text-charcoal-900 mb-4">
            Alertes & notifications
          </h2>
          <div className="space-y-3">
            {alerts.map((alert, i) => (
              <AlertItem key={i} {...alert} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
