-- FASE 1 — Frequency Origin: canales, nodos, eventos, estado de conversacion, operaciones pendientes

create extension if not exists pgcrypto;

create table if not exists public.frequency_channels (
  id uuid primary key default gen_random_uuid(),
  channel_key text unique not null,
  name text not null,
  type text not null,
  status text not null default 'inactive',
  capabilities jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.nodes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id),
  node_key text unique not null,
  node_type text not null,
  name text not null,
  status text not null default 'inactive',
  location jsonb,
  capabilities jsonb not null default '[]'::jsonb,
  trust_score numeric not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.frequency_events (
  id uuid primary key default gen_random_uuid(),
  event_id text unique not null,
  event_type text not null,
  source text not null,
  user_id uuid references public.profiles(id),
  device_id text,
  priority text not null,
  payload jsonb not null default '{}'::jsonb,
  signature text,
  created_at timestamptz not null default now()
);

create table if not exists public.conversation_state (
  id uuid primary key default gen_random_uuid(),
  channel text not null,
  contact_id text not null,
  user_id uuid references public.profiles(id),
  language text,
  current_intent text,
  context jsonb not null default '{}'::jsonb,
  risk_level text not null default 'normal',
  updated_at timestamptz not null default now(),
  unique(channel, contact_id)
);

create table if not exists public.pending_operations (
  id uuid primary key default gen_random_uuid(),
  operation_id text unique not null,
  operation_type text not null,
  user_id uuid references public.profiles(id),
  device_id text,
  payload jsonb not null,
  state text not null default 'pending',
  attempts integer not null default 0,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_frequency_events_type on public.frequency_events(event_type);
create index if not exists idx_frequency_events_created on public.frequency_events(created_at desc);
create index if not exists idx_pending_operations_state on public.pending_operations(state);
