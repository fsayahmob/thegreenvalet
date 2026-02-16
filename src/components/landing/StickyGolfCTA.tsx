"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StickyGolfCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 600);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-white/95 backdrop-blur-sm shadow-[0_-2px_10px_rgba(0,0,0,0.08)] transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <p className="text-sm text-charcoal-700">
          <span className="font-semibold">0&euro; d&apos;investissement.</span>{" "}
          <span className="hidden sm:inline">
            Estimez les revenus de votre golf en 60 secondes.
          </span>
        </p>
        <Button size="lg" asChild className="shrink-0">
          <Link href="#simulator">
            <Calculator size={16} />
            Estimer mes revenus
          </Link>
        </Button>
      </div>
    </div>
  );
}
