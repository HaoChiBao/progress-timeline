-- ProgressGoat initial database schema
-- Workspaces, projects, docs, events, artifacts, and integrations

-- Extensions
create extension if not exists "pgcrypto";

-- Enums
create type project_status as enum ('active', 'paused', 'archived');
create type doc_status as enum ('draft', 'published', 'archived');
create type event_source as enum ('linear', 'github', 'figma', 'manual', 'ai');
create type ticket_priority as enum ('urgent', 'high', 'medium', 'low', 'none');
create type ticket_status as enum ('backlog', 'todo', 'in_progress', 'in_review', 'done', 'cancelled');
create type integration_provider as enum ('linear', 'github', 'figma');
create type integration_status as enum ('connected', 'disconnected', 'error', 'pending');
create type artifact_type as enum ('pr', 'issue', 'design', 'commit', 'doc', 'other');

-- Workspaces
create table workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Workspace members (links auth.users to workspaces)
create table workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member', 'viewer')),
  created_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

-- Projects
create table projects (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  status project_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, slug)
);

-- Docs (collaborative living documentation)
create table docs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  slug text not null,
  summary text,
  content jsonb,
  status doc_status not null default 'draft',
  author_id uuid references auth.users(id) on delete set null,
  liveblocks_room_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, slug)
);

-- Integrations (Linear, GitHub, Figma connections)
create table integrations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  provider integration_provider not null,
  status integration_status not null default 'pending',
  external_account_id text,
  external_account_name text,
  config jsonb not null default '{}',
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, provider)
);

-- Artifacts (linked PRs, issues, designs, etc.)
create table artifacts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  integration_id uuid references integrations(id) on delete set null,
  title text not null,
  artifact_type artifact_type not null default 'other',
  source event_source not null,
  external_id text,
  external_url text,
  summary text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Project events (activity trail / timeline)
create table project_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  summary text,
  source event_source not null,
  event_type text not null,
  actor_id uuid references auth.users(id) on delete set null,
  actor_name text,
  artifact_id uuid references artifacts(id) on delete set null,
  metadata jsonb not null default '{}',
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Tickets / tasks (synced or manual)
create table tickets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  summary text,
  priority ticket_priority not null default 'none',
  status ticket_status not null default 'backlog',
  source event_source not null default 'manual',
  assignee_id uuid references auth.users(id) on delete set null,
  assignee_name text,
  external_id text,
  integration_id uuid references integrations(id) on delete set null,
  artifact_count integer not null default 0,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes
create index idx_workspace_members_user on workspace_members(user_id);
create index idx_projects_workspace on projects(workspace_id);
create index idx_docs_project on docs(project_id);
create index idx_integrations_project on integrations(project_id);
create index idx_artifacts_project on artifacts(project_id);
create index idx_project_events_project_occurred on project_events(project_id, occurred_at desc);
create index idx_tickets_project on tickets(project_id);
create index idx_tickets_project_status on tickets(project_id, status);

-- Updated_at trigger helper
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger workspaces_updated_at before update on workspaces
  for each row execute function set_updated_at();
create trigger projects_updated_at before update on projects
  for each row execute function set_updated_at();
create trigger docs_updated_at before update on docs
  for each row execute function set_updated_at();
create trigger integrations_updated_at before update on integrations
  for each row execute function set_updated_at();
create trigger artifacts_updated_at before update on artifacts
  for each row execute function set_updated_at();
create trigger tickets_updated_at before update on tickets
  for each row execute function set_updated_at();

-- Row Level Security (enable; policies to be added with auth setup)
alter table workspaces enable row level security;
alter table workspace_members enable row level security;
alter table projects enable row level security;
alter table docs enable row level security;
alter table integrations enable row level security;
alter table artifacts enable row level security;
alter table project_events enable row level security;
alter table tickets enable row level security;

-- Realtime: enable for project_events (activity feed)
alter publication supabase_realtime add table project_events;
