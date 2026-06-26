import { cn } from "@/lib/utils";

export type Priority = "urgent" | "high" | "medium" | "low" | "none";

const priorityStyles: Record<Priority, string> = {
  urgent: "bg-[#c64545]/10 text-[#c64545] border-[#c64545]/20",
  high: "bg-[#d4a017]/10 text-[#9a7200] border-[#d4a017]/30",
  medium: "bg-surface-cream-strong text-body border-hairline",
  low: "bg-canvas text-muted-soft border-hairline",
  none: "bg-canvas text-muted-soft border-hairline",
};

const priorityLabels: Record<Priority, string> = {
  urgent: "Urgent",
  high: "High",
  medium: "Medium",
  low: "Low",
  none: "None",
};

type PriorityPillProps = {
  priority: Priority;
  className?: string;
};

export function PriorityPill({ priority, className }: PriorityPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize",
        priorityStyles[priority],
        className
      )}
    >
      {priorityLabels[priority]}
    </span>
  );
}
