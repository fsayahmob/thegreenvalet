"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Loader2, ShieldAlert, AlertTriangle } from "lucide-react";

// ─── Error Boundary (H10) ────────────────────────────

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class DashboardErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--muted)]">
          <div className="text-center max-w-md p-8">
            <AlertTriangle size={48} className="mx-auto mb-4 text-amber-500" />
            <h2 className="text-xl font-semibold text-charcoal-900 mb-2">
              Une erreur est survenue
            </h2>
            <p className="text-charcoal-600 mb-4">
              {this.state.error?.message ?? "Erreur inattendue."}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Dashboard Guard (auth + role) ───────────────────

function DashboardGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, role, loading } = useAuthStore();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-green-700" />
      </div>
    );
  }

  if (!user) return null;

  // H8: Role guard — only admin can access dashboard
  if (role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--muted)]">
        <div className="text-center max-w-md p-8">
          <ShieldAlert size={48} className="mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold text-charcoal-900 mb-2">
            Accès refusé
          </h2>
          <p className="text-charcoal-600 mb-4">
            Vous n&apos;avez pas les droits pour accéder à cette section.
          </p>
          <button
            onClick={() => router.replace("/")}
            className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
          >
            Retour à l&apos;accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--muted)]">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <DashboardErrorBoundary>
        <DashboardGuard>{children}</DashboardGuard>
      </DashboardErrorBoundary>
    </AuthProvider>
  );
}
