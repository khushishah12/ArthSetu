create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role text,
  city text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.financial_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  profile_key text not null unique,
  display_name text not null,
  role text not null,
  city text not null,
  monthly_income numeric(12,2) not null check (monthly_income >= 0),
  monthly_expenses numeric(12,2) not null check (monthly_expenses >= 0),
  emergency_fund_months numeric(6,2) not null default 0,
  income_stability smallint not null check (income_stability between 1 and 5),
  features jsonb not null,
  consent jsonb not null,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.assessment_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  profile_key text not null,
  score integer not null check (score between 300 and 900),
  risk_bucket text not null check (risk_bucket in ('Low','Medium','High')),
  confidence integer not null check (confidence between 0 and 100),
  plan text not null check (plan in ('Conservative','Balanced','Growth')),
  monthly_amount integer not null check (monthly_amount between 500 and 5000),
  years integer not null check (years between 1 and 5),
  result jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.consent_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  profile_key text not null,
  source text not null check (source in ('recharge','utility','commerce','savings')),
  granted boolean not null,
  purpose text not null,
  created_at timestamptz not null default now()
);

create index if not exists assessment_runs_user_created_idx on public.assessment_runs(user_id, created_at desc);
create index if not exists consent_events_user_created_idx on public.consent_events(user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.financial_profiles enable row level security;
alter table public.assessment_runs enable row level security;
alter table public.consent_events enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "demo_profiles_public_read" on public.financial_profiles for select using (is_demo = true or auth.uid() = owner_id);
create policy "financial_profiles_insert_own" on public.financial_profiles for insert with check (auth.uid() = owner_id and is_demo = false);
create policy "financial_profiles_update_own" on public.financial_profiles for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id and is_demo = false);
create policy "financial_profiles_delete_own" on public.financial_profiles for delete using (auth.uid() = owner_id and is_demo = false);

create policy "assessment_runs_select_own" on public.assessment_runs for select using (auth.uid() = user_id);
create policy "assessment_runs_insert_own" on public.assessment_runs for insert with check (auth.uid() = user_id);
create policy "assessment_runs_delete_own" on public.assessment_runs for delete using (auth.uid() = user_id);

create policy "consent_events_select_own" on public.consent_events for select using (auth.uid() = user_id);
create policy "consent_events_insert_own" on public.consent_events for insert with check (auth.uid() = user_id);
create policy "consent_events_update_own" on public.consent_events for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
