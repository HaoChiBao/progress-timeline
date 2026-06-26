import type { Doc } from "./types/doc";
import type { ProjectEvent, Ticket } from "./types/event";
import type { Artifact, Integration } from "./types/integration";
import type { ProjectSummary, Workspace } from "./types/project";

export const mockWorkspace: Workspace = {
  id: "ws_01",
  name: "Acme Studio",
  slug: "acme-studio",
  createdAt: "2026-01-15T10:00:00Z",
};

export const mockProjects: ProjectSummary[] = [
  {
    id: "proj_progress_goat",
    workspaceId: "ws_01",
    name: "ProgressGoat",
    slug: "progress-goat",
    description: "Project intelligence dashboard for living documentation.",
    status: "active",
    createdAt: "2026-02-01T09:00:00Z",
    updatedAt: "2026-06-25T18:30:00Z",
    eventCount: 42,
    docCount: 6,
    integrationCount: 2,
  },
  {
    id: "proj_mobile_app",
    workspaceId: "ws_01",
    name: "Mobile App",
    slug: "mobile-app",
    description: "Customer-facing iOS and Android experience.",
    status: "active",
    createdAt: "2026-03-10T14:00:00Z",
    updatedAt: "2026-06-20T11:00:00Z",
    eventCount: 18,
    docCount: 3,
    integrationCount: 1,
  },
  {
    id: "proj_design_system",
    workspaceId: "ws_01",
    name: "Design System",
    slug: "design-system",
    description: "Shared components and tokens.",
    status: "paused",
    createdAt: "2026-04-05T08:00:00Z",
    updatedAt: "2026-05-28T16:00:00Z",
    eventCount: 9,
    docCount: 2,
    integrationCount: 1,
  },
];

export const mockTickets: Ticket[] = [
  {
    id: "tkt_01",
    projectId: "proj_progress_goat",
    title: "Implement workspace and project creation flow",
    summary: "Allow users to create workspaces and projects from the dashboard.",
    priority: "high",
    status: "in_progress",
    source: "linear",
    assignee: "Alex Chen",
    artifactCount: 2,
    externalId: "YAN-77",
    updatedAt: "2026-06-25T16:00:00Z",
  },
  {
    id: "tkt_02",
    projectId: "proj_progress_goat",
    title: "Scaffold collaborative docs editor",
    summary: "Placeholder editor with Liveblocks room wiring.",
    priority: "medium",
    status: "todo",
    source: "linear",
    assignee: "Sam Rivera",
    artifactCount: 0,
    externalId: "YAN-80",
    updatedAt: "2026-06-24T10:00:00Z",
  },
  {
    id: "tkt_03",
    projectId: "proj_progress_goat",
    title: "Fix timeline feed ordering on realtime insert",
    summary: "New events should appear at the top without full refresh.",
    priority: "urgent",
    status: "in_review",
    source: "github",
    assignee: "Jordan Lee",
    artifactCount: 1,
    updatedAt: "2026-06-25T09:30:00Z",
  },
  {
    id: "tkt_04",
    projectId: "proj_progress_goat",
    title: "Update onboarding empty states",
    summary: "Copy and illustration pass for first-run experience.",
    priority: "low",
    status: "backlog",
    source: "figma",
    artifactCount: 3,
    updatedAt: "2026-06-22T14:00:00Z",
  },
  {
    id: "tkt_05",
    projectId: "proj_progress_goat",
    title: "Document decision: moss green as primary accent",
    summary: "Captured from design review — green for action, stone for structure.",
    priority: "none",
    status: "done",
    source: "manual",
    assignee: "You",
    artifactCount: 0,
    updatedAt: "2026-06-21T11:00:00Z",
  },
  {
    id: "tkt_06",
    projectId: "proj_progress_goat",
    title: "Generate weekly project summary",
    summary: "AI draft of activity trail for stakeholder update.",
    priority: "medium",
    status: "todo",
    source: "ai",
    artifactCount: 1,
    updatedAt: "2026-06-25T08:00:00Z",
  },
];

export const mockEvents: ProjectEvent[] = [
  {
    id: "evt_01",
    projectId: "proj_progress_goat",
    title: "Merged PR: Add ticket card components",
    summary: "Dashboard now shows calm project index cards with source badges.",
    source: "github",
    eventType: "pull_request.merged",
    occurredAt: "2026-06-25T17:45:00Z",
    createdAt: "2026-06-25T17:45:00Z",
    actorName: "Jordan Lee",
  },
  {
    id: "evt_02",
    projectId: "proj_progress_goat",
    title: "Linear issue moved to In Progress",
    summary: "YAN-77 — workspace and project creation flow",
    source: "linear",
    eventType: "issue.updated",
    occurredAt: "2026-06-25T16:00:00Z",
    createdAt: "2026-06-25T16:00:00Z",
    actorName: "Alex Chen",
  },
  {
    id: "evt_03",
    projectId: "proj_progress_goat",
    title: "Design file updated",
    summary: "Onboarding empty states — v3 explorations",
    source: "figma",
    eventType: "file.updated",
    occurredAt: "2026-06-24T13:20:00Z",
    createdAt: "2026-06-24T13:20:00Z",
    actorName: "Sam Rivera",
  },
  {
    id: "evt_04",
    projectId: "proj_progress_goat",
    title: "Manual note: API schema review",
    summary: "Confirmed initial tables for workspaces, projects, docs, and events.",
    source: "manual",
    eventType: "note.created",
    occurredAt: "2026-06-23T10:00:00Z",
    createdAt: "2026-06-23T10:00:00Z",
    actorName: "You",
  },
  {
    id: "evt_05",
    projectId: "proj_progress_goat",
    title: "AI summary generated",
    summary: "Weekly activity trail draft ready for review.",
    source: "ai",
    eventType: "summary.generated",
    occurredAt: "2026-06-22T09:00:00Z",
    createdAt: "2026-06-22T09:00:00Z",
  },
];

export const mockDocs: Doc[] = [
  {
    id: "doc_01",
    projectId: "proj_progress_goat",
    title: "Architecture Overview",
    slug: "architecture-overview",
    summary: "High-level system design and integration boundaries.",
    status: "published",
    updatedAt: "2026-06-24T15:00:00Z",
    createdAt: "2026-06-10T10:00:00Z",
    authorName: "Alex Chen",
  },
  {
    id: "doc_02",
    projectId: "proj_progress_goat",
    title: "Decision Log",
    slug: "decision-log",
    summary: "Key product and technical decisions with context.",
    status: "published",
    updatedAt: "2026-06-25T11:00:00Z",
    createdAt: "2026-06-12T10:00:00Z",
    authorName: "You",
  },
  {
    id: "doc_03",
    projectId: "proj_progress_goat",
    title: "Integration Runbook",
    slug: "integration-runbook",
    summary: "How to connect Linear, GitHub, and Figma sources.",
    status: "draft",
    updatedAt: "2026-06-20T09:00:00Z",
    createdAt: "2026-06-18T10:00:00Z",
    authorName: "Sam Rivera",
  },
];

export const mockIntegrations: Integration[] = [
  {
    id: "int_01",
    projectId: "proj_progress_goat",
    provider: "linear",
    status: "pending",
    createdAt: "2026-06-01T10:00:00Z",
  },
  {
    id: "int_02",
    projectId: "proj_progress_goat",
    provider: "github",
    status: "pending",
    createdAt: "2026-06-01T10:00:00Z",
  },
  {
    id: "int_03",
    projectId: "proj_progress_goat",
    provider: "figma",
    status: "disconnected",
    createdAt: "2026-06-01T10:00:00Z",
  },
];

export const mockArtifacts: Artifact[] = [
  {
    id: "art_01",
    projectId: "proj_progress_goat",
    integrationId: "int_02",
    title: "feat: ticket card components",
    artifactType: "pr",
    source: "github",
    externalUrl: "https://github.com/example/progress-goat/pull/12",
    summary: "Adds TicketCard, PriorityPill, and SourceBadge.",
    createdAt: "2026-06-25T17:00:00Z",
  },
  {
    id: "art_02",
    projectId: "proj_progress_goat",
    integrationId: "int_01",
    title: "YAN-85: Design ticket/task card components",
    artifactType: "issue",
    source: "linear",
    summary: "Calm project index cards for the dashboard.",
    createdAt: "2026-06-24T12:00:00Z",
  },
];

export function getProjectById(projectId: string): ProjectSummary | undefined {
  return mockProjects.find((p) => p.id === projectId);
}

export function getTicketsForProject(projectId: string): Ticket[] {
  return mockTickets.filter((t) => t.projectId === projectId);
}

export function getEventsForProject(projectId: string): ProjectEvent[] {
  return mockEvents.filter((e) => e.projectId === projectId);
}

export function getDocsForProject(projectId: string): Doc[] {
  return mockDocs.filter((d) => d.projectId === projectId);
}

export function getIntegrationsForProject(projectId: string): Integration[] {
  return mockIntegrations.filter((i) => i.projectId === projectId);
}
