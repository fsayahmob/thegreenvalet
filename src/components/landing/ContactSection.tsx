"use client";

import { useState } from "react";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { httpsCallable } from "firebase/functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { functions } from "@/lib/firebase";

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const data = {
      golfName: form.get("golf") as string,
      contactName: form.get("contactName") as string,
      city: form.get("city") as string,
      email: form.get("email") as string,
      phone: form.get("phone") as string,
      message: form.get("message") as string,
    };

    try {
      const submitContactForm = httpsCallable(functions, "submitContactForm");
      await submitContactForm(data);
      setSubmitted(true);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Contactez-nous"
          title="Votre golf est-il éligible ?"
          description="Sans engagement. On vous rappelle sous 24h."
        />

        {submitted ? (
          <Card className="mt-12 bg-green-50 border-green-200">
            <CardContent className="py-12 text-center">
              <CheckCircle className="mx-auto text-green-600" size={48} />
              <h3 className="mt-4 text-xl font-semibold text-green-900">
                Message envoyé !
              </h3>
              <p className="mt-2 text-muted-foreground">
                Nous revenons vers vous dans les 24 heures.
              </p>
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="mt-12 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="golf"
                  className="block text-sm font-medium text-charcoal-900 mb-1.5"
                >
                  Nom du golf
                </label>
                <Input
                  type="text"
                  id="golf"
                  name="golf"
                  required
                  placeholder="Golf de Dinard"
                  className="h-12"
                />
              </div>
              <div>
                <label
                  htmlFor="contactName"
                  className="block text-sm font-medium text-charcoal-900 mb-1.5"
                >
                  Nom du contact
                </label>
                <Input
                  type="text"
                  id="contactName"
                  name="contactName"
                  required
                  placeholder="Jean Dupont"
                  className="h-12"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-charcoal-900 mb-1.5"
                >
                  Ville
                </label>
                <Input
                  type="text"
                  id="city"
                  name="city"
                  required
                  placeholder="Saint-Briac-sur-Mer"
                  className="h-12"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-charcoal-900 mb-1.5"
                >
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="direction@golfdinard.com"
                  className="h-12"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-charcoal-900 mb-1.5"
              >
                Téléphone
              </label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                placeholder="06 12 34 56 78"
                className="h-12"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-charcoal-900 mb-1.5"
              >
                Message (optionnel)
              </label>
              <Textarea
                id="message"
                name="message"
                rows={3}
                placeholder="Parlez-nous de votre golf, nombre de membres, emplacement envisagé..."
                className="resize-none"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <Button type="submit" size="lg" disabled={loading}>
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
              {loading ? "Envoi en cours…" : "Envoyer"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
