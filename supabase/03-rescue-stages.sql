-- Phase 2c: additional rescue-stage statuses for the NGO console.
-- Postgres enum values must be added one at a time; IF NOT EXISTS makes it safe to re-run.
alter type case_status add value if not exists 'on_the_way';
alter type case_status add value if not exists 'at_facility';
alter type case_status add value if not exists 'recovering';
alter type case_status add value if not exists 'ready';
-- (picked_up, treated, closed, unresolved already exist from the original schema)
