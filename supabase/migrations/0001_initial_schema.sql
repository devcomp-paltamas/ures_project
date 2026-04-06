begin;

create extension if not exists pgcrypto;
create extension if not exists citext;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'app_locale'
  ) then
    create type public.app_locale as enum ('hu', 'en');
  end if;

  if not exists (
    select 1
    from pg_type
    where typname = 'app_theme_mode'
  ) then
    create type public.app_theme_mode as enum ('light', 'dark', 'system');
  end if;

  if not exists (
    select 1
    from pg_type
    where typname = 'item_visibility'
  ) then
    create type public.item_visibility as enum ('private', 'members', 'public');
  end if;

  if not exists (
    select 1
    from pg_type
    where typname = 'landing_block_tone'
  ) then
    create type public.landing_block_tone as enum ('signal', 'calm', 'focus');
  end if;
end
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.requesting_user_id()
returns text
language sql
stable
as $$
  select nullif(coalesce(auth.jwt() ->> 'sub', ''), '');
$$;

create table if not exists public.profiles (
  user_id text primary key check (char_length(trim(user_id)) between 1 and 128),
  email citext not null unique,
  display_name text not null check (char_length(trim(display_name)) between 1 and 80),
  avatar_url text,
  language public.app_locale not null default 'hu',
  theme public.app_theme_mode not null default 'system',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint profiles_avatar_url_http_check
    check (
      avatar_url is null
      or avatar_url ~* '^https?://'
    )
);

create table if not exists public.landing_blocks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (char_length(trim(slug)) between 1 and 120),
  eyebrow text not null check (char_length(trim(eyebrow)) between 1 and 120),
  title text not null check (char_length(trim(title)) between 1 and 200),
  body text not null check (char_length(trim(body)) between 1 and 4000),
  tone public.landing_block_tone not null default 'signal',
  cta_label text not null check (char_length(trim(cta_label)) between 1 and 120),
  cta_href text not null check (char_length(trim(cta_href)) between 1 and 500),
  is_published boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null references public.profiles (user_id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 160),
  summary text not null check (char_length(trim(summary)) between 1 and 4000),
  visibility public.item_visibility not null default 'private',
  is_pinned boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_profiles_email on public.profiles (email);
create index if not exists idx_landing_blocks_published_created
  on public.landing_blocks (is_published, created_at desc);
create index if not exists idx_items_owner_updated
  on public.items (owner_id, updated_at desc);
create index if not exists idx_items_visibility_updated
  on public.items (visibility, updated_at desc);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_landing_blocks_updated_at on public.landing_blocks;
create trigger set_landing_blocks_updated_at
before update on public.landing_blocks
for each row
execute function public.set_updated_at();

drop trigger if exists set_items_updated_at on public.items;
create trigger set_items_updated_at
before update on public.items
for each row
execute function public.set_updated_at();

comment on table public.profiles is 'Alap felhasználói profil és preferenciák.';
comment on table public.items is 'Felhasználói elemek owner/public/members láthatósággal.';
comment on table public.landing_blocks is 'Landing oldalon megjeleníthető, publikálható blokkok.';

commit;
