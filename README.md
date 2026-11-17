# Oxten website

The landing page for Oxten, served at https://www.oxten.ai.

- The home page is the React route in `src/routes/index.tsx`, with the painted scene in `src/components/atmosphere.tsx`.
- Early access requests are stored by `src/lib/early-access.functions.ts` in the `early_access_requests` table.
- `public/versions/` holds earlier design directions, with a gallery at `/versions/index.html`.

## Development

```sh
bun install
bun run dev
```

Pushing to `main` deploys to production on Vercel. Storing requests needs `SUPABASE_URL` and
`SUPABASE_SERVICE_ROLE_KEY` for the project named in `.env`.
