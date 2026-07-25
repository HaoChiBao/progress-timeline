import assert from "node:assert/strict";
import {
  computeStreak,
  exportMarkdown,
  formatDateKey,
  hasContent,
  loadEntry,
  saveEntry,
  shiftDateKey,
  todayKey,
  STORAGE_PREFIX,
} from "../lib/daily-log";

const store = new Map<string, string>();

Object.defineProperty(globalThis, "localStorage", {
  value: {
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    setItem(key: string, value: string) {
      store.set(key, String(value));
    },
    removeItem(key: string) {
      store.delete(key);
    },
  },
  configurable: true,
});

assert.equal(formatDateKey(new Date(2026, 6, 24)), "2026-07-24");
assert.equal(shiftDateKey("2026-07-24", -1), "2026-07-23");
assert.equal(shiftDateKey("2026-07-01", -1), "2026-06-30");
assert.match(todayKey(), /^\d{4}-\d{2}-\d{2}$/);

saveEntry("2026-07-24", "  ship the mvp  ");
assert.equal(loadEntry("2026-07-24"), "ship the mvp");
assert.equal(hasContent(loadEntry("2026-07-24")), true);

saveEntry("2026-07-24", "   ");
assert.equal(loadEntry("2026-07-24"), "");

saveEntry("2026-07-24", '{"oops":true}');
assert.equal(loadEntry("2026-07-24"), '{"oops":true}');

saveEntry("2026-07-24", "[1,2,3]");
assert.equal(loadEntry("2026-07-24"), "[1,2,3]");

store.set(
  STORAGE_PREFIX + "2026-07-22",
  JSON.stringify({ plan: "write", done: "shipped" }),
);
assert.equal(loadEntry("2026-07-22"), "write — shipped");

store.clear();
const today = todayKey();
const yesterday = shiftDateKey(today, -1);
const twoAgo = shiftDateKey(today, -2);
saveEntry(twoAgo, "a");
saveEntry(yesterday, "b");
saveEntry(today, "c");
assert.equal(computeStreak(today), 3);

store.clear();
saveEntry(twoAgo, "a");
saveEntry(today, "c");
assert.equal(computeStreak(today), 1);

store.clear();
saveEntry(yesterday, "b");
assert.equal(computeStreak(today), 1);

store.clear();
saveEntry(today, "hello");
const md = exportMarkdown(3);
assert.match(md, /# progressgoat/);
assert.match(md, new RegExp(`## ${today}`));
assert.match(md, /hello/);

console.log("All daily-log checks passed.");
