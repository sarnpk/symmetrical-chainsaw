-- Community Moderation Layer
-- Generated: 2025-08-21

-- Roles
create type if not exists public.community_role as enum ('user','moderator','admin');

create table if not exists public.community_roles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  role public.community_role not null default 'user',
  granted_by uuid null references public.profiles(id) on delete set null,
  granted_at timestamptz not null default now()
);

create index if not exists community_roles_role_idx on public.community_roles (role);

-- Helper: is_moderator
create or replace function public.is_moderator(uid uuid)
returns boolean
language sql
stable
as $$
  select exists(
    select 1 from public.community_roles r
    where r.user_id = uid and r.role in ('moderator','admin')
  );
$$;

-- Content status
create type if not exists public.content_status as enum ('active','hidden','removed','locked');

alter table public.community_posts
  add column if not exists status public.content_status not null default 'active',
  add column if not exists moderated_by uuid null references public.profiles(id) on delete set null,
  add column if not exists moderated_at timestamptz null,
  add column if not exists moderation_reason text null;

alter table public.community_comments
  add column if not exists status public.content_status not null default 'active',
  add column if not exists moderated_by uuid null references public.profiles(id) on delete set null,
  add column if not exists moderated_at timestamptz null,
  add column if not exists moderation_reason text null;

create index if not exists community_posts_status_idx on public.community_posts (status);
create index if not exists community_comments_status_idx on public.community_comments (status);

-- Reports
create type if not exists public.report_target as enum ('post','comment','user');
create type if not exists public.report_status as enum ('open','reviewing','resolved','dismissed');

create table if not exists public.community_reports (
  id uuid primary key default gen_random_uuid(),
  target_type public.report_target not null,
  target_id uuid not null,
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reason text not null,
  status public.report_status not null default 'open',
  created_at timestamptz not null default now(),
  handled_by uuid null references public.profiles(id) on delete set null,
  handled_at timestamptz null,
  resolution text null
);

create index if not exists community_reports_target_idx on public.community_reports (target_type, target_id);
create index if not exists community_reports_status_idx on public.community_reports (status, created_at desc);

-- Enable RLS
alter table public.community_roles enable row level security;
alter table public.community_reports enable row level security;

-- Policies
-- Roles: only moderators/admins can read/write (seed via SQL manually for first mod)
create policy if not exists "roles_select_mods" on public.community_roles
for select using (public.is_moderator(auth.uid()));

create policy if not exists "roles_insert_mods" on public.community_roles
for insert with check (public.is_moderator(auth.uid()));

create policy if not exists "roles_update_mods" on public.community_roles
for update using (public.is_moderator(auth.uid()))
with check (public.is_moderator(auth.uid()));

-- Posts visibility and control
drop policy if exists "posts_read_all" on public.community_posts;
create policy "posts_read_active_or_mod" on public.community_posts
for select using (
  status = 'active' or public.is_moderator(auth.uid())
);

drop policy if exists "posts_update_owner" on public.community_posts;
create policy "posts_update_owner_or_mod" on public.community_posts
for update using (
  (author_id = auth.uid() and status not in ('locked','removed'))
  or public.is_moderator(auth.uid())
)
with check (
  (author_id = auth.uid() and status not in ('locked','removed'))
  or public.is_moderator(auth.uid())
);

drop policy if exists "posts_delete_owner" on public.community_posts;
create policy "posts_delete_owner_or_mod" on public.community_posts
for delete using (
  (author_id = auth.uid() and status not in ('locked','removed'))
  or public.is_moderator(auth.uid())
);

-- Comments visibility and control
drop policy if exists "comments_read_all" on public.community_comments;
create policy "comments_read_active_or_mod" on public.community_comments
for select using (
  status = 'active' or public.is_moderator(auth.uid())
);

drop policy if exists "comments_update_owner" on public.community_comments;
create policy "comments_update_owner_or_mod" on public.community_comments
for update using (
  (author_id = auth.uid() and status not in ('locked','removed'))
  or public.is_moderator(auth.uid())
);

drop policy if exists "comments_delete_owner" on public.community_comments;
create policy "comments_delete_owner_or_mod" on public.community_comments
for delete using (
  (author_id = auth.uid() and status not in ('locked','removed'))
  or public.is_moderator(auth.uid())
);

-- Reports policies
create policy if not exists "reports_select_self_or_mod" on public.community_reports
for select using (
  reporter_id = auth.uid() or public.is_moderator(auth.uid())
);

create policy if not exists "reports_insert_auth" on public.community_reports
for insert with check (reporter_id = auth.uid());

create policy if not exists "reports_update_mods" on public.community_reports
for update using (public.is_moderator(auth.uid()))
with check (public.is_moderator(auth.uid()));
