-- ═══════════════════════════════════════════════════════════════
-- Pawsure Watch — Phase 2 additions: severity + NGO auth + dashboard
-- Run this in Supabase SQL editor (after the original schema.sql).
-- ═══════════════════════════════════════════════════════════════

-- 1. Severity on cases: 1 = emergency, 2 = needs help, 3 = stable
alter table cases add column if not exists severity int not null default 2
  check (severity in (1, 2, 3));

-- 2. Link each NGO to a Supabase Auth user (for login).
--    You'll set this when you create an NGO's account.
alter table ngos add column if not exists user_id uuid references auth.users(id);

-- 3. Dashboard function: all cases relevant to one NGO.
--    Returns unclaimed cases within the NGO's radius PLUS cases this NGO claimed,
--    each with distance (metres) and severity, sorted by severity then distance.
create or replace function ngo_dashboard(p_ngo_id uuid)
returns table (
  id uuid,
  photo_url text,
  animal_type text,
  condition_notes text,
  severity int,
  status case_status,
  reporter_phone text,
  distance_m double precision,
  created_at timestamptz,
  is_mine boolean
)
language plpgsql
stable
as $$
declare
  ngo_loc geography;
  ngo_radius numeric;
begin
  select location, radius_km into ngo_loc, ngo_radius from ngos where id = p_ngo_id;

  return query
  select
    c.id, c.photo_url, c.animal_type, c.condition_notes, c.severity,
    c.status, c.reporter_phone,
    ST_Distance(c.location, ngo_loc) as distance_m,
    c.created_at,
    (c.claimed_by = p_ngo_id) as is_mine
  from cases c
  where
    -- unclaimed cases within this NGO's service radius
    (c.status in ('reported', 'notified')
      and ST_DWithin(c.location, ngo_loc, ngo_radius * 1000))
    -- OR any case this NGO has claimed (regardless of distance/status)
    or c.claimed_by = p_ngo_id
  order by
    -- open cases first, then by severity (1=emergency first), then nearest
    case when c.status in ('reported','notified') then 0 else 1 end,
    c.severity asc,
    distance_m asc;
end;
$$;
