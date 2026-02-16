import { Badge } from "@/components/ui/badge";
import type { StatusColor } from "@/lib/config";

const COLOR_MAP: Record<StatusColor, string> = {
  green:  "bg-green-50/80 text-green-800 border border-green-200/60",
  blue:   "bg-blue-50/80 text-blue-800 border border-blue-200/60",
  amber:  "bg-amber-50/80 text-amber-800 border border-amber-200/60",
  red:    "bg-red-50/80 text-red-800 border border-red-200/60",
  purple: "bg-purple-50/80 text-purple-800 border border-purple-200/60",
  gray:   "bg-charcoal-50/80 text-charcoal-600 border border-charcoal-200/60",
};

const DOT_COLOR_MAP: Record<StatusColor, string> = {
  green:  "bg-green-500",
  blue:   "bg-blue-500",
  amber:  "bg-amber-500",
  red:    "bg-red-500",
  purple: "bg-purple-500",
  gray:   "bg-charcoal-400",
};

const ACTIVE_COLORS: StatusColor[] = ["green", "blue", "amber"];

interface StatusBadgeProps {
  label: string;
  color: StatusColor;
  icon?: React.ReactNode;
  pulse?: boolean;
  className?: string;
}

export function StatusBadge({ label, color, icon, pulse, className }: StatusBadgeProps) {
  const shouldPulse = pulse ?? ACTIVE_COLORS.includes(color);

  return (
    <Badge className={`${COLOR_MAP[color]} ${className ?? ""}`}>
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full mr-1.5 ${DOT_COLOR_MAP[color]} ${
          shouldPulse ? "animate-pulse-dot" : ""
        }`}
      />
      {icon && <span className="mr-1">{icon}</span>}
      {label}
    </Badge>
  );
}
