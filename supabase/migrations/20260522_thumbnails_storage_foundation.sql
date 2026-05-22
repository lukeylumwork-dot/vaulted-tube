insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('thumbnails', 'thumbnails', true, 5242880, ARRAY['image/jpeg','image/png','image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public read thumbnails" on storage.objects;
create policy "public read thumbnails"
on storage.objects
for select
using (bucket_id = 'thumbnails');

drop policy if exists "authenticated upload own thumbnails" on storage.objects;
create policy "authenticated upload own thumbnails"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'thumbnails'
  and split_part(name, '/', 1) = auth.uid()::text
);

drop policy if exists "authenticated update own thumbnails" on storage.objects;
create policy "authenticated update own thumbnails"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'thumbnails'
  and split_part(name, '/', 1) = auth.uid()::text
)
with check (
  bucket_id = 'thumbnails'
  and split_part(name, '/', 1) = auth.uid()::text
);

drop policy if exists "authenticated delete own thumbnails" on storage.objects;
create policy "authenticated delete own thumbnails"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'thumbnails'
  and split_part(name, '/', 1) = auth.uid()::text
);
