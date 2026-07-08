-- Run this once against your Neon database (Neon console -> SQL Editor,
-- or `psql "$TWODOTS_DATABASE_URL" -f db/schema.sql`).

create table if not exists messages (
  id bigint generated always as identity primary key,
  name text,
  location text,
  body text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  opened_count integer not null default 0,
  created_at timestamptz not null default now()
);

-- Speeds up "get one random approved message" and the admin pending queue.
create index if not exists messages_status_idx on messages (status);
