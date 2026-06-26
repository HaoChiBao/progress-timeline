export type EventSource = "linear" | "github" | "figma" | "manual" | "ai";

export type ProjectEvent = {
  id: string;
  projectId: string;
  title: string;
  summary?: string;
  source: EventSource;
  eventType: string;
  occurredAt: string;
  /** When the event ended; if omitted, duration runs until the next event. */
  endedAt?: string;
  createdAt: string;
  actorName?: string;
  metadata?: Record<string, unknown>;
};

export type TicketPriority = "urgent" | "high" | "medium" | "low" | "none";

export type TicketStatus =
  | "backlog"
  | "todo"
  | "in_progress"
  | "in_review"
  | "done"
  | "cancelled";

export type Ticket = {
  id: string;
  projectId: string;
  title: string;
  summary?: string;
  priority: TicketPriority;
  status: TicketStatus;
  source: EventSource;
  assignee?: string;
  artifactCount?: number;
  externalId?: string;
  updatedAt: string;
};
