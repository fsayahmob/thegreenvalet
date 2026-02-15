"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthStore } from "@/stores/useAuthStore";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, loading, error, clearError, user } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    </div>
  );
}
