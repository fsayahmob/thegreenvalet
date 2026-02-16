import { Badge } from "@/components/ui/badge";
import type { StatusColor } from "@/lib/config";

const COLOR_MAP: Record<StatusColor, string> = {
  green: "bg-green-100 text-green-800",
  blue: "bg-blue-100 text-blue-800",
  amber: "bg-amber-100 text-amber-800",
  red: "bg-red-100 text-red-800",
  purple: "bg-purple-100 text-purple-800",
  gray: "bg-charcoal-100 text-charcoal-600",
};

interface StatusBadgeProps {
  label: string;
  color: StatusColor;
  icon?: React.ReactNode;
  className?: string;
}

export function StatusBadge({ label, color, icon, className }: StatusBadgeProps) {
  return (
    <Badge className={`${COLOR_MAP[color]} ${className ?? ""}`}>
      {icon && <span className="mr-1">{icon}</span>}
      {label}
    </Badge>
  );
}
