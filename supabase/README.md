# Supabase Setup

Ez a mappa a projekt első tiszta SQL alapját tartalmazza a 5. ponthoz.

## Mi kerül létrehozásra?

- `profiles`
  - külső auth userhez kötött profil
  - display name, avatar, nyelv, theme
- `items`
  - owner alapú elemek
  - `private` / `members` / `public` láthatóság
- `landing_blocks`
  - landing oldali, publikálható tartalmi blokkok

## RLS viselkedés

- `profiles`
  - mindenki csak a saját profilját láthatja és módosíthatja
- `items`
  - `public`: mindenki látja
  - `members`: minden bejelentkezett felhasználó látja
  - `private`: csak a tulajdonos látja
  - létrehozás, módosítás, törlés: csak a tulajdonos
- `landing_blocks`
  - csak a publikált blokkok olvashatók kliensoldalról

## Migrációk

1. `0001_initial_schema.sql`
   - enumok
   - táblák
   - indexek
   - `updated_at` trigger
   - auth claimből olvasó helper függvény

2. `0002_rls_policies.sql`
   - row level security bekapcsolása
   - olvasási és írási policy-k

## Javasolt alkalmazás

Supabase CLI-vel:

```bash
supabase db push
```

Vagy SQL Editorban sorrendben:

1. `0001_initial_schema.sql`
2. `0002_rls_policies.sql`

## Fontos megjegyzés

- A jelenlegi projekt Firebase Authot használ, ezért a `profiles.user_id` nem Supabase `auth.users` UUID, hanem külső auth azonosító.
- A profil rekordot most az API-réteg hozza létre vagy frissíti az első hitelesített kéréskor.
- A Vercel API jelenleg `SUPABASE_SERVICE_ROLE_KEY` kulccsal kapcsolódik a DB-hez, ezért a szerveroldali CRUD nem közvetlenül az RLS-re támaszkodik, hanem ugyanazokat a láthatósági szabályokat kódban is ellenőrzi.
- Az RLS így főleg a közvetlen Supabase-eléréshez marad fontos, az API-réteg pedig Firebase-kompatibilis hidat ad fölé.
- A `members` láthatóság itt azt jelenti, hogy minden hitelesített felhasználó láthatja az elemet. Ez szándékosan egyszerű MVP-szintű modell. A későbbi, valódi csoporttagságos megosztás külön táblát és új policy-kat igényelne.
