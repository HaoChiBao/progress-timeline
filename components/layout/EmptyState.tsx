import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-hairline bg-surface-card px-8 py-16 text-center",
        className
      )}
    >
      {Icon && (
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary-active">
          <Icon className="size-5" />
        </div>
      )}
      <h3 className="font-display text-xl text-ink">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-text">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
