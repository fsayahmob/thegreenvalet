import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-charcoal-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <Image
                src="/images/favicon.png"
                alt="The Green Valet"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="font-semibold text-lg">The Green Valet</span>
            </div>
            <p className="mt-4 text-sm text-charcoal-500 leading-relaxed max-w-xs">
              Lavage vapeur éco-responsable sur les golfs de France. Premium,
              écologique, sans effort.
            </p>
          </div>

          {/* Clients */}
          <div>
            <p className="font-semibold text-sm uppercase tracking-wider text-charcoal-500">
              Clients
            </p>
            <nav className="mt-4 flex flex-col gap-2">
              <Link
                href="/#formulas"
                className="text-sm text-charcoal-500 hover:text-white transition-colors"
              >
                Nos formules
              </Link>
              <Link
                href="/#how"
                className="text-sm text-charcoal-500 hover:text-white transition-colors"
              >
                Comment ça marche
              </Link>
              <Link
                href="/#book"
                className="text-sm text-charcoal-500 hover:text-white transition-colors"
              >
                Trouver un golf
              </Link>
            </nav>
          </div>

          {/* Golfs partenaires */}
          <div>
            <p className="font-semibold text-sm uppercase tracking-wider text-charcoal-500">
              Golfs partenaires
            </p>
            <nav className="mt-4 flex flex-col gap-2">
              <Link
                href="/golf#concept"
                className="text-sm text-charcoal-500 hover:text-white transition-colors"
              >
                Le concept
              </Link>
              <Link
                href="/golf#container"
                className="text-sm text-charcoal-500 hover:text-white transition-colors"
              >
                Le container
              </Link>
              <Link
                href="/specs"
                className="text-sm text-charcoal-500 hover:text-white transition-colors"
              >
                Spécifications techniques
              </Link>
              <Link
                href="/golf#contact"
                className="text-sm text-charcoal-500 hover:text-white transition-colors"
              >
                Devenir partenaire
              </Link>
            </nav>
          </div>

          {/* Opérateurs */}
          <div>
            <p className="font-semibold text-sm uppercase tracking-wider text-charcoal-500">
              Laveurs indépendants
            </p>
            <nav className="mt-4 flex flex-col gap-2">
              <Link
                href="/rejoindre#advantages"
                className="text-sm text-charcoal-500 hover:text-white transition-colors"
              >
                Les avantages
              </Link>
              <Link
                href="/rejoindre#apply"
                className="text-sm text-charcoal-500 hover:text-white transition-colors"
              >
                Postuler
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-charcoal-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-charcoal-600">
            &copy; {new Date().getFullYear()} The Green Valet. Tous droits
            réservés.
          </p>
          <div className="flex gap-6">
            <Link
              href="/mentions-legales"
              className="text-xs text-charcoal-600 hover:text-charcoal-500 transition-colors"
            >
              Mentions légales
            </Link>
            <Link
              href="/confidentialite"
              className="text-xs text-charcoal-600 hover:text-charcoal-500 transition-colors"
            >
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
