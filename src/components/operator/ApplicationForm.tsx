"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

export function ApplicationForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: connecter à Cloud Function submitOperatorApplication
    setSubmitted(true);
  }

  return (
    <section id="apply" className="py-20 sm:py-28 bg-muted">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Candidature"
          title="Rejoignez le réseau"
          description="Remplissez ce formulaire, on vous recontacte sous 48h."
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
          <form onSubmit={handleSubmit} className="mt-12 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-charcoal-900 mb-1.5"
                >
                  Prénom
                </label>
                <Input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  placeholder="Jean"
                  className="h-12"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-charcoal-900 mb-1.5"
                >
                  Nom
                </label>
                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  placeholder="Dupont"
                  className="h-12"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                  placeholder="jean.dupont@email.com"
                  className="h-12"
                />
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
                  required
                  placeholder="06 12 34 56 78"
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
                  Ville / Région
                </label>
                <Input
                  type="text"
                  id="city"
                  name="city"
                  required
                  placeholder="Rennes, Bretagne"
                  className="h-12"
                />
              </div>
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-charcoal-900 mb-1.5"
                >
                  Statut actuel
                </label>
                <select
                  id="status"
                  name="status"
                  required
                  className="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent"
                >
                  <option value="">Sélectionnez</option>
                  <option value="auto-entrepreneur">
                    Auto-entrepreneur (déjà immatriculé)
                  </option>
                  <option value="salarie">
                    Salarié (en reconversion)
                  </option>
                  <option value="demandeur-emploi">
                    Demandeur d&apos;emploi
                  </option>
                  <option value="etudiant">Étudiant</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="motivation"
                className="block text-sm font-medium text-charcoal-900 mb-1.5"
              >
                Pourquoi souhaitez-vous rejoindre The Green Valet ?
              </label>
              <Textarea
                id="motivation"
                name="motivation"
                rows={3}
                placeholder="Parlez-nous de vous, votre motivation, votre disponibilité..."
                className="resize-none"
              />
            </div>

            {/* Honeypot */}
            <input
              type="text"
              name="website"
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <Button type="submit" size="lg">
              <Send size={18} />
              Envoyer ma candidature
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
