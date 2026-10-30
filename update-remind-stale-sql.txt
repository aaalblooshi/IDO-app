-- تذكير المكلّفين بتحديث مهامهم المتأخرة (شغّله مرة واحدة في Supabase → SQL editor)
create or replace function remind_stale(p_plans bigint[], p_users uuid[]) returns int
language plpgsql security definer set search_path=public as $fn$
declare
  me text; pid bigint; v_code text; v_proj text; rcp jsonb; url text; sec text; site text; n int := 0;
begin
  select role into me from profiles where id = auth.uid();
  if me is distinct from 'admin' then return 0; end if;
  select value into url  from app_config where key = 'mail_url';
  select value into sec  from app_config where key = 'mail_secret';
  select value into site from app_config where key = 'site_url';
  if url is null then return 0; end if;
  foreach pid in array coalesce(p_plans, '{}'::bigint[]) loop
    select code, data->>'pname' into v_code, v_proj from plans where id = pid;
    if v_code is null then continue; end if;
    select coalesce(jsonb_agg(distinct jsonb_build_object('email', lower(trim(pr.email)), 'name', pr.full_name)), '[]'::jsonb)
      into rcp
      from profiles pr
     where pr.id = any(p_users)
       and coalesce(trim(pr.email), '') <> ''
       and exists (select 1 from plans p2, jsonb_array_elements(coalesce(p2.data->'tasks','[]'::jsonb)) t
                    where p2.id = pid and t->>'w' = pr.id::text);
    if jsonb_array_length(rcp) = 0 then continue; end if;
    perform net.http_post(url := url,
      body := jsonb_build_object('secret', sec, 'event', 'reminderUpdate', 'service', 'plan', 'code', v_code,
              'project', nullif(v_proj, ''), 'by', (select full_name from profiles where id = auth.uid()),
              'site', site, 'page', 'tasks.html', 'recipients', rcp),
      headers := '{"Content-Type":"application/json"}'::jsonb);
    n := n + jsonb_array_length(rcp);
  end loop;
  return n;
end $fn$;
grant execute on function remind_stale(bigint[], uuid[]) to authenticated;
