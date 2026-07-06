"use client";

import { AllTimelinesView } from "@/components/dashboard/AllTimelinesView";
import { AsciiTimeline } from "@/components/dashboard/AsciiTimeline";
import {
  DEFAULT_FILTERS,
  TimelineDock,
  type TimelineVisualMode,
} from "@/components/dashboard/TimelineDock";
import { SourcesStrip } from "@/components/dashboard/SourcesStrip";
import { TimelineLeftPanel } from "@/components/dashboard/TimelineLeftPanel";
import { TimelineListView } from "@/components/dashboard/TimelineListView";
import {
  defaultEventType,
} from "@/lib/timeline/source-registry";
import { applyLinkToDraft, parseTimelineLink } from "@/lib/timeline/link-parser";
import {
  archiveProject,
  createProject,
  getProjectById,
  isProjectArchived,
  loadActiveProjectId,
  loadProjects,
  resolveActiveProjectId,
  saveActiveProjectId,
  unarchiveProject,
} from "@/lib/timeline/project-storage";
import { filterTicks, type TimelineFilterState } from "@/lib/timeline/tick-filters";
import {
  addTick,
  clearDraft,
  emptyDraft,
  isLocalTickId,
  loadDraft,
  loadLastTickPrefs,
  loadTicks,
  removeTick,
  saveDraft,
  type TickDraft,
} from "@/lib/timeline/timeline-storage";
import {
  fetchServerTicks,
  mergeTicks,
} from "@/lib/timeline/merge-ticks";
import { buildWeekSummary } from "@/lib/timeline/week-summary";
import { useCallback, useEffect, useMemo, useState } from "react";

const VIEW_MODE_KEY = "pg-timeline-view-mode";
const VISUAL_MODE_KEY = "pg-timeline-visual-mode";
const FILTERS_KEY = "pg-timeline-filters";

const VISUAL_CYCLE: TimelineVisualMode[] = [
  "reveal",
  "bars",
  "letters",
  "list",
];

function parseStoredVisualMode(raw: string | null): TimelineVisualMode {
  if (raw === "list" || raw === "bars" || raw === "letters" || raw === "reveal") {
    return raw;
  }
  if (raw === "ascii") return "reveal";
  return "reveal";
}

function datetimeLocalToIso(value: string): string | undefined {
  if (!value.trim()) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

export function TimelineDashboard() {
  const [projects, setProjects] = useState<ReturnType<typeof loadProjects>>([]);
  const [activeProjectId, setActiveProjectId] = useState("");
  const [viewMode, setViewMode] = useState<"single" | "all">("single");
  const [visualMode, setVisualMode] = useState<TimelineVisualMode>("reveal");
  const [filters, setFilters] = useState<TimelineFilterState>(DEFAULT_FILTERS);
  const [ticksByProject, setTicksByProject] = useState<
    Record<string, ReturnType<typeof loadTicks>>
  >({});
  const [ticks, setTicks] = useState<ReturnType<typeof loadTicks>>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState<TickDraft>(emptyDraft());
  const [externalUrl, setExternalUrl] = useState("");
  const [undo, setUndo] = useState<{ tickId: string; projectId: string } | null>(
    null
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [exportStatus, setExportStatus] = useState<string | null>(null);
  const [hasLastPrefs, setHasLastPrefs] = useState(false);
  const [selectedTickId, setSelectedTickId] = useState<string | null>(null);
  const [selectedTickProjectId, setSelectedTickProjectId] = useState<
    string | null
  >(null);
  const [isAddingSource, setIsAddingSource] = useState(false);
  const [sourcesRefreshKey, setSourcesRefreshKey] = useState(0);

  const activeProject = getProjectById(activeProjectId, projects);
  const isArchived = activeProject ? isProjectArchived(activeProject) : false;

  const filteredTicks = useMemo(
    () => filterTicks(ticks, filters),
    [ticks, filters]
  );

  const selectedTick = useMemo(() => {
    if (!selectedTickId || !selectedTickProjectId) return null;
    const projectTicks =
      ticksByProject[selectedTickProjectId] ??
      (selectedTickProjectId === activeProjectId ? ticks : []);
    return projectTicks.find((t) => t.id === selectedTickId) ?? null;
  }, [
    selectedTickId,
    selectedTickProjectId,
    ticksByProject,
    activeProjectId,
    ticks,
  ]);

  const selectedProjectName = useMemo(() => {
    if (!selectedTickProjectId) return activeProject?.name ?? "";
    return getProjectById(selectedTickProjectId, projects)?.name ?? "";
  }, [selectedTickProjectId, projects, activeProject]);

  const handleCloseTickDetail = useCallback(() => {
    setSelectedTickId(null);
    setSelectedTickProjectId(null);
  }, []);

  const handleSelectTick = useCallback(
    (projectId: string, tickId: string) => {
      if (
        selectedTickId === tickId &&
        selectedTickProjectId === projectId
      ) {
        handleCloseTickDetail();
        return;
      }
      setIsAdding(false);
      setSelectedTickProjectId(projectId);
      setSelectedTickId(tickId);
    },
    [selectedTickId, selectedTickProjectId, handleCloseTickDetail]
  );

  const filteredByProject = useMemo(() => {
    return Object.fromEntries(
      Object.entries(ticksByProject).map(([id, projectTicks]) => [
        id,
        filterTicks(projectTicks, filters),
      ])
    );
  }, [ticksByProject, filters]);

  const syncProjects = useCallback((nextProjects: ReturnType<typeof loadProjects>) => {
    setProjects(nextProjects);
    return nextProjects;
  }, []);

  const refreshTicks = useCallback(async () => {
    if (projects.length === 0) return;
    const serverByProject: Record<string, ReturnType<typeof loadTicks>> = {};
    for (const project of projects) {
      const local = loadTicks(project.id);
      const server = await fetchServerTicks(project.id);
      serverByProject[project.id] = mergeTicks(local, server);
    }
    setTicksByProject(serverByProject);
    if (activeProjectId) {
      const local = loadTicks(activeProjectId);
      const server = await fetchServerTicks(activeProjectId);
      setTicks(mergeTicks(local, server));
    }
  }, [projects, activeProjectId]);

  const handleExportWeek = useCallback(async () => {
    if (!activeProject) return;
    const summary = buildWeekSummary(ticks, activeProject.name);
    try {
      await navigator.clipboard.writeText(summary);
      setExportStatus("copied week summary to clipboard");
    } catch {
      setExportStatus("copy failed — check browser permissions");
    }
    setTimeout(() => setExportStatus(null), 3000);
  }, [activeProject, ticks]);

  const handleUndo = useCallback(async () => {
    if (!undo) return;
    if (!isLocalTickId(undo.tickId)) {
      setStatusMessage("cannot undo synced ticks");
      setUndo(null);
      return;
    }
    const removed = removeTick(undo.projectId, undo.tickId);
    setUndo(null);
    if (removed) {
      setStatusMessage("undid last tick");
      await refreshTicks();
    }
  }, [undo, refreshTicks]);

  useEffect(() => {
    const loadedProjects = loadProjects();
    const activeId = resolveActiveProjectId(
      loadedProjects,
      loadActiveProjectId()
    );
    const savedView =
      typeof window !== "undefined"
        ? (localStorage.getItem(VIEW_MODE_KEY) as "single" | "all" | null)
        : null;
    const savedVisual =
      typeof window !== "undefined"
        ? parseStoredVisualMode(localStorage.getItem(VISUAL_MODE_KEY))
        : "reveal";
    let savedFilters = DEFAULT_FILTERS;
    try {
      const raw = localStorage.getItem(FILTERS_KEY);
      if (raw) savedFilters = { ...DEFAULT_FILTERS, ...JSON.parse(raw) };
    } catch {
      /* ignore */
    }

    setProjects(loadedProjects);
    setActiveProjectId(activeId);
    setViewMode(savedView === "all" ? "all" : "single");
    setVisualMode(savedVisual);
    setFilters(savedFilters);
    setHasLastPrefs(Boolean(loadLastTickPrefs()));
    saveActiveProjectId(activeId);
  }, []);

  useEffect(() => {
    if (!activeProjectId) return;
    void refreshTicks();
    setIsAdding(false);
  }, [activeProjectId, refreshTicks]);

  useEffect(() => {
    if (projects.length > 0) void refreshTicks();
  }, [projects, refreshTicks]);

  useEffect(() => {
    const interval = setInterval(() => void refreshTicks(), 15_000);
    return () => clearInterval(interval);
  }, [refreshTicks]);

  useEffect(() => {
    if (!undo) return;
    const timer = setTimeout(() => setUndo(null), 30_000);
    return () => clearTimeout(timer);
  }, [undo]);

  useEffect(() => {
    if (!isAdding || !activeProjectId) return;
    saveDraft(activeProjectId, { ...draft, externalUrl });
  }, [isAdding, activeProjectId, draft, externalUrl]);

  useEffect(() => {
    localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
  }, [filters]);

  const openAddForm = useCallback(
    (projectId?: string) => {
      handleCloseTickDetail();
      setIsAddingSource(false);
      const id = projectId ?? activeProjectId;
      if (projectId) {
        setActiveProjectId(projectId);
        saveActiveProjectId(projectId);
      }
      const saved = loadDraft(id) ?? emptyDraft();
      setDraft(saved);
      setExternalUrl(saved.externalUrl ?? "");
      setIsAdding(true);
      setStatusMessage(null);
    },
    [activeProjectId, handleCloseTickDetail]
  );

  const closeAddForm = useCallback(() => {
    if (activeProjectId) saveDraft(activeProjectId, { ...draft, externalUrl });
    setIsAdding(false);
    setStatusMessage(null);
  }, [activeProjectId, draft, externalUrl]);

  const cycleVisualMode = useCallback(() => {
    setVisualMode((current) => {
      const idx = VISUAL_CYCLE.indexOf(current);
      const next = VISUAL_CYCLE[(idx + 1) % VISUAL_CYCLE.length];
      localStorage.setItem(VISUAL_MODE_KEY, next);
      return next;
    });
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      const inField =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        (e.target as HTMLElement)?.isContentEditable;

      if (e.key === "Escape") {
        if (isAddingSource) {
          setIsAddingSource(false);
          e.preventDefault();
        } else if (selectedTick) {
          handleCloseTickDetail();
          e.preventDefault();
        } else if (isAdding) {
          closeAddForm();
          e.preventDefault();
        }
        return;
      }

      if (inField) {
        if ((e.metaKey || e.ctrlKey) && e.key === "z" && undo) {
          void handleUndo();
          e.preventDefault();
        }
        return;
      }

      if (e.key === "n" && !isArchived) {
        openAddForm();
        e.preventDefault();
      }
      if (e.key === "l") {
        cycleVisualMode();
        e.preventDefault();
      }
      if (e.key === "e") {
        void handleExportWeek();
        e.preventDefault();
      }
      if (e.key === "z" && undo) {
        void handleUndo();
        e.preventDefault();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    isAdding,
    isAddingSource,
    isArchived,
    undo,
    selectedTick,
    closeAddForm,
    openAddForm,
    cycleVisualMode,
    handleExportWeek,
    handleUndo,
    handleCloseTickDetail,
  ]);

  const openAddSourceForm = useCallback(() => {
    handleCloseTickDetail();
    setIsAdding(false);
    setIsAddingSource(true);
  }, [handleCloseTickDetail]);

  const closeAddSourceForm = useCallback(() => {
    setIsAddingSource(false);
  }, []);

  const handleSourceAdded = useCallback(() => {
    setSourcesRefreshKey((k) => k + 1);
    setIsAddingSource(false);
  }, []);

  const handleSourceChange = (next: string) => {
    setDraft((d) => ({
      ...d,
      source: next,
      eventType: defaultEventType(next),
    }));
  };

  const handleNotePaste = (text: string) => {
    const applied = applyLinkToDraft(text, {
      source: draft.source,
      eventType: draft.eventType,
      note: draft.note,
    });
    setDraft((d) => ({
      ...d,
      source: applied.source,
      eventType: applied.eventType,
      note: applied.note,
    }));
    if (applied.externalUrl) {
      setExternalUrl(applied.externalUrl);
      setStatusMessage("link parsed — source and type updated");
    }
  };

  const handleNoteChange = (note: string) => {
    setDraft((d) => ({ ...d, note }));
    const parsed = parseTimelineLink(note);
    if (parsed && !externalUrl) {
      setExternalUrl(parsed.externalUrl);
    }
  };

  const handleRepeatLast = () => {
    const last = loadLastTickPrefs();
    if (!last) return;
    setDraft((d) => ({
      ...d,
      source: last.source,
      eventType: last.eventType,
    }));
    setStatusMessage("filled from last tick");
  };

  const handleAdd = async () => {
    if (!activeProjectId || isArchived) return;

    let note = draft.note.trim();
    let url = externalUrl.trim();
    const parsed = parseTimelineLink(note);
    if (parsed) {
      url = parsed.externalUrl;
      if (!note || note === url) note = parsed.note;
    }

    const tick = addTick(activeProjectId, {
      source: draft.source,
      eventType: draft.eventType,
      note,
      tags: draft.tags,
      occurredAt: datetimeLocalToIso(draft.occurredAt),
      externalUrl: url || undefined,
    });

    setDraft(emptyDraft());
    setExternalUrl("");
    clearDraft(activeProjectId);
    setHasLastPrefs(true);
    setUndo({ tickId: tick.id, projectId: activeProjectId });
    setStatusMessage("tick added — press z to undo (30s)");
    await refreshTicks();
    setIsAdding(false);
  };

  const handleVisualModeChange = (mode: TimelineVisualMode) => {
    setVisualMode(mode);
    localStorage.setItem(VISUAL_MODE_KEY, mode);
  };

  const handleViewModeChange = (mode: "single" | "all") => {
    setViewMode(mode);
    localStorage.setItem(VIEW_MODE_KEY, mode);
    handleCloseTickDetail();
  };

  const handleSelectProject = (projectId: string) => {
    setActiveProjectId(projectId);
    saveActiveProjectId(projectId);
    handleCloseTickDetail();
  };

  const handleStartAdd = (projectId?: string) => {
    if (projectId) {
      const p = getProjectById(projectId, projects);
      if (p && isProjectArchived(p)) return;
    }
    openAddForm(projectId);
  };

  const handleCreateProject = async (name: string) => {
    const project = createProject(name);
    syncProjects(loadProjects());
    setActiveProjectId(project.id);
    saveActiveProjectId(project.id);
    await refreshTicks();
  };

  const handleArchive = async (projectId: string) => {
    const nextProjects = syncProjects(archiveProject(projectId));
    const nextActiveId = resolveActiveProjectId(nextProjects, activeProjectId);
    setActiveProjectId(nextActiveId);
    saveActiveProjectId(nextActiveId);
    await refreshTicks();
  };

  const handleRestore = async (projectId: string) => {
    syncProjects(unarchiveProject(projectId));
    setActiveProjectId(projectId);
    saveActiveProjectId(projectId);
    await refreshTicks();
  };

  if (!activeProject) {
    return (
      <div className="flex h-full items-center justify-center text-muted-soft">
        loading…
      </div>
    );
  }

  return (
    <div className="relative h-full w-full font-mono text-sm">
      <TimelineLeftPanel
        projects={projects}
        activeProjectId={activeProjectId}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onSelectProject={handleSelectProject}
        onCreateProject={handleCreateProject}
        onArchive={handleArchive}
        onRestore={handleRestore}
        selectedTick={selectedTick}
        selectedProjectName={selectedProjectName}
        onCloseTick={handleCloseTickDetail}
        isAdding={isAdding}
        isAddingSource={isAddingSource}
        isArchived={isArchived}
        draft={draft}
        sourcesRefreshKey={sourcesRefreshKey}
        onSourceChange={handleSourceChange}
        onEventTypeChange={(eventType) =>
          setDraft((d) => ({ ...d, eventType }))
        }
        onNoteChange={handleNoteChange}
        onTagsChange={(tags) => setDraft((d) => ({ ...d, tags }))}
        onOccurredAtChange={(occurredAt) =>
          setDraft((d) => ({ ...d, occurredAt }))
        }
        onAdd={handleAdd}
        onCancelAdd={closeAddForm}
        onCancelAddSource={closeAddSourceForm}
        onSourceAdded={handleSourceAdded}
        onRepeatLast={handleRepeatLast}
        hasLastPrefs={hasLastPrefs}
        statusMessage={statusMessage}
        onNotePaste={handleNotePaste}
        undo={undo}
        onUndo={() => void handleUndo()}
      />

      <aside className="fixed bottom-24 left-4 z-10 sm:block lg:left-6">
        <SourcesStrip
          refreshKey={sourcesRefreshKey}
          onAddSource={openAddSourceForm}
        />
      </aside>

      <div
        className={
          viewMode === "all"
            ? "flex h-full w-full items-start justify-center overflow-y-auto px-4 pb-32 pt-8 sm:pl-[calc(13rem+1.5rem)] sm:pr-[calc(13rem+1.5rem)] lg:pl-[calc(14rem+1.5rem)] lg:pr-[calc(14rem+1.5rem)]"
            : "flex h-full w-full items-center justify-center overflow-hidden px-4 pb-32 pt-8 sm:pl-[calc(13rem+1.5rem)] sm:pr-[calc(13rem+1.5rem)] lg:pl-[calc(14rem+1.5rem)] lg:pr-[calc(14rem+1.5rem)]"
        }
      >
        {viewMode === "all" ? (
          <AllTimelinesView
            projects={projects}
            ticksByProject={filteredByProject}
            activeProjectId={activeProjectId}
            visualMode={visualMode}
            selectedTickId={selectedTickId}
            onSelectProject={handleSelectProject}
            onStartAdd={handleStartAdd}
            onSelectTick={handleSelectTick}
          />
        ) : visualMode === "list" ? (
          <TimelineListView
            ticks={filteredTicks}
            projectName={activeProject.name}
            selectedTickId={selectedTickId}
            onSelectTick={(tickId) =>
              handleSelectTick(activeProjectId, tickId)
            }
          />
        ) : (
          <div className="flex w-full max-w-[min(100%,56rem)] flex-col items-center mx-auto">
            <AsciiTimeline
              ticks={filteredTicks}
              projectName={activeProject.name}
              visualMode={visualMode}
              onStartAdd={() => handleStartAdd()}
              selectedTickId={selectedTickId}
              onSelectTick={(tickId) =>
                handleSelectTick(activeProjectId, tickId)
              }
              allowAdd={!isArchived}
              isActive
              centered
              hideProjectHeader
            />
            {isArchived && (
              <p className="mt-3 text-xs text-muted-soft">archived — view only</p>
            )}
            {filteredTicks.length === 0 && ticks.length > 0 && (
              <p className="mt-3 text-xs text-muted-soft" role="status">
                no ticks match filters — open [ ··· ] in the dock below
              </p>
            )}
          </div>
        )}
      </div>

      <TimelineDock
        visualMode={visualMode}
        filters={filters}
        onVisualModeChange={handleVisualModeChange}
        onFiltersChange={setFilters}
        onExportWeek={() => void handleExportWeek()}
        exportStatus={exportStatus}
      />
    </div>
  );
}
