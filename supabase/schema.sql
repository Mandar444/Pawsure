-- Pawsure Watch schema
-- Run in Supabase SQL editor. PostGIS is pre-installed on Supabase.

create extension if not exists postgis;

-- ═══ NGOs ═══
create table ngos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  whatsapp_number text not null,          -- E.164: +9198XXXXXXXX
  location geography(point) not null,     -- ST_MakePoint(lng, lat)
  radius_km numeric not null default 3,   -- fixed 3km for now
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create index ngos_location_idx on ngos using gist (location);

-- ═══ Cases ═══
create type case_status as enum
  ('reported', 'notified', 'claimed', 'picked_up', 'treated', 'closed', 'unresolved');

create table cases (
  id uuid primary key default gen_random_uuid(),
  reporter_phone text not null,
  photo_url text not null,
  location geography(point) not null,
  animal_type text,                        -- dog | cat | bird | other
  condition_notes text,
  status case_status not null default 'reported',
  claimed_by uuid references ngos(id),
  claimed_at timestamptz,
  search_radius_km numeric not null default 3,  -- grows on escalation
  created_at timestamptz not null default now()
);

create index cases_status_idx on cases (status);

-- ═══ Case updates (powers the reporter's update feed) ═══
create table case_updates (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id),
  author_ngo uuid references ngos(id),     -- null = system message
  message text not null,
  photo_url text,
  created_at timestamptz not null default now()
);

-- ═══ Notification log (who was pinged, prevents double-sends) ═══
create table case_notifications (
  case_id uuid not null references cases(id),
  ngo_id uuid not null references ngos(id),
  sent_at timestamptz not null default now(),
  primary key (case_id, ngo_id)
);


create or replace function match_ngos(
  p_case_lat double precision,
  p_case_lng double precision,
  p_radius_km double precision default 3
)
returns table (
  id uuid,
  name text,
  whatsapp_number text
)
language plpgsql
stable
as $$
begin
  return query
  select
    n.id,
    n.name,
    n.whatsapp_number
  from ngos n
  where n.verified = true
    and ST_DWithin(
      n.location,
      ST_SetSRID(ST_MakePoint(p_case_lng, p_case_lat), 4326)::geography,
      p_radius_km * 1000
    );
end;
$$;

-- ═══ Atomic claim: first NGO wins, no race condition ═══
create or replace function claim_case(p_case_id uuid, p_ngo_id uuid)
returns boolean as $$
declare
  rows_updated int;
begin
  update cases
  set status = 'claimed', claimed_by = p_ngo_id, claimed_at = now()
  where id = p_case_id and status = 'notified';

  get diagnostics rows_updated = row_count;

  if rows_updated = 1 then
    insert into case_updates (case_id, author_ngo, message)
    values (p_case_id, p_ngo_id, 'Case claimed. Rescue team on the way.');
    return true;
  end if;
  return false;  -- already claimed or invalid state
end;
$$ language plpgsql;

-- ═══ Row Level Security ═══
alter table cases enable row level security;
alter table ngos enable row level security;
alter table case_updates enable row level security;
alter table case_notifications enable row level security;
-- Public writes go through API routes using the service-role key,
-- so no anon policies needed. Add policies later when the app ships.
