"use client";

import { useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  confirmVariant?: "default" | "destructive";
  loading?: boolean;
  children?: React.ReactNode;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirmer",
  confirmVariant = "default",
  loading = false,
  children,
}: ConfirmDialogProps) {
  const [visible, setVisible] = useState(false);

  // Derive closing state — no separate useState needed
  const closing = visible && !open;

  // Adjust visible during render when open becomes true (React-recommended pattern)
  if (open && !visible) {
    setVisible(true);
  }

  const handleClose = useCallback(() => {
    if (!loading) onClose();
  }, [onClose, loading]);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [visible]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm ${
          closing ? "animate-fade-out" : "animate-fade-in"
        }`}
        onClick={handleClose}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-50 w-full max-w-md rounded-xl border border-border bg-white p-6 ${
          closing ? "animate-scale-out" : "animate-scale-in"
        }`}
        style={{ boxShadow: "var(--shadow-xl)" }}
        onAnimationEnd={() => { if (closing) setVisible(false); }}
      >
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-charcoal-900">{title}</h3>
          <button
            onClick={handleClose}
            disabled={loading}
            aria-label="Fermer"
            className="rounded-lg p-1 text-charcoal-400 hover:text-charcoal-700 hover:bg-charcoal-100 transition-colors duration-150 disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>
        {description && (
          <p className="mt-2 text-sm text-charcoal-500">{description}</p>
        )}
        {children && <div className="mt-4">{children}</div>}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Annuler
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm} disabled={loading}>
            {loading ? "En cours…" : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
