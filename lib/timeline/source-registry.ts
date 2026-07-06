import {
  SOURCE_PREFIX,
  TIMELINE_SOURCES,
  type TimelineSource as BuiltInSource,
  type TimelineSourceMeta,
} from "@/lib/timeline/event-catalog";
import {
  loadCustomSources,
  type CustomSource,
} from "@/lib/timeline/custom-sources-storage";

/** Built-in or user-defined source id (`custom_*`). */
export type TimelineSource = BuiltInSource | string;

export type SourceDefinition = {
  id: string;
  label: string;
  color: string;
  character: string;
  types: { id: string; label: string }[];
  builtIn: boolean;
};

function builtInDefinitions(): SourceDefinition[] {
  return (Object.keys(TIMELINE_SOURCES) as BuiltInSource[]).map((id) => ({
    id,
    label: TIMELINE_SOURCES[id].label,
    color: TIMELINE_SOURCES[id].color,
    character: SOURCE_PREFIX[id],
    types: TIMELINE_SOURCES[id].types,
    builtIn: true,
  }));
}

function customToDefinition(c: CustomSource): SourceDefinition {
  return {
    id: c.id,
    label: c.label,
    color: c.color,
    character: c.character,
    types: c.types,
    builtIn: false,
  };
}

export function listAllSources(): SourceDefinition[] {
  return [...builtInDefinitions(), ...loadCustomSources().map(customToDefinition)];
}

export function getSourceDefinition(sourceId: string): SourceDefinition | null {
  if (sourceId in TIMELINE_SOURCES) {
    const id = sourceId as BuiltInSource;
    return {
      id,
      label: TIMELINE_SOURCES[id].label,
      color: TIMELINE_SOURCES[id].color,
      character: SOURCE_PREFIX[id],
      types: TIMELINE_SOURCES[id].types,
      builtIn: true,
    };
  }
  const custom = loadCustomSources().find((s) => s.id === sourceId);
  return custom ? customToDefinition(custom) : null;
}

function fallbackDefinition(): SourceDefinition {
  return {
    id: "general",
    label: "general",
    color: TIMELINE_SOURCES.general.color,
    character: SOURCE_PREFIX.general,
    types: TIMELINE_SOURCES.general.types,
    builtIn: true,
  };
}

export function resolveSource(sourceId: string): SourceDefinition {
  return getSourceDefinition(sourceId) ?? fallbackDefinition();
}

export function getSourceColor(sourceId: string): string {
  return resolveSource(sourceId).color;
}

export function getSourcePrefix(sourceId: string): string {
  return resolveSource(sourceId).character;
}

export function getEventTypeLabel(
  sourceId: string,
  eventType: string
): string {
  const def = resolveSource(sourceId);
  const t = def.types.find((x) => x.id === eventType);
  return t?.label ?? eventType;
}

export function defaultEventType(sourceId: string): string {
  const def = resolveSource(sourceId);
  return def.types[0]?.id ?? `${sourceId}.event`;
}

export function isBuiltInSource(sourceId: string): sourceId is BuiltInSource {
  return sourceId in TIMELINE_SOURCES;
}

export function tickAriaLabel(tick: {
  source: string;
  eventType: string;
  occurredAt: string;
  note?: string;
  tags?: string[];
}): string {
  const def = resolveSource(tick.source);
  const parts = [
    def.label,
    getEventTypeLabel(tick.source, tick.eventType),
    new Date(tick.occurredAt).toLocaleString(),
    tick.note,
    tick.tags?.length ? `tags: ${tick.tags.join(", ")}` : undefined,
  ].filter(Boolean);
  return parts.join(", ");
}

/** @deprecated use listAllSources */
export const TIMELINE_SOURCE_LIST: TimelineSourceMeta[] = Object.values(
  TIMELINE_SOURCES
);
