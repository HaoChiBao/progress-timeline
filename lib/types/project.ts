export type Workspace = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
};

export type Project = {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  description?: string;
  status: "active" | "paused" | "archived";
  createdAt: string;
  updatedAt: string;
};

export type ProjectSummary = Project & {
  eventCount: number;
  docCount: number;
  integrationCount: number;
};
