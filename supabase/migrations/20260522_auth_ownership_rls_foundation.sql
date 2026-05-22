-- Auth/ownership foundation for multi-user writes.

alter table public.performers add column if not exists owner_id uuid references auth.users(id);
alter table public.tags add column if not exists owner_id uuid references auth.users(id);
alter table public.collections add column if not exists owner_id uuid references auth.users(id);
alter table public.videos add column if not exists owner_id uuid references auth.users(id);
alter table public.videos add column if not exists updated_by uuid references auth.users(id);
alter table public.video_performers add column if not exists owner_id uuid references auth.users(id);
alter table public.video_tags add column if not exists owner_id uuid references auth.users(id);
alter table public.collection_videos add column if not exists owner_id uuid references auth.users(id);

create index if not exists idx_performers_owner_id on public.performers(owner_id);
create index if not exists idx_tags_owner_id on public.tags(owner_id);
create index if not exists idx_collections_owner_id on public.collections(owner_id);
create index if not exists idx_videos_owner_id on public.videos(owner_id);
create index if not exists idx_video_performers_owner_id on public.video_performers(owner_id);
create index if not exists idx_video_tags_owner_id on public.video_tags(owner_id);
create index if not exists idx_collection_videos_owner_id on public.collection_videos(owner_id);

drop policy if exists "authenticated write videos" on public.videos;
create policy "authenticated write videos" on public.videos for insert to authenticated with check (auth.uid() is not null and owner_id = auth.uid());
create policy "owner update videos" on public.videos for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid() and updated_by = auth.uid());
create policy "owner delete videos" on public.videos for delete to authenticated using (owner_id = auth.uid());

drop policy if exists "authenticated write performers" on public.performers;
create policy "authenticated write performers" on public.performers for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "authenticated write tags" on public.tags;
create policy "authenticated write tags" on public.tags for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "authenticated write collections" on public.collections;
create policy "authenticated write collections" on public.collections for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "authenticated write video_performers" on public.video_performers;
create policy "authenticated write video_performers" on public.video_performers for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "authenticated write video_tags" on public.video_tags;
create policy "authenticated write video_tags" on public.video_tags for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "authenticated write collection_videos" on public.collection_videos;
create policy "authenticated write collection_videos" on public.collection_videos for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
