export const STORAGE_PREFIX = "pg-daily-log:";

export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function todayKey(): string {
  return formatDateKey(new Date());
}

export function shiftDateKey(key: string, days: number): string {
  const date = parseDateKey(key);
  date.setDate(date.getDate() + days);
  return formatDateKey(date);
}

export function formatDisplayDate(key: string): string {
  return parseDateKey(key).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function hasContent(text: string): boolean {
  return text.trim().length > 0;
}

function isLegacyObject(
  value: unknown,
): value is { plan?: string; done?: string; text?: string } {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return "plan" in value || "done" in value || "text" in value;
}

export function loadEntry(dateKey: string): string {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + dateKey);
    if (!raw) return "";

    // Prefer plain text. Only parse the short-lived { plan, done } format.
    if (raw.startsWith("{")) {
      try {
        const parsed: unknown = JSON.parse(raw);
        if (isLegacyObject(parsed)) {
          if (typeof parsed.text === "string") return parsed.text;
          const plan = typeof parsed.plan === "string" ? parsed.plan.trim() : "";
          const done = typeof parsed.done === "string" ? parsed.done.trim() : "";
          return [plan, done].filter(Boolean).join(" — ");
        }
      } catch {
        // not JSON — fall through
      }
    }

    return raw;
  } catch {
    return "";
  }
}

export function saveEntry(dateKey: string, text: string): void {
  try {
    if (!hasContent(text)) {
      localStorage.removeItem(STORAGE_PREFIX + dateKey);
      return;
    }
    localStorage.setItem(STORAGE_PREFIX + dateKey, text.trim());
  } catch {
    // ignore quota / private mode
  }
}

/** Consecutive days with content, ending at today (or yesterday if today is empty). */
export function computeStreak(today = todayKey()): number {
  let cursor = today;
  let streak = 0;

  if (!hasContent(loadEntry(cursor))) {
    cursor = shiftDateKey(cursor, -1);
  }

  while (hasContent(loadEntry(cursor))) {
    streak += 1;
    cursor = shiftDateKey(cursor, -1);
  }

  return streak;
}

export function exportMarkdown(days = 30): string {
  const end = todayKey();
  const lines: string[] = ["# progressgoat", ""];

  for (let i = days - 1; i >= 0; i -= 1) {
    const key = shiftDateKey(end, -i);
    const text = loadEntry(key);
    if (!hasContent(text)) continue;
    lines.push(`## ${key}`, "", text.trim(), "");
  }

  if (lines.length === 2) {
    lines.push("_No entries yet._", "");
  }

  return lines.join("\n");
}
