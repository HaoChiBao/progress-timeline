"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export type AsciiDropdownOption<T extends string = string> = {
  value: T;
  label: string;
};

type AsciiDropdownProps<T extends string> = {
  value: T;
  options: AsciiDropdownOption<T>[];
  onChange: (value: T) => void;
  label?: string;
};

export function AsciiDropdown<T extends string>({
  value,
  options,
  onChange,
  label,
}: AsciiDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      {label && <span className="mb-1 block text-muted-soft">{label}</span>}
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between border border-hairline px-2 py-1 text-left text-ink hover:bg-surface-soft"
      >
        <span>{selected?.label ?? value}</span>
        <span className="text-muted-soft">{open ? "^" : "v"}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-full z-10 mt-1 max-h-48 overflow-y-auto border border-hairline bg-canvas shadow-subtle"
        >
          {options.map((option) => (
            <li key={option.value} role="option" aria-selected={option.value === value}>
              <button
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  "block w-full px-2 py-1 text-left hover:bg-surface-soft",
                  option.value === value ? "text-ink" : "text-muted-text"
                )}
              >
                {option.value === value ? `> ${option.label}` : `  ${option.label}`}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
