export type Doc = {
  id: string;
  projectId: string;
  title: string;
  slug: string;
  summary?: string;
  status: "draft" | "published" | "archived";
  updatedAt: string;
  createdAt: string;
  authorName?: string;
};
