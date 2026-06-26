import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import type { TimelineTick } from "@/lib/timeline/event-catalog";

const DATA_DIR = join(process.cwd(), ".data");
const TICKS_FILE = join(DATA_DIR, "timeline-ticks.json");

type TickStore = Record<string, TimelineTick[]>;

function readStore(): TickStore {
  if (!existsSync(TICKS_FILE)) return {};
  try {
    return JSON.parse(readFileSync(TICKS_FILE, "utf8")) as TickStore;
  } catch {
    return {};
  }
}

function writeStore(store: TickStore) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(TICKS_FILE, JSON.stringify(store, null, 2), "utf8");
}

export function appendServerTick(tick: TimelineTick): TimelineTick {
  const store = readStore();
  const existing = store[tick.projectId] ?? [];
  const next = [...existing, tick].sort(
    (a, b) =>
      new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime()
  );
  store[tick.projectId] = next;
  writeStore(store);
  return tick;
}

export function getServerTicks(projectId: string): TimelineTick[] {
  const store = readStore();
  return store[projectId] ?? [];
}
