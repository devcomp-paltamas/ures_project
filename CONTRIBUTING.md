# Contributing

Ez a dokumentum a projekt közös működési szabályait rögzíti.  
Célja: a kódbázis maradjon tiszta, bővíthető és egységes.

## 1. Alapelv

- Mindig a legegyszerűbb jól karbantartható megoldást válasszuk.
- Ne építsünk be új absztrakciót valódi indok nélkül.
- A meglévő architektúrát bővítsük, ne keverjünk be új mintákat feleslegesen.
- Mock és valós működés maradjon szétválasztva.

## 2. Technikai keret

- Frontend: React + TypeScript + Vite
- Styling: Tailwind CSS
- UI primitivek: shadcn/ui + Radix UI
- Routing: React Router
- Szerverállapot: TanStack React Query
- Auth: Firebase Auth
- Értesítések: Sonner
- Tesztelés: Vitest + Testing Library + Playwright

## 3. Mappaszerkezet

- `src/app`: alkalmazás szintű belépési pontok, router, oldalak
- `src/components/ui`: újrahasznosítható alacsony szintű UI elemek
- `src/components/*`: összetett, képernyőhöz vagy funkcióhoz kötött komponensek
- `src/features/*`: üzleti logika és szolgáltatásréteg
- `src/hooks`: React hookok, főleg query/mutatációs wraperek
- `src/providers`: globális provider-ek
- `src/api`: HTTP és mock API réteg
- `src/lib`: infrastruktúra és általános utility
- `src/types`: domain típusok
- `src/styles`: globális stílusok

## 4. Fájlelhelyezési szabályok

- Új oldal a `src/app/pages` alá kerüljön.
- Új UI primitive a `src/components/ui` alá kerüljön.
- Új üzleti logika a megfelelő `src/features/<domain>` mappába kerüljön.
- API hívás ne közvetlenül komponensből történjen.
- Komponensből szolgáltatást közvetlenül csak indokolt esetben hívjunk, általában hookon keresztül.

## 5. Kódolási szabályok

- TypeScript strict módhoz illeszkedő kódot írjunk.
- Használjunk `type` importot, ahol típus import történik.
- Használjuk az `@/` alias-t relatív mély útvonalak helyett.
- Egy fájlnak legyen világos, egyértelmű felelőssége.
- A utility függvény maradjon tiszta és mellékhatásmentes, ha lehet.
- Ne duplikáljunk UI vagy üzleti logikát.

## 6. UI irányelvek

- Elsőként a meglévő `ui` komponensekre építsünk.
- Ne hozzunk be új UI könyvtárat, ha a jelenlegi stack elég.
- A felület maradjon következetes tipográfiában, spacingben és állapotkezelésben.
- Loading, error és empty state legyen minden fontos adatnézetnél.
- Az új felület desktopon és mobilon is legyen értelmezhető.

## 7. Adat- és állapotkezelés

- Szerveradat React Query-n keresztül menjen.
- HTTP logika az `src/api/http.ts` rétegben maradjon egységes.
- Mock működés az `src/api/mock-api.ts` rétegben maradjon.
- Authhoz kötött üzleti logika a `features/auth` körül maradjon.
- Környezeti változókat csak az `env` rétegen keresztül olvassunk.

## 8. Új funkció hozzáadása

Ajánlott lépések:

1. Domain és cél tisztázása.
2. Szükséges típusok létrehozása vagy bővítése.
3. Service réteg megírása a `features` alatt.
4. Query vagy mutation hook létrehozása.
5. UI komponens vagy oldal bekötése.
6. Legalább alap teszt hozzáadása, ha a funkció érdemi.

## 9. Tesztelési elv

- Logikai és UI viselkedési tesztek: Vitest
- Komponens interakciók: Testing Library
- Fő felhasználói folyamatok: Playwright
- Merge előtt minimum ez fusson le:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run test:unit`

Ha nagyobb változás történt, akkor:

- `npm run check`
- szükség esetén `npm run test:e2e`

## 10. Definition of Done

Egy feladat akkor tekinthető késznek, ha:

- működik a kívánt funkció
- illeszkedik a meglévő architektúrába
- nincs felesleges duplikáció
- a típusok rendben vannak
- a lint és a releváns tesztek átmennek
- a felhasználói állapotok kezelve vannak

## 11. Amit kerüljünk

- közvetlen `fetch` hívások szétszórva a komponensekben
- üzleti logika JSX-ben
- túl nagy, több felelősségű komponensek
- ad-hoc állapotkezelés több különböző mintával
- félkész mock és valós logika keverése
- indokolatlan új dependency hozzáadása
