export type IntegrationProvider = "linear" | "github" | "figma";

export type IntegrationStatus = "connected" | "disconnected" | "error" | "pending";

export type Integration = {
  id: string;
  projectId: string;
  provider: IntegrationProvider;
  status: IntegrationStatus;
  externalAccountName?: string;
  lastSyncedAt?: string;
  createdAt: string;
};

export type Artifact = {
  id: string;
  projectId: string;
  integrationId?: string;
  title: string;
  artifactType: "pr" | "issue" | "design" | "commit" | "doc" | "other";
  source: IntegrationProvider | "manual";
  externalUrl?: string;
  summary?: string;
  createdAt: string;
};
