import {
  defaultEventType,
  type TimelineSource,
} from "@/lib/timeline/event-catalog";

export type ParsedTimelineLink = {
  source: TimelineSource;
  eventType: string;
  note: string;
  externalUrl: string;
};

function firstUrl(text: string): string | null {
  const match = text.match(/https?:\/\/[^\s)]+/);
  return match?.[0] ?? null;
}

export function parseTimelineLink(input: string): ParsedTimelineLink | null {
  const url = firstUrl(input.trim());
  if (!url) return null;

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("linear.app")) {
      const issueMatch = parsed.pathname.match(/\/issue\/([^/]+)(?:\/([^/?#]+))?/);
      const identifier = issueMatch?.[1] ?? "";
      const slug = issueMatch?.[2]?.replace(/-/g, " ");
      const note = [identifier, slug].filter(Boolean).join(": ");
      return {
        source: "linear",
        eventType: "linear.ticket_updated",
        note: note || url,
        externalUrl: url,
      };
    }

    if (parsed.hostname.includes("github.com")) {
      const parts = parsed.pathname.split("/").filter(Boolean);
      if (parts.length >= 4 && parts[2] === "pull") {
        return {
          source: "github",
          eventType: "github.pr_opened",
          note: `${parts[0]}/${parts[1]} PR #${parts[3]}`,
          externalUrl: url,
        };
      }
      if (parts.length >= 4 && parts[2] === "issues") {
        return {
          source: "github",
          eventType: "github.commit",
          note: `${parts[0]}/${parts[1]} issue #${parts[3]}`,
          externalUrl: url,
        };
      }
      if (parts.length >= 2) {
        return {
          source: "github",
          eventType: "github.push",
          note: `${parts[0]}/${parts[1]}`,
          externalUrl: url,
        };
      }
    }

    if (parsed.hostname.includes("notion.so") || parsed.hostname.includes("notion.com")) {
      return {
        source: "notion",
        eventType: "notion.page_updated",
        note: "Notion page",
        externalUrl: url,
      };
    }

    if (parsed.hostname.includes("figma.com")) {
      return {
        source: "figma",
        eventType: "figma.file_updated",
        note: "Figma file",
        externalUrl: url,
      };
    }
  } catch {
    return null;
  }

  return null;
}

/** Apply parsed link fields when user pastes a URL into the note field. */
export function applyLinkToDraft(
  text: string,
  current: { source: TimelineSource; eventType: string; note: string }
): {
  source: TimelineSource;
  eventType: string;
  note: string;
  externalUrl?: string;
} {
  const parsed = parseTimelineLink(text);
  if (!parsed) return { ...current };

  return {
    source: parsed.source,
    eventType: parsed.eventType,
    note: parsed.note || current.note,
    externalUrl: parsed.externalUrl,
  };
}

export function defaultLinkEventType(source: TimelineSource): string {
  return defaultEventType(source);
}
