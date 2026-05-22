# Vaulted Tube

Private catalog interface for video references and metadata.

## Local Development

1. Install dependencies:

   ```sh
   npm install
   ```

2. Create a local environment file from `.env.example` and provide Supabase project credentials:

   ```sh
   cp .env.example .env
   ```

3. Start the Vite dev server:

   ```sh
   npm run dev
   ```

## Required Environment Variables

- `VITE_SUPABASE_URL`: Supabase project URL.
- `VITE_SUPABASE_ANON_KEY`: Supabase anon key for browser access.

Do not use a Supabase service role key in the browser.

## Supabase

The current catalog schema is represented in `supabase/migrations/20260518_catalog_schema.sql`.

The frontend reads and writes catalog metadata through `src/lib/catalogApi.ts`.

## Storage

No Supabase Storage buckets are currently documented or created in migrations. The data model has optional URL/path fields for video and thumbnail assets, but the app currently presents itself as metadata-only and does not upload media.
