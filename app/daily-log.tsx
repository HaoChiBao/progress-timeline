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

export function DailyLog() {
  const [dateKey, setDateKey] = useState(todayKey);
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState("");
  const [streak, setStreak] = useState(0);
  const [status, setStatus] = useState<"idle" | "saved" | "copied">("idle");
  const [exported, setExported] = useState(false);

  const isToday = dateKey === todayKey();
  const canGoNext = dateKey < todayKey();
  const dirty = draft.trim() !== saved.trim();

  useEffect(() => {
    const loaded = loadEntry(dateKey);
    setDraft(loaded);
    setSaved(loaded);
    setStreak(computeStreak());
    setStatus("idle");
  }, [dateKey]);

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
        <p className="text-[15px] leading-none tracking-tight lowercase md:text-base">
          progressgoat
        </p>
        <p
          className="text-[15px] leading-none tracking-tight text-black/40 md:text-base"
          title="day streak"
        >
          {status === "saved" ? "saved" : streak > 0 ? streak : ""}
        </p>
      </header>

      <label className="flex flex-1 cursor-text items-center justify-center px-6 py-28">
        <span className="sr-only">Today&apos;s log</span>
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
          placeholder={PLACEHOLDER}
          spellCheck
          autoFocus={isToday}
          className="daily-log-input w-full max-w-4xl bg-transparent text-center text-[clamp(1.75rem,4vw,2.75rem)] font-normal leading-none tracking-tight text-black outline-none placeholder:text-black"
        />
      </label>

      <footer className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-6 px-6 pb-6 text-[13px] tracking-tight text-black/35 md:pb-8">
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
