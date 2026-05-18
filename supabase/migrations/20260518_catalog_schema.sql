create extension if not exists "pgcrypto";

create table if not exists public.performers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  aliases text[] not null default '{}',
  tags text[] not null default '{}',
  notes text not null default '',
  avatar_color text not null default 'hsl(220 40% 22%)',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(), name text not null unique, category text not null default 'General', created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(), name text not null, description text not null default '', cover_color text not null default 'hsl(220 40% 22%)', created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(), title text not null, date_added date not null default current_date, duration_seconds int not null default 0,
  rating int not null default 3 check (rating between 1 and 5), notes text not null default '', is_favorite boolean not null default false,
  thumbnail_color text not null default 'hsl(220 40% 22%)', video_url text, video_storage_path text, thumbnail_url text, thumbnail_storage_path text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.video_performers (video_id uuid references public.videos(id) on delete cascade, performer_id uuid references public.performers(id) on delete cascade, created_at timestamptz not null default now(), primary key(video_id, performer_id));
create table if not exists public.video_tags (video_id uuid references public.videos(id) on delete cascade, tag_id uuid references public.tags(id) on delete cascade, created_at timestamptz not null default now(), primary key(video_id, tag_id));
create table if not exists public.collection_videos (collection_id uuid references public.collections(id) on delete cascade, video_id uuid references public.videos(id) on delete cascade, created_at timestamptz not null default now(), primary key(collection_id, video_id));
create table if not exists public.user_preferences (
  id uuid primary key default gen_random_uuid(), display_name text not null default 'Curator', default_sort text not null default 'dateAdded', items_per_row int not null default 6, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create index if not exists idx_videos_date_added on public.videos(date_added desc);
create index if not exists idx_videos_rating on public.videos(rating desc);
create index if not exists idx_videos_favorite on public.videos(is_favorite);
alter table public.videos enable row level security; alter table public.performers enable row level security; alter table public.tags enable row level security; alter table public.collections enable row level security; alter table public.video_performers enable row level security; alter table public.video_tags enable row level security; alter table public.collection_videos enable row level security; alter table public.user_preferences enable row level security;
create policy "public read videos" on public.videos for select using (true);
create policy "public read performers" on public.performers for select using (true);
create policy "public read tags" on public.tags for select using (true);
create policy "public read collections" on public.collections for select using (true);
create policy "public read video_performers" on public.video_performers for select using (true);
create policy "public read video_tags" on public.video_tags for select using (true);
create policy "public read collection_videos" on public.collection_videos for select using (true);
create policy "public read preferences" on public.user_preferences for select using (true);
