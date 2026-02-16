"use client";

import { useEffect, useRef } from "react";
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
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="fixed inset-0 z-50 m-auto max-w-md w-full rounded-xl border border-border bg-white p-0 shadow-xl backdrop:bg-black/40"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-charcoal-900">{title}</h3>
          <button onClick={onClose} className="text-charcoal-400 hover:text-charcoal-700">
            <X size={18} />
          </button>
        </div>
        {description && (
          <p className="mt-2 text-sm text-charcoal-500">{description}</p>
        )}
        {children && <div className="mt-4">{children}</div>}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm} disabled={loading}>
            {loading ? "En cours…" : confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
