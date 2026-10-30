-- حفظ لغة الحساب الافتراضية (شغّله مرة واحدة في Supabase → SQL editor)
alter table public.profiles add column if not exists pref_lang text;
alter table public.profiles drop constraint if exists profiles_pref_lang_chk;
alter table public.profiles add constraint profiles_pref_lang_chk check (pref_lang is null or pref_lang in ('ar','en'));
