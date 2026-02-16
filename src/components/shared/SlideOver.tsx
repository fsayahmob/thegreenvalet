"use client";

import { useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";

interface SlideOverProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  wide?: boolean;
}

export function SlideOver({ open, onClose, title, subtitle, children, wide = false }: SlideOverProps) {
  const [visible, setVisible] = useState(false);

  // Derive closing state — no separate useState needed
  const closing = visible && !open;

  // Adjust visible during render when open becomes true (React-recommended pattern)
  if (open && !visible) {
    setVisible(true);
  }

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [visible]);

  // Close on Escape
  useEffect(() => {
    if (!visible) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [visible, handleClose]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-40">
      {/* Backdrop with blur */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm ${
          closing ? "animate-fade-out" : "animate-fade-in"
        }`}
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-40 flex flex-col bg-white border-l border-border ${
          wide ? "w-full max-w-2xl" : "w-full max-w-md"
        } ${closing ? "animate-slide-out-r" : "animate-slide-in-r"}`}
        style={{ boxShadow: "var(--shadow-xl)" }}
        onAnimationEnd={() => { if (closing) setVisible(false); }}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border px-6 py-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-charcoal-900 truncate">{title}</h2>
            {subtitle && (
              <p className="mt-0.5 text-sm text-charcoal-500 truncate">{subtitle}</p>
            )}
          </div>
          <button
            onClick={handleClose}
            aria-label="Fermer"
            className="ml-4 rounded-lg p-1.5 text-charcoal-400 hover:text-charcoal-700 hover:bg-charcoal-100 transition-colors duration-150"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
}
