export type CustomSource = {
  id: string;
  label: string;
  /** 1–2 character glyph on timeline tiles. */
  character: string;
  color: string;
  types: { id: string; label: string }[];
};

const STORAGE_KEY = "pg-custom-sources";

function slugify(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 28);
}

function uniqueId(base: string, existing: CustomSource[]): string {
  let id = `custom_${base || "source"}`;
  let n = 2;
  while (existing.some((s) => s.id === id)) {
    id = `custom_${base || "source"}_${n}`;
    n++;
  }
  return id;
}

export function loadCustomSources(): CustomSource[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CustomSource[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCustomSources(sources: CustomSource[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sources));
}

export function addCustomSource(input: {
  label: string;
  character: string;
  color: string;
}): CustomSource {
  const existing = loadCustomSources();
  const label = input.label.trim() || "custom";
  const character = (input.character.trim() || "·").slice(0, 2);
  const color = normalizeHex(input.color) || "#6b7280";
  const slug = slugify(label);
  const id = uniqueId(slug, existing);
  const source: CustomSource = {
    id,
    label,
    character,
    color,
    types: [{ id: `${id}.event`, label: `${label} event` }],
  };
  saveCustomSources([...existing, source]);
  return source;
}

export function removeCustomSource(id: string): void {
  const next = loadCustomSources().filter((s) => s.id !== id);
  saveCustomSources(next);
}

function normalizeHex(value: string): string | null {
  const v = value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(v)) return v;
  if (/^[0-9a-fA-F]{6}$/.test(v)) return `#${v}`;
  return null;
}
