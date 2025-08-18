-- Safety plan: contacts and locations persistence
-- Create extension for gen_random_uuid if not exists
create extension if not exists pgcrypto;

-- Emergency contacts table
create table if not exists public.emergency_contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  phone text not null,
  relationship text,
  available_times text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Safe locations table
create table if not exists public.safe_locations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  address text not null,
  contact_person text,
  phone text,
  notes text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Triggers to update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists emergency_contacts_set_updated_at on public.emergency_contacts;
create trigger emergency_contacts_set_updated_at
before update on public.emergency_contacts
for each row execute function public.set_updated_at();

drop trigger if exists safe_locations_set_updated_at on public.safe_locations;
create trigger safe_locations_set_updated_at
before update on public.safe_locations
for each row execute function public.set_updated_at();

-- Enable RLS
alter table public.emergency_contacts enable row level security;
alter table public.safe_locations enable row level security;

-- Policies: owner-only CRUD
create policy if not exists "emergency_contacts_select_own"
  on public.emergency_contacts for select
  using (auth.uid() = user_id);

create policy if not exists "emergency_contacts_insert_own"
  on public.emergency_contacts for insert
  with check (auth.uid() = user_id);

create policy if not exists "emergency_contacts_update_own"
  on public.emergency_contacts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy if not exists "emergency_contacts_delete_own"
  on public.emergency_contacts for delete
  using (auth.uid() = user_id);

create policy if not exists "safe_locations_select_own"
  on public.safe_locations for select
  using (auth.uid() = user_id);

create policy if not exists "safe_locations_insert_own"
  on public.safe_locations for insert
  with check (auth.uid() = user_id);

create policy if not exists "safe_locations_update_own"
  on public.safe_locations for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy if not exists "safe_locations_delete_own"
  on public.safe_locations for delete
  using (auth.uid() = user_id);

-- Helpful indexes
create index if not exists emergency_contacts_user_id_idx on public.emergency_contacts(user_id);
create index if not exists safe_locations_user_id_idx on public.safe_locations(user_id);
