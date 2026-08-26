-- Phase 2b: richer condition capture on cases
alter table cases add column if not exists conditions text[] not null default '{}';
alter table cases add column if not exists mobility text;
alter table cases add column if not exists approach text;

-- Update the dashboard function to return the new fields
create or replace function ngo_dashboard(p_ngo_id uuid)
returns table (
  id uuid,
  photo_url text,
  animal_type text,
  condition_notes text,
  conditions text[],
  mobility text,
  approach text,
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
  select n.location, n.radius_km into ngo_loc, ngo_radius
  from ngos n where n.id = p_ngo_id;

  return query
  select
    c.id, c.photo_url, c.animal_type, c.condition_notes,
    c.conditions, c.mobility, c.approach, c.severity,
    c.status, c.reporter_phone,
    ST_Distance(c.location, ngo_loc) as distance_m,
    c.created_at,
    (c.claimed_by = p_ngo_id) as is_mine
  from cases c
  where
    (c.status in ('reported', 'notified')
      and ST_DWithin(c.location, ngo_loc, ngo_radius * 1000))
    or c.claimed_by = p_ngo_id
  order by
    case when c.status in ('reported','notified') then 0 else 1 end,
    c.severity asc,
    distance_m asc;
end;
$$;
