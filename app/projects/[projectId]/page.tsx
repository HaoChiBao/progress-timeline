import { ProjectOverview } from "@/components/dashboard/ProjectOverview";
import { getProjectById } from "@/lib/mock-data";
import { notFound } from "next/navigation";

type ProjectPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;
  const project = getProjectById(projectId);

  if (!project) {
    notFound();
  }

  return <ProjectOverview project={project} />;
}
