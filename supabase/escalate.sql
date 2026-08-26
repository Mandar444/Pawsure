-- Escalation: unclaimed for 60+ min → double radius, notify newly-in-range NGOs.
-- Schedule with pg_cron (Supabase → Database → Extensions → pg_cron):
--   select cron.schedule('escalate-cases', '*/15 * * * *', 'select escalate_stale_cases()');
-- Note: this flags escalation in the DB. The WhatsApp sends for new NGOs are
-- triggered by a Supabase Edge Function (webhook on case_notifications insert)
-- or by polling GET /api/escalate — DB can't call AiSensy directly.

create or replace function escalate_stale_cases()
returns void as $$
declare
  c record;
begin
  for c in
    select id, location, search_radius_km
    from cases
    where status = 'notified'
      and created_at < now() - interval '60 minutes'
      and search_radius_km < 12          -- cap: stop doubling past 12km
  loop

    update cases set search_radius_km = c.search_radius_km * 2 where id = c.id;

    -- queue notifications for NGOs newly in range (not already pinged)
    insert into case_notifications (case_id, ngo_id, sent_at)
    select c.id, n.id, null              -- sent_at null = pending send
    from ngos n
    where n.verified = true
      and ST_DWithin(n.location, c.location, c.search_radius_km * 2 * 1000)
      and not exists (
        select 1 from case_notifications cn
        where cn.case_id = c.id and cn.ngo_id = n.id
      );
  end loop;
end;
$$ language plpgsql;
