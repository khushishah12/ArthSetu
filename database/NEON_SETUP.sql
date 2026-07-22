-- ArthSetu AI — Neon PostgreSQL setup
-- Run this once in Neon Console → SQL Editor.
-- Authentication tables are managed separately by Neon Auth.

create extension if not exists pgcrypto;

create table if not exists public.assessment_runs (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  profile_key text not null,
  score integer not null check (score between 300 and 900),
  risk_bucket text not null check (risk_bucket in ('Low', 'Medium', 'High')),
  confidence real not null check (confidence between 0 and 100),
  plan text,
  monthly_amount integer,
  years integer,
  result jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists assessment_runs_user_created_idx
  on public.assessment_runs (user_id, created_at desc);

create table if not exists public.consent_events (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  consent_type text not null,
  status text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists consent_events_user_created_idx
  on public.consent_events (user_id, created_at desc);
