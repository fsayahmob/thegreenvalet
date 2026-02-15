"use client";

import {
  Building2,
  Users,
  MapPin,
  FileText,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}

function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-charcoal-500">{label}</p>
        <div className={`rounded-lg p-2 ${color}`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold text-charcoal-900">{value}</p>
    </div>
  );
}

interface AlertProps {
  type: "warning" | "info";
  message: string;
}

function AlertItem({ type, message }: AlertProps) {
  return (
    <div
      className={`flex items-start gap-3 rounded-lg px-4 py-3 text-sm ${
        type === "warning"
          ? "bg-amber-50 text-amber-800 border border-amber-200"
          : "bg-blue-50 text-blue-800 border border-blue-200"
      }`}
    >
      {type === "warning" ? (
        <AlertTriangle size={16} className="mt-0.5 shrink-0" />
      ) : (
        <Clock size={16} className="mt-0.5 shrink-0" />
      )}
      {message}
    </div>
  );
}

export default function OverviewPage() {
  const displayName = useAuthStore((s) => s.displayName);

  // Placeholder data — will be replaced with Firestore queries
  const stats = [
    {
      label: "Partenaires",
      value: 1,
      icon: Building2,
      color: "bg-green-100 text-green-700",
    },
    {
      label: "Opérateurs",
      value: 0,
      icon: Users,
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "Sites actifs",
      value: 0,
      icon: MapPin,
      color: "bg-purple-100 text-purple-700",
    },
    {
      label: "Documents en attente",
      value: 0,
      icon: FileText,
      color: "bg-amber-100 text-amber-700",
    },
  ];

  const alerts = [
    {
      type: "info" as const,
      message: "Golf de Dinard — Onboarding en cours (étape 1/6)",
    },
    {
      type: "warning" as const,
      message: "Aucun opérateur enregistré. Recrutement nécessaire.",
    },
  ];

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Alerts */}
      <div className="rounded-xl border border-[var(--border)] bg-white p-5">
        <h2 className="text-sm font-semibold text-charcoal-900 mb-4">
          Alertes & notifications
        </h2>
        <div className="space-y-3">
          {alerts.map((alert, i) => (
            <AlertItem key={i} {...alert} />
          ))}
        </div>
      </div>
    </div>
  );
}
