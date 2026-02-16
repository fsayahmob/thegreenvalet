import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-slide-up">
      <div className="rounded-2xl bg-charcoal-50 p-4 mb-4">
        <Icon size={32} className="text-charcoal-400" />
      </div>
      <p className="text-sm font-medium text-charcoal-600">{title}</p>
      {description && (
        <p className="mt-1 text-xs text-charcoal-400 text-center max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
