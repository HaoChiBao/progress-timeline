import { Sidebar } from "@/components/layout/Sidebar";

type AppShellProps = {
  children: React.ReactNode;
  projectId?: string;
};

export function AppShell({ children, projectId }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar projectId={projectId} />
      <main className="flex min-h-screen flex-1 flex-col">{children}</main>
    </div>
  );
}
