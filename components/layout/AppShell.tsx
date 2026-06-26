import { FloatingSideNav } from "@/components/layout/FloatingSideNav";

type AppShellProps = {
  children?: React.ReactNode;
  projectId?: string;
};

export function AppShell({ children, projectId }: AppShellProps) {
  return (
    <div className="relative min-h-screen bg-canvas">
      <FloatingSideNav projectId={projectId} />
      <main className="min-h-screen pl-24 pr-8">{children}</main>
    </div>
  );
}
