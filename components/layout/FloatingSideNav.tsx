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
  ChevronRight,
  History,
  LayoutDashboard,
  MessageSquare,
  Unplug,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type FloatingSideNavProps = {
  projectId?: string;
};

function getProjectNav(projectId: string) {
  return [
    {
      href: "/dashboard",
      hint: "Project timeline",
      icon: LayoutDashboard,
    },
    {
      href: `/projects/${projectId}`,
      hint: "Project overview",
      icon: History,
    },
    {
      href: `/projects/${projectId}/docs`,
      hint: "Docs",
      icon: BookOpen,
    },
    {
      href: `/projects/${projectId}/sources`,
      hint: "Sources",
      icon: Unplug,
    },
    {
      href: `/projects/${projectId}/ask`,
      hint: "Ask ProgressGoat",
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
      <TooltipContent side="right" sideOffset={12}>
        {hint}
      </TooltipContent>
    </Tooltip>
  );
}

export function FloatingSideNav({ projectId }: FloatingSideNavProps) {
  const pathname = usePathname();
  const navItems = projectId ? getProjectNav(projectId) : [];

  return (
    <TooltipProvider delayDuration={200}>
      <nav
        aria-label="Main navigation"
        className="fixed left-6 top-1/2 z-50 -translate-y-1/2"
      >
        <div className="flex w-14 flex-col items-center gap-2 rounded-2xl border border-hairline bg-surface-card/95 px-2 py-4 shadow-subtle backdrop-blur-sm">
          <NavTooltip hint="ProgressGoat home">
            <Link
              href="/dashboard"
              aria-label="ProgressGoat home"
              className="flex size-10 items-center justify-center rounded-xl"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-white">
                PG
              </span>
            </Link>
          </NavTooltip>

          <div className="my-1 h-px w-8 bg-[var(--color-hairline)]" />

          {navItems.map((item) => {
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
                    "flex size-10 items-center justify-center rounded-xl transition-colors",
                    isActive
                      ? "bg-primary-soft text-primary-active"
                      : "text-muted-text hover:bg-canvas hover:text-ink"
                  )}
                >
                  <Icon className="size-4" />
                </Link>
              </NavTooltip>
            );
          })}

          <div className="my-1 h-px w-8 bg-[var(--color-hairline)]" />

          <DropdownMenu>
            <NavTooltip hint="Switch project">
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-10 rounded-xl hover:bg-canvas"
                  aria-label="Switch project"
                >
                  <ChevronRight className="size-4 text-muted-soft" />
                </Button>
              </DropdownMenuTrigger>
            </NavTooltip>
            <DropdownMenuContent side="right" align="start" className="ml-2 w-56">
              <DropdownMenuLabel>Switch project</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {mockProjects.map((project) => (
                <DropdownMenuItem key={project.id} asChild>
                  <Link href={`/projects/${project.id}`}>{project.name}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </TooltipProvider>
  );
}
