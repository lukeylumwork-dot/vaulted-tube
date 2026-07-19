-- Hosted video files: public 'videos' bucket with user-scoped write policies.
-- Mirrors the thumbnails bucket policy model; 50MB per file (free-tier cap),
-- browser-playable container formats only.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('videos', 'videos', true, 52428800, ARRAY['video/mp4','video/webm','video/ogg','video/quicktime'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public read videos storage" on storage.objects;
create policy "public read videos storage"
on storage.objects
for select
using (bucket_id = 'videos');

drop policy if exists "authenticated upload own videos" on storage.objects;
create policy "authenticated upload own videos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'videos'
  and split_part(name, '/', 1) = auth.uid()::text
);

drop policy if exists "authenticated update own videos" on storage.objects;
create policy "authenticated update own videos"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'videos'
  and split_part(name, '/', 1) = auth.uid()::text
)
with check (
  bucket_id = 'videos'
  and split_part(name, '/', 1) = auth.uid()::text
);

drop policy if exists "authenticated delete own videos" on storage.objects;
create policy "authenticated delete own videos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'videos'
  and split_part(name, '/', 1) = auth.uid()::text
);
