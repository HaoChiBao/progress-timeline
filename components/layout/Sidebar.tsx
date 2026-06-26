"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockProjects, mockWorkspace } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  ChevronDown,
  History,
  LayoutDashboard,
  MessageSquare,
  Plus,
  Sparkles,
  Unplug,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarProps = {
  projectId?: string;
};

const mainNav = [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }];

function getProjectNav(projectId: string) {
  return [
    { href: `/projects/${projectId}`, label: "Overview", icon: LayoutDashboard },
    { href: `/projects/${projectId}/timeline`, label: "Timeline", icon: History },
    { href: `/projects/${projectId}/docs`, label: "Docs", icon: BookOpen },
    { href: `/projects/${projectId}/sources`, label: "Sources", icon: Unplug },
    { href: `/projects/${projectId}/ask`, label: "Ask", icon: MessageSquare },
  ];
}

export function Sidebar({ projectId }: SidebarProps) {
  const pathname = usePathname();
  const currentProject = projectId
    ? mockProjects.find((p) => p.id === projectId)
    : mockProjects[0];

  const projectNav = projectId ? getProjectNav(projectId) : [];

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-hairline bg-surface-soft">
      <div className="border-b border-hairline px-4 py-5">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-xs font-semibold text-white">
            PG
          </span>
          <span className="font-display text-lg tracking-tight text-ink">
            ProgressGoat
          </span>
        </Link>
        <p className="mt-1 pl-9 text-xs text-muted-soft">{mockWorkspace.name}</p>
      </div>

      <div className="border-b border-hairline px-3 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-auto w-full justify-between px-2 py-2 font-normal hover:bg-surface-card"
            >
              <div className="text-left">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-soft">
                  Project
                </p>
                <p className="text-sm font-medium text-ink">
                  {currentProject?.name ?? "Select project"}
                </p>
              </div>
              <ChevronDown className="size-4 text-muted-soft" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Switch project</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {mockProjects.map((project) => (
              <DropdownMenuItem key={project.id} asChild>
                <Link href={`/projects/${project.id}`}>{project.name}</Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <Plus className="size-4" />
              New project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-soft">
          Workspace
        </p>
        {mainNav.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-soft text-primary-active"
                  : "text-muted-text hover:bg-surface-card hover:text-ink"
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}

        {projectNav.length > 0 && (
          <>
            <p className="mb-2 mt-6 px-2 text-xs font-medium uppercase tracking-wider text-muted-soft">
              Project
            </p>
            {projectNav.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href.endsWith("/docs") && pathname.includes("/docs"));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary-soft text-primary-active"
                      : "text-muted-text hover:bg-surface-card hover:text-ink"
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      <div className="border-t border-hairline p-3">
        <div className="rounded-lg border border-hairline bg-surface-card p-3">
          <div className="flex items-center gap-2 text-sm font-medium text-ink">
            <Sparkles className="size-4 text-primary" />
            Ask ProgressGoat
          </div>
          <p className="mt-1 text-xs text-muted-soft">
            Project memory and summaries coming soon.
          </p>
        </div>
      </div>
    </aside>
  );
}
