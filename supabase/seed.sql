-- Seed: 3 playable, openly-licensed videos + supporting catalog metadata.
-- Idempotent (fixed UUIDs, on conflict do nothing) — safe to re-run.
-- Media: Blender Foundation open movies (CC-BY), served from Google's public
-- sample bucket. Replace with your own uploads via Manage → video file upload.

insert into public.performers (id, name, aliases, tags, notes, avatar_color) values
  ('22222222-2222-4222-8222-000000000001', 'Sacha Goedegebure', '{}', '{"animation","comedy"}', 'Director of Big Buck Bunny (Blender Institute).', 'hsl(38 92% 50%)'),
  ('22222222-2222-4222-8222-000000000002', 'Bassam Kurdali', '{}', '{"animation","sci-fi"}', 'Director of Elephants Dream, the first open movie.', 'hsl(199 89% 48%)'),
  ('22222222-2222-4222-8222-000000000003', 'Colin Levy', '{}', '{"animation","fantasy"}', 'Director of Sintel (Blender Foundation).', 'hsl(265 70% 60%)')
on conflict do nothing;

insert into public.tags (id, name, category) values
  ('33333333-3333-4333-8333-000000000001', 'Animation', 'Genre'),
  ('33333333-3333-4333-8333-000000000002', 'Comedy', 'Genre'),
  ('33333333-3333-4333-8333-000000000003', 'Sci-Fi', 'Genre'),
  ('33333333-3333-4333-8333-000000000004', 'Fantasy', 'Genre'),
  ('33333333-3333-4333-8333-000000000005', 'Short Film', 'Format'),
  ('33333333-3333-4333-8333-000000000006', 'Open Movie', 'Source')
on conflict do nothing;

insert into public.collections (id, name, description, cover_color) values
  ('44444444-4444-4444-8444-000000000001', 'Open Movies', 'Blender Foundation open movies — free to watch and share.', 'hsl(199 89% 48%)'),
  ('44444444-4444-4444-8444-000000000002', 'Festival Shorts', 'Short films with festival pedigree.', 'hsl(45 93% 58%)')
on conflict do nothing;

insert into public.videos (id, title, date_added, duration_seconds, rating, notes, is_favorite, thumbnail_color, video_url, thumbnail_url) values
  ('11111111-1111-4111-8111-000000000001', 'Big Buck Bunny', '2026-07-19', 596, 5,
   'Comedy short about a gentle giant rabbit. (c) Blender Foundation | peach.blender.org | CC-BY 3.0', true, 'hsl(38 60% 25%)',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images_480x270/BigBuckBunny.jpg'),
  ('11111111-1111-4111-8111-000000000002', 'Elephants Dream', '2026-07-18', 653, 4,
   'The first Blender open movie — surreal sci-fi short. (c) Blender Foundation | orange.blender.org | CC-BY 2.5', false, 'hsl(199 60% 25%)',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images_480x270/ElephantsDream.jpg'),
  ('11111111-1111-4111-8111-000000000003', 'Sintel', '2026-07-17', 888, 5,
   'Fantasy short about a girl and her dragon. (c) Blender Foundation | durian.blender.org | CC-BY 3.0', false, 'hsl(265 50% 25%)',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images_480x270/Sintel.jpg')
on conflict do nothing;

insert into public.video_performers (video_id, performer_id) values
  ('11111111-1111-4111-8111-000000000001', '22222222-2222-4222-8222-000000000001'),
  ('11111111-1111-4111-8111-000000000002', '22222222-2222-4222-8222-000000000002'),
  ('11111111-1111-4111-8111-000000000003', '22222222-2222-4222-8222-000000000003')
on conflict do nothing;

insert into public.video_tags (video_id, tag_id) values
  ('11111111-1111-4111-8111-000000000001', '33333333-3333-4333-8333-000000000001'),
  ('11111111-1111-4111-8111-000000000001', '33333333-3333-4333-8333-000000000002'),
  ('11111111-1111-4111-8111-000000000001', '33333333-3333-4333-8333-000000000005'),
  ('11111111-1111-4111-8111-000000000001', '33333333-3333-4333-8333-000000000006'),
  ('11111111-1111-4111-8111-000000000002', '33333333-3333-4333-8333-000000000001'),
  ('11111111-1111-4111-8111-000000000002', '33333333-3333-4333-8333-000000000003'),
  ('11111111-1111-4111-8111-000000000002', '33333333-3333-4333-8333-000000000005'),
  ('11111111-1111-4111-8111-000000000002', '33333333-3333-4333-8333-000000000006'),
  ('11111111-1111-4111-8111-000000000003', '33333333-3333-4333-8333-000000000001'),
  ('11111111-1111-4111-8111-000000000003', '33333333-3333-4333-8333-000000000004'),
  ('11111111-1111-4111-8111-000000000003', '33333333-3333-4333-8333-000000000005'),
  ('11111111-1111-4111-8111-000000000003', '33333333-3333-4333-8333-000000000006')
on conflict do nothing;

insert into public.collection_videos (collection_id, video_id) values
  ('44444444-4444-4444-8444-000000000001', '11111111-1111-4111-8111-000000000001'),
  ('44444444-4444-4444-8444-000000000001', '11111111-1111-4111-8111-000000000002'),
  ('44444444-4444-4444-8444-000000000001', '11111111-1111-4111-8111-000000000003'),
  ('44444444-4444-4444-8444-000000000002', '11111111-1111-4111-8111-000000000002'),
  ('44444444-4444-4444-8444-000000000002', '11111111-1111-4111-8111-000000000003')
on conflict do nothing;

insert into public.user_preferences (id, display_name, default_sort, items_per_row)
values ('55555555-5555-4555-8555-000000000001', 'Curator', 'dateAdded', 6)
on conflict do nothing;
