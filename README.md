# Oxten website

The landing page for Oxten, served at https://www.oxten.ai.

## How it is put together

- The home page is one self-contained document, `src/home/v5.html`, served by `src/routes/index.tsx`.
  It is generated from the design source with `python3 scripts/build-home.py <design index.html>`,
  which sets image paths, metadata and the waitlist endpoint.
- `src/routes/api/waitlist.ts` stores invite requests in the `waitlist` table.
- `public/versions/` holds every earlier design direction, with a gallery at `/versions/index.html`.
- `scripts/og.cjs` renders the social preview image from `scripts/og.html`.

## Development

```sh
bun install
bun run dev
```

Pushing to `main` deploys to production on Vercel. The waitlist endpoint needs
`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in the environment.
