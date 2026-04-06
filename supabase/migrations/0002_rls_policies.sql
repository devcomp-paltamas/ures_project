begin;

alter table public.profiles enable row level security;
alter table public.landing_blocks enable row level security;
alter table public.items enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (public.requesting_user_id() = user_id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (public.requesting_user_id() = user_id)
with check (public.requesting_user_id() = user_id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (public.requesting_user_id() = user_id);

drop policy if exists "landing_blocks_public_read_published" on public.landing_blocks;
create policy "landing_blocks_public_read_published"
on public.landing_blocks
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "items_read_visible_scope" on public.items;
create policy "items_read_visible_scope"
on public.items
for select
to anon, authenticated
using (
  visibility = 'public'
  or (
    public.requesting_user_id() is not null
    and (
      owner_id = public.requesting_user_id()
      or visibility = 'members'
    )
  )
);

drop policy if exists "items_insert_own" on public.items;
create policy "items_insert_own"
on public.items
for insert
to authenticated
with check (owner_id = public.requesting_user_id());

drop policy if exists "items_update_own" on public.items;
create policy "items_update_own"
on public.items
for update
to authenticated
using (owner_id = public.requesting_user_id())
with check (owner_id = public.requesting_user_id());

drop policy if exists "items_delete_own" on public.items;
create policy "items_delete_own"
on public.items
for delete
to authenticated
using (owner_id = public.requesting_user_id());

commit;
