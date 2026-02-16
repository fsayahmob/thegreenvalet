"use client";

import { useEffect } from "react";
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
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />

      {/* Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex flex-col bg-white shadow-xl border-l border-border ${
          wide ? "w-full max-w-2xl" : "w-full max-w-md"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-charcoal-900">{title}</h2>
            {subtitle && (
              <p className="mt-0.5 text-sm text-charcoal-500">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-charcoal-400 hover:text-charcoal-700 hover:bg-charcoal-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}
