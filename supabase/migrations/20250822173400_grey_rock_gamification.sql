-- Grey Rock Gamification Tables
-- Creates: gr_user_streaks, gr_user_pack_stats, gr_user_achievements

-- Streaks
create table gr_user_streaks (
  user_id uuid primary key,
  current_streak int not null default 0,
  best_streak int not null default 0,
  last_practiced_date date,
  updated_at timestamptz not null default now()
);

alter table gr_user_streaks enable row level security;

create policy "gr_user_streaks_own_row_rw"
  on gr_user_streaks
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Pack stats (denormalized attempts count per pack)
create table gr_user_pack_stats (
  user_id uuid not null,
  pack text not null,
  attempts int not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, pack)
);

alter table gr_user_pack_stats enable row level security;

create policy "gr_user_pack_stats_own_row_rw"
  on gr_user_pack_stats
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Achievements (lightweight)
create table gr_user_achievements (
  user_id uuid not null,
  key text not null,
  achieved_at timestamptz not null default now(),
  primary key (user_id, key)
);

alter table gr_user_achievements enable row level security;

create policy "gr_user_achievements_own_row_rw"
  on gr_user_achievements
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
