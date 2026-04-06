# SPEC v2

Ez a dokumentum a jelenlegi kódbázis és a telepített csomagok alapján készült rövid termék- és technikai specifikáció.

## 1. Mi a projekt?

Egy modern webes starter alkalmazás, amelyből gyorsan építhető valódi termék.

A jelenlegi alap már támogatja:

- nyilvános landing oldalt
- autentikációt
- védett alkalmazásfelületet
- egyszerű adatelérést
- mock és valós működési mód szétválasztását

## 2. Technikai alap

- React 19
- TypeScript
- Vite 7
- Tailwind CSS 4
- shadcn/ui + Radix UI
- React Router 7
- TanStack React Query
- Firebase Auth
- Supabase kliens
- Zod
- Sonner
- Vitest + Testing Library
- Playwright
- Vercel
- PWA támogatás

## 3. Mi az MVP?

Az MVP a "Minimum Viable Product".

Egyszerűen:

- a legkisebb verzió, ami már használható
- már megmutatja a termék valódi értékét
- de még nincs tele extrákkal

Lépésről lépésre:

1. Meghatározzuk a fő problémát, amit a termék megold.
2. Kiválasztjuk azt a legkevesebb funkciót, ami ehhez tényleg kell.
3. Minden más későbbre kerül.
4. Az első verziót gyorsan kipróbálhatóvá tesszük.

Példa ebben a projektben:

- kell: bejelentkezés, landing oldal, védett app oldal, alap profil, alap item lista
- nem kell első körben: összetett szerepkörök, admin rendszer, riportok, sok modul

## 4. Javasolt MVP scope

Az első valóban használható verzió tartalma:

- nyilvános landing oldal
- email/jelszavas regisztráció és bejelentkezés
- Google bejelentkezés
- védett `/app` oldal
- felhasználói profil és alap preferenciák
- item lista betöltése
- item létrehozás, szerkesztés, törlés
- mock mód fejlesztéshez
- valódi API mód éles integrációhoz
- magyar és angol nyelvi alap
- világos/sötét/system téma kezelés

## 5. Későbbi kör

Ezek ne legyenek részei az első kiadásnak:

- admin felület
- finomhangolt jogosultsági rendszer
- összetett analitika és riportok
- több domain modul
- haladó workflow-k
- valós idejű együttműködés

## 6. Backend elvárások

A jelenlegi frontend alapján ezek az endpointok szükségesek:

- `POST /api/auth/session`
- `GET /api/bootstrap`
- `GET /api/items`
- `POST /api/items`
- `PATCH /api/items/:id`
- `DELETE /api/items/:id`
- `GET /api/preferences`
- `PATCH /api/preferences`

## 7. Fontos architektúra döntések

- A mock mód maradjon első osztályú fejlesztési út.
- A frontend és a backend kommunikáció maradjon egyszerű REST alapon.
- A Firebase a kliens oldali auth belépési pont.
- A backend feladata a token ellenőrzés és az üzleti adatok kezelése.
- A UI-rendszerre érdemes következetesen tovább építeni, nem új komponensrendszert behozni.
- A Supabase szerepét külön véglegesíteni kell: adatbázis, backend service vagy csak opcionális integráció.

## 8. Rövid termékcél

Az első kiadás célja nem egy teljes platform, hanem egy tiszta, stabil, bővíthető alap átadása, amely:

- bemutatható
- használható
- tesztelhető
- továbbfejleszthető
