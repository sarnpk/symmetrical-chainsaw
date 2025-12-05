-- Community Chat Feature - Direct Messages Only (MVP)
-- Restricted DMs with mutual interaction requirement

-- Conversations (direct messages between two users)
create table if not exists public.community_conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Conversation participants
create table if not exists public.community_conversation_participants (
  conversation_id uuid not null references public.community_conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  last_read_at timestamptz null,
  primary key (conversation_id, user_id)
);

create index if not exists conversation_participants_user_idx on public.community_conversation_participants (user_id);

-- Messages
create table if not exists public.community_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.community_conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  edited_at timestamptz null,
  is_flagged boolean not null default false
);

create index if not exists messages_conversation_idx on public.community_messages (conversation_id, created_at desc);
create index if not exists messages_sender_idx on public.community_messages (sender_id);

-- User blocks
create table if not exists public.community_blocks (
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id)
);

create index if not exists blocks_blocker_idx on public.community_blocks (blocker_id);
create index if not exists blocks_blocked_idx on public.community_blocks (blocked_id);

-- Enable RLS
alter table public.community_conversations enable row level security;
alter table public.community_conversation_participants enable row level security;
alter table public.community_messages enable row level security;
alter table public.community_blocks enable row level security;

-- Blocks policies
create policy "blocks_select_own" on public.community_blocks
for select using (blocker_id = auth.uid());

create policy "blocks_insert_own" on public.community_blocks
for insert with check (blocker_id = auth.uid());

create policy "blocks_delete_own" on public.community_blocks
for delete using (blocker_id = auth.uid());

-- Conversations policies
create policy "conversations_select_participant" on public.community_conversations
for select using (
  exists(
    select 1 from public.community_conversation_participants p
    where p.conversation_id = id and p.user_id = auth.uid()
  )
);

create policy "participants_select_own" on public.community_conversation_participants
for select using (user_id = auth.uid() or conversation_id in (
  select conversation_id from public.community_conversation_participants where user_id = auth.uid()
));

create policy "participants_insert_own" on public.community_conversation_participants
for insert with check (user_id = auth.uid());

create policy "messages_select_participant" on public.community_messages
for select using (
  exists(
    select 1 from public.community_conversation_participants p
    where p.conversation_id = conversation_id and p.user_id = auth.uid()
  )
);

create policy "messages_insert_participant" on public.community_messages
for insert with check (
  sender_id = auth.uid() and
  exists(
    select 1 from public.community_conversation_participants p
    where p.conversation_id = conversation_id and p.user_id = auth.uid()
  )
);

-- Check if user can DM another user (mutual interaction required)
create or replace function public.can_dm_user(other_user_id uuid)
returns boolean
language plpgsql
security definer
as $$
declare
  current_user_id uuid;
  is_blocked boolean;
  has_interaction boolean;
begin
  current_user_id := auth.uid();
  
  if current_user_id is null or current_user_id = other_user_id then
    return false;
  end if;
  
  -- Check if blocked
  select exists(
    select 1 from public.community_blocks
    where (blocker_id = current_user_id and blocked_id = other_user_id)
       or (blocker_id = other_user_id and blocked_id = current_user_id)
  ) into is_blocked;
  
  if is_blocked then
    return false;
  end if;
  
  -- Check mutual interaction (both users liked or commented on each other's posts)
  select exists(
    -- Current user interacted with other user's content
    (select 1 from public.community_likes l
     inner join public.community_posts p on l.post_id = p.id
     where l.user_id = current_user_id and p.author_id = other_user_id
     limit 1)
    union
    (select 1 from public.community_comments c
     inner join public.community_posts p on c.post_id = p.id
     where c.author_id = current_user_id and p.author_id = other_user_id
     limit 1)
  ) and exists(
    -- Other user interacted with current user's content
    (select 1 from public.community_likes l
     inner join public.community_posts p on l.post_id = p.id
     where l.user_id = other_user_id and p.author_id = current_user_id
     limit 1)
    union
    (select 1 from public.community_comments c
     inner join public.community_posts p on c.post_id = p.id
     where c.author_id = other_user_id and p.author_id = current_user_id
     limit 1)
  ) into has_interaction;
  
  return has_interaction;
end;
$$;

-- Get or create DM conversation (with permission check)
create or replace function public.get_or_create_conversation(other_user_id uuid)
returns uuid
language plpgsql
security definer
as $$
declare
  conv_id uuid;
  current_user_id uuid;
begin
  current_user_id := auth.uid();
  
  if not public.can_dm_user(other_user_id) then
    raise exception 'Cannot message this user. Mutual interaction required.';
  end if;
  
  -- Find existing conversation
  select p1.conversation_id into conv_id
  from public.community_conversation_participants p1
  inner join public.community_conversation_participants p2 
    on p1.conversation_id = p2.conversation_id
  where p1.user_id = current_user_id 
    and p2.user_id = other_user_id
  limit 1;
  
  -- Create if not found
  if conv_id is null then
    insert into public.community_conversations default values
    returning id into conv_id;
    
    insert into public.community_conversation_participants (conversation_id, user_id)
    values (conv_id, current_user_id), (conv_id, other_user_id);
  end if;
  
  return conv_id;
end;
$$;
