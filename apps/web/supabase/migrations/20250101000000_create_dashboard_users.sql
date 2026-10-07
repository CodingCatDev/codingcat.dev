-- Initial migration: create dashboard_users table
-- This table stores user profile data linked to Supabase Auth users.

create table if not exists public.dashboard_users (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  role text not null default 'member' check (role in ('member', 'admin', 'owner')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.dashboard_users enable row level security;

-- Policy: users can read their own row
create policy "Users can read own profile"
  on public.dashboard_users
  for select
  using (auth.uid() = id);

-- Policy: users can update their own row
create policy "Users can update own profile"
  on public.dashboard_users
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Trigger to auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_dashboard_users_updated
  before update on public.dashboard_users
  for each row
  execute function public.handle_updated_at();
