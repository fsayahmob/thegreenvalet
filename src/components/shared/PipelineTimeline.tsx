"use client";

import { Check, Lock, Clock, SkipForward, AlertCircle } from "lucide-react";
import type { PipelineStage, PipelineProgress, PipelineStageStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_ICON: Record<PipelineStageStatus, typeof Check> = {
  locked: Lock,
  in_progress: Clock,
  waiting_external: AlertCircle,
  completed: Check,
  skipped: SkipForward,
};

const STATUS_STYLES: Record<PipelineStageStatus, { ring: string; bg: string; text: string; line: string }> = {
  locked: { ring: "ring-charcoal-200", bg: "bg-charcoal-100", text: "text-charcoal-400", line: "bg-charcoal-200" },
  in_progress: { ring: "ring-blue-400", bg: "bg-blue-100", text: "text-blue-700", line: "bg-blue-300" },
  waiting_external: { ring: "ring-amber-400", bg: "bg-amber-100", text: "text-amber-700", line: "bg-amber-300" },
  completed: { ring: "ring-green-500", bg: "bg-green-100", text: "text-green-700", line: "bg-green-500" },
  skipped: { ring: "ring-charcoal-300", bg: "bg-charcoal-50", text: "text-charcoal-400", line: "bg-charcoal-300" },
};

interface PipelineTimelineProps {
  stages: PipelineStage[];
  progress: PipelineProgress[];
  onStageClick?: (stageKey: string, currentStatus: PipelineStageStatus) => void;
  compact?: boolean;
}

function getStageStatus(stageKey: string, progress: PipelineProgress[]): PipelineStageStatus {
  const p = progress.find((pp) => pp.stageKey === stageKey);
  return p?.status ?? "locked";
}

export function PipelineTimeline({ stages, progress, onStageClick, compact }: PipelineTimelineProps) {
  const sorted = [...stages].sort((a, b) => a.order - b.order);

  return (
    <div className="relative">
      {sorted.map((stage, idx) => {
        const status = getStageStatus(stage.key, progress);
        const styles = STATUS_STYLES[status];
        const Icon = STATUS_ICON[status];
        const isLast = idx === sorted.length - 1;
        const progressItem = progress.find((p) => p.stageKey === stage.key);

        return (
          <div key={stage.key} className="relative flex gap-4">
            {/* Vertical line */}
            {!isLast && (
              <div
                className={cn(
                  "absolute left-4 top-8 w-0.5 -translate-x-1/2",
                  compact ? "h-6" : "h-12",
                  status === "completed" ? styles.line : "bg-charcoal-200",
                )}
              />
            )}

            {/* Step circle */}
            <div
              className={cn(
                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-2",
                styles.ring,
                styles.bg,
                onStageClick && status !== "locked" && "cursor-pointer hover:ring-offset-2",
              )}
              onClick={() => onStageClick?.(stage.key, status)}
            >
              <Icon size={14} className={styles.text} />
            </div>

            {/* Content */}
            <div className={cn("pb-2", compact ? "pb-4" : "pb-8", isLast && "pb-0")}>
              <div className="flex items-center gap-2">
                <p className={cn("text-sm font-medium", status === "locked" ? "text-charcoal-400" : "text-charcoal-900")}>
                  {stage.name}
                </p>
                {stage.canRunParallel && (
                  <span className="text-[10px] text-charcoal-400 bg-charcoal-100 rounded px-1.5 py-0.5">
                    parallèle
                  </span>
                )}
                {stage.requiresYousign && (
                  <span className="text-[10px] text-purple-600 bg-purple-50 rounded px-1.5 py-0.5">
                    e-signature
                  </span>
                )}
              </div>
              {!compact && (
                <>
                  <p className="mt-0.5 text-xs text-charcoal-500">{stage.description}</p>
                  {stage.estimatedDuration && status === "in_progress" && (
                    <p className="mt-1 text-xs text-amber-600">Durée estimée : {stage.estimatedDuration}</p>
                  )}
                  {progressItem?.completedAt && (
                    <p className="mt-1 text-xs text-green-600">
                      Terminé le {new Date(progressItem.completedAt).toLocaleDateString("fr-FR")}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
