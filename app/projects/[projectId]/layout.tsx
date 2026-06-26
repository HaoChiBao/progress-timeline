import { AppShell } from "@/components/layout/AppShell";
import { ProjectHeader } from "@/components/layout/ProjectHeader";
import { getProjectById } from "@/lib/mock-data";
import { notFound } from "next/navigation";

type ProjectLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
};

export default async function ProjectLayout({
  children,
  params,
}: ProjectLayoutProps) {
  const { projectId } = await params;
  const project = getProjectById(projectId);

  if (!project) {
    notFound();
  }

  return (
    <AppShell projectId={projectId}>
      <ProjectHeader project={project} />
      <div className="flex-1 px-8 py-8">{children}</div>
    </AppShell>
  );
}
