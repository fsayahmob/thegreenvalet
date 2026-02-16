"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthStore } from "@/stores/useAuthStore";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInWithGoogle, loading, error, clearError, user, role } =
    useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [debugLogs, setDebugLogs] = useState("");

  // Read persisted auth debug logs from localStorage
  useEffect(() => {
    const interval = setInterval(() => {
      setDebugLogs(localStorage.getItem("__auth_debug") ?? "");
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Redirect if already authenticated
  if (user && !loading) {
    router.replace("/overview");
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearError();
    await signIn(email, password);
    // onAuthStateChanged will update user → redirect on next render
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — Form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <Image
            src="/images/logo.png"
            alt="The Green Valet"
            width={200}
            height={112}
            className="h-14 w-auto mb-10"
          />

          <h1 className="text-2xl font-bold text-charcoal-900">
            Connexion
          </h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Accédez à votre espace de gestion The Green Valet.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-charcoal-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-green-600/30 focus:border-green-600 transition-colors"
                placeholder="nom@golf.fr"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-charcoal-700"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-green-600/30 focus:border-green-600 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-green-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </button>

            {/* Separator */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border)]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-charcoal-400">ou</span>
              </div>
            </div>

            {/* Google Sign-In */}
            <button
              type="button"
              onClick={signInWithGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-medium text-charcoal-700 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continuer avec Google
            </button>
          </form>
        </div>
      </div>

      {/* Right — Visual */}
      <div className="hidden lg:flex flex-1 relative">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-green-900/60" />
        <div className="relative z-10 flex flex-col justify-end p-12">
          <blockquote className="text-white/90 text-lg leading-relaxed max-w-md">
            &ldquo;Le service que les golfs attendaient. Premium, écologique, sans
            investissement.&rdquo;
          </blockquote>
          <p className="mt-3 text-white/60 text-sm">
            Gaetant — Fondateur, The Green Valet
          </p>
        </div>
      </div>

      {/* Temporary debug panel — remove after fixing auth */}
      {debugLogs && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 text-green-400 p-4 text-xs font-mono max-h-48 overflow-auto z-50">
          <div className="flex justify-between mb-2">
            <span className="text-white font-bold">Auth Debug (state: user={user ? "yes" : "null"} role={role ?? "null"} loading={String(loading)})</span>
            <button
              onClick={() => { localStorage.removeItem("__auth_debug"); setDebugLogs(""); }}
              className="text-red-400 hover:text-red-300"
            >
              Clear
            </button>
          </div>
          <pre className="whitespace-pre-wrap">{debugLogs}</pre>
        </div>
      )}
    </div>
  );
}
