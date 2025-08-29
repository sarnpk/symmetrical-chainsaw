-- Community MVP schema: posts, comments, likes with RLS
-- Generated: 2025-08-21

-- Posts
create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  content text not null,
  is_anonymous boolean not null default false,
  category text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists community_posts_author_idx on public.community_posts (author_id);
create index if not exists community_posts_created_idx on public.community_posts (created_at desc);

-- Comments
create table if not exists public.community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  parent_comment_id uuid null references public.community_comments(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists community_comments_post_idx on public.community_comments (post_id);
create index if not exists community_comments_author_idx on public.community_comments (author_id);
create index if not exists community_comments_created_idx on public.community_comments (created_at desc);

-- Likes (post-level)
create table if not exists public.community_likes (
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

-- Enable RLS
alter table public.community_posts enable row level security;
alter table public.community_comments enable row level security;
alter table public.community_likes enable row level security;

-- Posts policies
create policy if not exists "posts_read_all" on public.community_posts
for select using (true);

create policy if not exists "posts_insert_auth" on public.community_posts
for insert with check (auth.uid() = author_id);

create policy if not exists "posts_update_owner" on public.community_posts
for update using (auth.uid() = author_id)
with check (auth.uid() = author_id);

create policy if not exists "posts_delete_owner" on public.community_posts
for delete using (auth.uid() = author_id);

-- Comments policies
create policy if not exists "comments_read_all" on public.community_comments
for select using (true);

create policy if not exists "comments_insert_auth" on public.community_comments
for insert with check (auth.uid() = author_id);

create policy if not exists "comments_update_owner" on public.community_comments
for update using (auth.uid() = author_id);

create policy if not exists "comments_delete_owner" on public.community_comments
for delete using (auth.uid() = author_id);

-- Likes policies
create policy if not exists "likes_read_all" on public.community_likes
for select using (true);

create policy if not exists "likes_insert_self" on public.community_likes
for insert with check (auth.uid() = user_id);

create policy if not exists "likes_delete_self" on public.community_likes
for delete using (auth.uid() = user_id);
