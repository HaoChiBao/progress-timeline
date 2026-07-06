"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

type TimelineAddButtonProps = {
  projectName: string;
  railHovered: boolean;
  onStartAdd: () => void;
};

export function TimelineAddButton({
  projectName,
  railHovered,
  onStartAdd,
}: TimelineAddButtonProps) {
  const [buttonHovered, setButtonHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const revealed = railHovered || buttonHovered || focused;

  return (
    <button
      type="button"
      onClick={onStartAdd}
      onPointerEnter={() => setButtonHovered(true)}
      onPointerLeave={() => setButtonHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      aria-label={`Add tick to ${projectName}`}
      className={cn(
        "timeline-add-button timeline-tick timeline-tick--add absolute right-0 bottom-2 z-10 flex items-end justify-center px-1",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
        !revealed && "pointer-events-none opacity-0",
        revealed && !buttonHovered && !focused && "pointer-events-auto opacity-40 text-muted-soft",
        revealed && (buttonHovered || focused) && "pointer-events-auto opacity-100 text-ink"
      )}
    >
      [+]
    </button>
  );
}
