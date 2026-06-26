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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { mockProjects } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  ChevronUp,
  History,
  LayoutDashboard,
  MessageSquare,
  Unplug,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type FloatingNavProps = {
  projectId?: string;
};

const mainNav = [
  { href: "/dashboard", label: "Dashboard", hint: "Activity trail" },
];

function getProjectNav(projectId: string) {
  return [
    {
      href: `/projects/${projectId}`,
      label: "Overview",
      hint: "Project overview",
      icon: LayoutDashboard,
    },
    {
      href: `/projects/${projectId}/timeline`,
      label: "Timeline",
      hint: "Activity trail",
      icon: History,
    },
    {
      href: `/projects/${projectId}/docs`,
      label: "Docs",
      hint: "Collaborative docs",
      icon: BookOpen,
    },
    {
      href: `/projects/${projectId}/sources`,
      label: "Sources",
      hint: "Integration sources",
      icon: Unplug,
    },
    {
      href: `/projects/${projectId}/ask`,
      label: "Ask",
      hint: "Ask about project memory",
      icon: MessageSquare,
    },
  ];
}

function NavTooltip({
  hint,
  children,
}: {
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="top" sideOffset={10}>
        {hint}
      </TooltipContent>
    </Tooltip>
  );
}

export function FloatingNav({ projectId }: FloatingNavProps) {
  const pathname = usePathname();
  const currentProject = projectId
    ? mockProjects.find((p) => p.id === projectId)
    : mockProjects[0];
  const projectNav = projectId ? getProjectNav(projectId) : [];

  return (
    <TooltipProvider delayDuration={200}>
      <nav
        aria-label="Main navigation"
        className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
      >
        <div className="flex items-center gap-1 rounded-full border border-hairline bg-canvas/95 px-2 py-2 shadow-subtle backdrop-blur-sm">
          <NavTooltip hint="ProgressGoat home">
            <Link
              href="/dashboard"
              aria-label="ProgressGoat home"
              className="flex size-10 items-center justify-center rounded-full"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                PG
              </span>
            </Link>
          </NavTooltip>

          <div className="mx-1 h-6 w-px bg-[var(--color-hairline)]" />

          <DropdownMenu>
            <NavTooltip hint="Switch project">
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 gap-1.5 rounded-full px-3 font-normal hover:bg-surface-card"
                >
                  <span className="max-w-[120px] truncate text-sm font-medium text-ink">
                    {currentProject?.name ?? "Project"}
                  </span>
                  <ChevronUp className="size-3.5 text-muted-soft" />
                </Button>
              </DropdownMenuTrigger>
            </NavTooltip>
            <DropdownMenuContent side="top" align="center" className="mb-2 w-56">
              <DropdownMenuLabel>Switch project</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {mockProjects.map((project) => (
                <DropdownMenuItem key={project.id} asChild>
                  <Link href={`/projects/${project.id}`}>{project.name}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="mx-1 h-6 w-px bg-[var(--color-hairline)]" />

          {mainNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <NavTooltip key={item.href} hint={item.hint}>
                <Link
                  href={item.href}
                  aria-label={item.hint}
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full transition-colors",
                    isActive
                      ? "bg-primary-soft text-primary-active"
                      : "text-muted-text hover:bg-surface-card hover:text-ink"
                  )}
                >
                  <LayoutDashboard className="size-4" />
                </Link>
              </NavTooltip>
            );
          })}

          {projectNav.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href.endsWith("/docs") && pathname.includes("/docs"));
            const Icon = item.icon;
            return (
              <NavTooltip key={item.href} hint={item.hint}>
                <Link
                  href={item.href}
                  aria-label={item.hint}
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full transition-colors",
                    isActive
                      ? "bg-primary-soft text-primary-active"
                      : "text-muted-text hover:bg-surface-card hover:text-ink"
                  )}
                >
                  <Icon className="size-4" />
                </Link>
              </NavTooltip>
            );
          })}
        </div>
      </nav>
    </TooltipProvider>
  );
}
