const HASHTAG_RE = /#([a-zA-Z][a-zA-Z0-9_-]*)/g;

/** Extract hashtags from note text. */
export function extractTagsFromNote(note: string): string[] {
  const tags = new Set<string>();
  for (const match of note.matchAll(HASHTAG_RE)) {
    tags.add(match[1].toLowerCase());
  }
  return [...tags];
}

/** Merge explicit tags with hashtags parsed from the note. */
export function mergeTags(note: string, explicit?: string): string[] {
  const fromNote = extractTagsFromNote(note);
  const fromField = (explicit ?? "")
    .split(/[,\s]+/)
    .map((t) => t.replace(/^#/, "").trim().toLowerCase())
    .filter(Boolean);
  return [...new Set([...fromNote, ...fromField])];
}

/** Suggest smart tags from note wording. */
export function suggestSmartTags(note: string): string[] {
  const lower = note.toLowerCase();
  const suggested: string[] = [];
  if (/blocked|waiting on|stuck/.test(lower)) suggested.push("blocked");
  if (/decided|decision|agreed/.test(lower)) suggested.push("decision");
  if (/shipped|deployed|released|launched/.test(lower)) suggested.push("shipped");
  if (/bug|fix|broken/.test(lower)) suggested.push("bug");
  return suggested;
}
