# Vaulted Tube

Private video library: hosted/linked video playback plus reference metadata (performers, tags, collections).

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
- `VITE_SUPABASE_ANON_KEY` (or `VITE_SUPABASE_PUBLISHABLE_KEY`): Supabase anon/publishable key for browser access. `VITE_SUPABASE_ANON_KEY` wins when both are set; the publishable-key name is accepted because Lovable-managed builds inject it.

Do not use a Supabase service role key in the browser.

## Supabase

The catalog schema lives in `supabase/migrations/` (apply in filename order). `supabase/seed.sql` seeds a starter catalog: three playable, openly licensed videos (Blender Foundation open movies via Google's public sample bucket) plus performers, tags, and collections. It is idempotent — safe to re-run.

The frontend reads and writes catalog metadata through `src/lib/catalogApi.ts`.

## Authentication foundation

- Dashboard write/admin actions now require an authenticated Supabase user session.
- The top navigation includes a minimal email magic-link login form and logout action.
- Anonymous users can still browse public catalog content while writes are blocked by route protection and database RLS policies.

## Storage

Two public-read Supabase Storage buckets are created by migrations, both with user-scoped write policies (`<auth.uid>/<video-id>-<timestamp>.<ext>` paths; authenticated users can only write under their own prefix):

- `thumbnails` (`20260522_thumbnails_storage_foundation.sql`): images up to 5MB (jpeg/png/webp).
- `videos` (`20260719_videos_storage_foundation.sql`): video files up to 50MB (mp4/webm/ogg/quicktime).

## Playback and hosting

- A video plays on its detail page when it has either an external `video_url` or a hosted `video_storage_path`. The external URL takes precedence when both are set.
- The Manage dashboard supports both options per item: paste an external URL, or upload a video file (stored in the `videos` bucket via `src/lib/videoStorage.ts`).
- Thumbnails work the same way (URL or uploaded file); cards and the detail page show the real image when present and fall back to generated gradient art.
- Seeded starter videos use external CC-BY sample URLs, so playback works before anything is uploaded.
