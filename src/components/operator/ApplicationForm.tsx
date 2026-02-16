"use client";

import { useState } from "react";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { httpsCallable } from "firebase/functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { functions } from "@/lib/firebase";

export function ApplicationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const data = {
      firstName: form.get("firstName") as string,
      lastName: "",
      email: form.get("email") as string,
      phone: form.get("phone") as string,
      city: form.get("city") as string,
      currentStatus: "",
      motivation: "",
      honeypot: form.get("website") as string,
    };

    try {
      const submitApplication = httpsCallable(
        functions,
        "submitOperatorApplication"
      );
      await submitApplication(data);
      setSubmitted(true);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="apply" className="py-20 sm:py-28 bg-muted">
      <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Candidature"
          title="Rejoignez le réseau"
          description="4 champs, 30 secondes. On vous rappelle sous 48h."
        />

        {submitted ? (
          <Card className="mt-12 bg-green-50 border-green-200">
            <CardContent className="py-12 text-center">
              <CheckCircle className="mx-auto text-green-600" size={48} />
              <h3 className="mt-4 text-xl font-semibold text-green-900">
                Candidature envoyée !
              </h3>
              <p className="mt-2 text-muted-foreground">
                Nous vous recontactons dans les 48 heures pour un premier
                échange.
              </p>
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="mt-12 space-y-4">
            <Input
              type="text"
              id="firstName"
              name="firstName"
              required
              placeholder="Prénom"
              className="h-12"
            />
            <Input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Email"
              className="h-12"
            />
            <Input
              type="tel"
              id="phone"
              name="phone"
              required
              placeholder="Téléphone"
              className="h-12"
            />
            <Input
              type="text"
              id="city"
              name="city"
              required
              placeholder="Ville / Région"
              className="h-12"
            />

            {/* Honeypot */}
            <input
              type="text"
              name="website"
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
              {loading ? "Envoi en cours…" : "Postuler maintenant"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              On discutera du reste lors de notre premier échange.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
