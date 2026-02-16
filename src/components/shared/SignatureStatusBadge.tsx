"use client";

import { PenTool } from "lucide-react";
import { YOUSIGN_STATUS_CONFIG } from "@/lib/config";
import { StatusBadge } from "./StatusBadge";
import type { YousignStatus } from "@/lib/types";

interface SignatureStatusBadgeProps {
  status: YousignStatus;
}

export function SignatureStatusBadge({ status }: SignatureStatusBadgeProps) {
  const cfg = YOUSIGN_STATUS_CONFIG[status];
  if (!cfg) return null;

  return (
    <span className="inline-flex items-center gap-1">
      <PenTool size={12} className="text-charcoal-400" />
      <StatusBadge
        label={cfg.label}
        color={cfg.color}
        pulse={status === "activated"}
      />
    </span>
  );
}
