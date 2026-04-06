# Adatmodell áttekintés

## Visual Thesis

Egyszerű, kiszámítható adatmodell, ami pontosan a mostani UI-domaint szolgálja ki, és később adapterrel bővíthető.

## Táblák

### `public.profiles`

- `user_id`: külső auth azonosító, jelenleg Firebase `uid`
- `email`: duplikált, gyorsan olvasható email
- `display_name`
- `avatar_url`
- `language`
- `theme`
- `created_at`
- `updated_at`

### `public.items`

- `id`
- `owner_id`
- `title`
- `summary`
- `visibility`
- `is_pinned`
- `created_at`
- `updated_at`

### `public.landing_blocks`

- `id`
- `slug`
- `eyebrow`
- `title`
- `body`
- `tone`
- `cta_label`
- `cta_href`
- `is_published`
- `created_at`
- `updated_at`

## Jogosultsági elv

Az SQL oldalon RLS policy-k védik a táblákat. A mostani Vercel API viszont Firebase Auth miatt service role klienssel éri el a Supabase-et, ezért ugyanazokat a szabályokat szerveroldali kódban is érvényesíti.

### Profile

- saját profil olvasás
- saját profil módosítás

### Item

- owner: teljes hozzáférés
- public: mindenki olvashatja
- members: minden belépett felhasználó olvashatja
- módosítás és törlés: csak owner

### Landing block

- publikus olvasás csak `is_published = true`

## Miért tiszta ez a setup?

- nincs túlmodellezve
- a jelenlegi domain típusokkal 1:1-ben illeszkedik
- az RLS logika könnyen követhető
- a Firebase Auth és a Supabase tábla szétválasztása tiszta marad
- a későbbi seed és reset külön rétegben megoldható
