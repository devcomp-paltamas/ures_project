begin;

alter table public.landing_blocks
  add column if not exists eyebrow_i18n jsonb,
  add column if not exists title_i18n jsonb,
  add column if not exists body_i18n jsonb,
  add column if not exists cta_label_i18n jsonb;

alter table public.items
  add column if not exists title_i18n jsonb,
  add column if not exists summary_i18n jsonb;

update public.landing_blocks
set
  eyebrow_i18n = jsonb_build_object('hu', eyebrow, 'en', eyebrow),
  title_i18n = jsonb_build_object('hu', title, 'en', title),
  body_i18n = jsonb_build_object('hu', body, 'en', body),
  cta_label_i18n = jsonb_build_object('hu', cta_label, 'en', cta_label)
where
  eyebrow_i18n is null
  or title_i18n is null
  or body_i18n is null
  or cta_label_i18n is null;

update public.items
set
  title_i18n = jsonb_build_object('hu', title, 'en', title),
  summary_i18n = jsonb_build_object('hu', summary, 'en', summary)
where
  title_i18n is null
  or summary_i18n is null;

update public.landing_blocks
set
  eyebrow = 'Működő shell',
  eyebrow_i18n = jsonb_build_object('hu', 'Működő shell', 'en', 'Operational shell'),
  title = 'Tiszta SPA layout, későbbi brand iránynak is hagyott hellyel.',
  title_i18n = jsonb_build_object(
    'hu',
    'Tiszta SPA layout, későbbi brand iránynak is hagyott hellyel.',
    'en',
    'Clean SPA layout with room for later brand direction.'
  ),
  body = 'A tipográfia, a spacing és a felületi logika már külön rétegben van, ezért később új vizuális rendszerre is átállhat az app szerkezeti törés nélkül.',
  body_i18n = jsonb_build_object(
    'hu',
    'A tipográfia, a spacing és a felületi logika már külön rétegben van, ezért később új vizuális rendszerre is átállhat az app szerkezeti törés nélkül.',
    'en',
    'Typography, spacing and surfaces are already separated from content so a later design system can replace the visuals without reworking the app structure.'
  ),
  cta_label = 'Dashboard megnyitása',
  cta_label_i18n = jsonb_build_object('hu', 'Dashboard megnyitása', 'en', 'Open dashboard')
where slug = 'live-ops-ready';

update public.landing_blocks
set
  eyebrow = 'Auth réteg',
  eyebrow_i18n = jsonb_build_object('hu', 'Auth réteg', 'en', 'Auth stack'),
  title = 'A sessiont Firebase kezeli, az adatmodellt a Supabase tartja.',
  title_i18n = jsonb_build_object(
    'hu',
    'A sessiont Firebase kezeli, az adatmodellt a Supabase tartja.',
    'en',
    'Firebase handles the session, Supabase keeps the data model.'
  ),
  body = 'A starter elő van készítve email/jelszó és Google belépésre, bearer-tokenes API hívásokra és egy későbbi RLS-hez igazított adatfolyamra.',
  body_i18n = jsonb_build_object(
    'hu',
    'A starter elő van készítve email/jelszó és Google belépésre, bearer-tokenes API hívásokra és egy későbbi RLS-hez igazított adatfolyamra.',
    'en',
    'The starter is prepared for email/password login, Google login, bearer-token API calls and a later RLS-aligned database flow.'
  ),
  cta_label = 'Komponensek megnyitása',
  cta_label_i18n = jsonb_build_object('hu', 'Komponensek megnyitása', 'en', 'View components')
where slug = 'auth-ready';

update public.landing_blocks
set
  eyebrow = 'Szállítási út',
  eyebrow_i18n = jsonb_build_object('hu', 'Szállítási út', 'en', 'Delivery path'),
  title = 'A Vercel, a Playwright és a Vitest már a kiinduló struktúra része.',
  title_i18n = jsonb_build_object(
    'hu',
    'A Vercel, a Playwright és a Vitest már a kiinduló struktúra része.',
    'en',
    'Vercel, Playwright and Vitest are part of the default structure.'
  ),
  body = 'A repository elő van készítve preview és production környezetre, helyi minőségi kapukra és későbbi CI automatizálásra is.',
  body_i18n = jsonb_build_object(
    'hu',
    'A repository elő van készítve preview és production környezetre, helyi minőségi kapukra és későbbi CI automatizálásra is.',
    'en',
    'The repository is prepared for preview and production environments, local quality gates and later CI automation.'
  ),
  cta_label = 'Beállítás áttekintése',
  cta_label_i18n = jsonb_build_object('hu', 'Beállítás áttekintése', 'en', 'Review setup')
where slug = 'ship-fast';

insert into public.landing_blocks (
  slug,
  eyebrow,
  eyebrow_i18n,
  title,
  title_i18n,
  body,
  body_i18n,
  tone,
  cta_label,
  cta_label_i18n,
  cta_href,
  is_published
)
select
  'live-ops-ready',
  'Működő shell',
  jsonb_build_object('hu', 'Működő shell', 'en', 'Operational shell'),
  'Tiszta SPA layout, későbbi brand iránynak is hagyott hellyel.',
  jsonb_build_object(
    'hu',
    'Tiszta SPA layout, későbbi brand iránynak is hagyott hellyel.',
    'en',
    'Clean SPA layout with room for later brand direction.'
  ),
  'A tipográfia, a spacing és a felületi logika már külön rétegben van, ezért később új vizuális rendszerre is átállhat az app szerkezeti törés nélkül.',
  jsonb_build_object(
    'hu',
    'A tipográfia, a spacing és a felületi logika már külön rétegben van, ezért később új vizuális rendszerre is átállhat az app szerkezeti törés nélkül.',
    'en',
    'Typography, spacing and surfaces are already separated from content so a later design system can replace the visuals without reworking the app structure.'
  ),
  'signal',
  'Dashboard megnyitása',
  jsonb_build_object('hu', 'Dashboard megnyitása', 'en', 'Open dashboard'),
  '/app',
  true
where not exists (select 1 from public.landing_blocks);

insert into public.landing_blocks (
  slug,
  eyebrow,
  eyebrow_i18n,
  title,
  title_i18n,
  body,
  body_i18n,
  tone,
  cta_label,
  cta_label_i18n,
  cta_href,
  is_published
)
select
  'auth-ready',
  'Auth réteg',
  jsonb_build_object('hu', 'Auth réteg', 'en', 'Auth stack'),
  'A sessiont Firebase kezeli, az adatmodellt a Supabase tartja.',
  jsonb_build_object(
    'hu',
    'A sessiont Firebase kezeli, az adatmodellt a Supabase tartja.',
    'en',
    'Firebase handles the session, Supabase keeps the data model.'
  ),
  'A starter elő van készítve email/jelszó és Google belépésre, bearer-tokenes API hívásokra és egy későbbi RLS-hez igazított adatfolyamra.',
  jsonb_build_object(
    'hu',
    'A starter elő van készítve email/jelszó és Google belépésre, bearer-tokenes API hívásokra és egy későbbi RLS-hez igazított adatfolyamra.',
    'en',
    'The starter is prepared for email/password login, Google login, bearer-token API calls and a later RLS-aligned database flow.'
  ),
  'focus',
  'Komponensek megnyitása',
  jsonb_build_object('hu', 'Komponensek megnyitása', 'en', 'View components'),
  '#component-showcase',
  true
where (select count(*) from public.landing_blocks) = 1;

insert into public.landing_blocks (
  slug,
  eyebrow,
  eyebrow_i18n,
  title,
  title_i18n,
  body,
  body_i18n,
  tone,
  cta_label,
  cta_label_i18n,
  cta_href,
  is_published
)
select
  'ship-fast',
  'Szállítási út',
  jsonb_build_object('hu', 'Szállítási út', 'en', 'Delivery path'),
  'A Vercel, a Playwright és a Vitest már a kiinduló struktúra része.',
  jsonb_build_object(
    'hu',
    'A Vercel, a Playwright és a Vitest már a kiinduló struktúra része.',
    'en',
    'Vercel, Playwright and Vitest are part of the default structure.'
  ),
  'A repository elő van készítve preview és production környezetre, helyi minőségi kapukra és későbbi CI automatizálásra is.',
  jsonb_build_object(
    'hu',
    'A repository elő van készítve preview és production környezetre, helyi minőségi kapukra és későbbi CI automatizálásra is.',
    'en',
    'The repository is prepared for preview and production environments, local quality gates and later CI automation.'
  ),
  'calm',
  'Beállítás áttekintése',
  jsonb_build_object('hu', 'Beállítás áttekintése', 'en', 'Review setup'),
  '#setup',
  true
where (select count(*) from public.landing_blocks) = 2;

comment on column public.landing_blocks.eyebrow_i18n is 'Kétnyelvű eyebrow szöveg JSON formában.';
comment on column public.landing_blocks.title_i18n is 'Kétnyelvű cím szöveg JSON formában.';
comment on column public.landing_blocks.body_i18n is 'Kétnyelvű body szöveg JSON formában.';
comment on column public.landing_blocks.cta_label_i18n is 'Kétnyelvű CTA felirat JSON formában.';
comment on column public.items.title_i18n is 'Kétnyelvű cím szöveg JSON formában.';
comment on column public.items.summary_i18n is 'Kétnyelvű leírás szöveg JSON formában.';

commit;
