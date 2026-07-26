"use client";

import { useEffect, useState } from "react";
import {
  computeStreak,
  exportMarkdown,
  formatDisplayDate,
  loadEntry,
  saveEntry,
  shiftDateKey,
  todayKey,
} from "@/lib/daily-log";

const PLACEHOLDER = "What have you done today?";
const PLACEHOLDER_COLORS = [
  "#2563eb", // blue
  "#dc2626", // red
  "#16a34a", // green
  "#9333ea", // purple
  "#eab308", // yellow
  "#ea580c", // orange
  "#0891b2", // cyan
  "#db2777", // pink
];

export function DailyLog() {
  const [dateKey, setDateKey] = useState(todayKey);
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState("");
  const [streak, setStreak] = useState(0);
  const [status, setStatus] = useState<"idle" | "saved" | "copied">("idle");
  const [exported, setExported] = useState(false);
  const [colorTick, setColorTick] = useState(0);

  const isToday = dateKey === todayKey();
  const canGoNext = dateKey < todayKey();
  const dirty = draft.trim() !== saved.trim();
  const showPlaceholder = draft.length === 0;

  useEffect(() => {
    const loaded = loadEntry(dateKey);
    setDraft(loaded);
    setSaved(loaded);
    setStreak(computeStreak());
    setStatus("idle");
  }, [dateKey]);

  useEffect(() => {
    if (!showPlaceholder) return;
    const id = window.setInterval(() => {
      setColorTick((tick) => tick + 1);
    }, 40);
    return () => window.clearInterval(id);
  }, [showPlaceholder]);

  function go(days: number) {
    const next = shiftDateKey(dateKey, days);
    if (next > todayKey()) return;
    setDateKey(next);
  }

  function handleSave() {
    const next = draft.trim();
    saveEntry(dateKey, next);
    setDraft(next);
    setSaved(next);
    setStreak(computeStreak());
    setStatus("saved");
    window.setTimeout(() => setStatus("idle"), 1200);
  }

  async function handleExport() {
    const markdown = exportMarkdown();
    try {
      await navigator.clipboard.writeText(markdown);
      setExported(true);
      setStatus("copied");
      window.setTimeout(() => {
        setExported(false);
        setStatus("idle");
      }, 1500);
    } catch {
      const blob = new Blob([markdown], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "progressgoat.md";
      link.click();
      URL.revokeObjectURL(url);
    }
  }

  return (
    <div className="relative flex min-h-dvh w-full flex-col">
      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between px-6 pt-5 md:px-8 md:pt-6">
        <p className="text-[17px] leading-none tracking-tight lowercase md:text-lg">
          progressgoat
        </p>
        <p
          className="text-[17px] leading-none tracking-tight text-black/40 md:text-lg"
          title="day streak"
        >
          {status === "saved" ? "saved" : streak > 0 ? streak : ""}
        </p>
      </header>

      <label className="flex flex-1 cursor-text items-center justify-center px-6 py-28">
        <span className="sr-only">Today&apos;s log</span>
        <span className="relative w-full max-w-4xl">
          {showPlaceholder ? (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 flex items-center justify-center text-[clamp(1.75rem,4vw,2.75rem)] font-normal leading-none tracking-tight uppercase"
            >
              {PLACEHOLDER.split("").map((char, index) => (
                <span
                  key={`${char}-${index}`}
                  style={{
                    color:
                      PLACEHOLDER_COLORS[
                        (index + colorTick) % PLACEHOLDER_COLORS.length
                      ],
                  }}
                >
                  {char === " " ? "\u00a0" : char}
                </span>
              ))}
            </span>
          ) : null}
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSave();
              }
            }}
            spellCheck
            autoFocus={isToday}
            className={`daily-log-input relative w-full bg-transparent text-center text-[clamp(1.75rem,4vw,2.75rem)] font-normal leading-none tracking-tight text-black outline-none ${showPlaceholder ? "caret-transparent" : ""}`}
          />
        </span>
      </label>

      <footer className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-6 px-6 pb-6 text-[15px] tracking-tight text-black/35 md:pb-8">
        <button
          type="button"
          onClick={() => go(-1)}
          className="bg-transparent p-1 text-inherit outline-none transition-colors hover:text-black"
          aria-label="Previous day"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => setDateKey(todayKey())}
          className="min-w-16 bg-transparent text-inherit outline-none transition-colors hover:text-black"
        >
          {isToday ? "today" : formatDisplayDate(dateKey)}
          {dirty ? " ·" : ""}
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={!canGoNext}
          className="bg-transparent p-1 text-inherit outline-none transition-colors hover:text-black disabled:cursor-default disabled:opacity-20"
          aria-label="Next day"
        >
          →
        </button>
        <button
          type="button"
          onClick={handleExport}
          className="absolute right-6 bg-transparent text-inherit outline-none transition-colors hover:text-black md:right-8"
        >
          {exported ? "copied" : "export"}
        </button>
      </footer>
    </div>
  );
}
