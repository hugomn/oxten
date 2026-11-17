## Application architecture

- The home page is a single React route; the scene and its motion live in `src/components/atmosphere.tsx`.
- Early access requests go through a validated server function; no visitor can read stored addresses.
- Database schema lives in `drizzle/` and `supabase/`.
