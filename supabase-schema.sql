-- feelaura-hub database schema
-- Run this once in the Supabase SQL editor (Dashboard → SQL Editor → New query).

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_ref text unique not null,
  clerk_user_id text,
  customer_name text not null,
  email text not null,
  phone text,
  address text not null,
  city text not null,
  pincode text not null,
  delivery_date date not null,
  gift_message text,
  items jsonb not null,
  subtotal integer not null,
  delivery_fee integer not null,
  total integer not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create index if not exists orders_user_idx on orders (clerk_user_id);
create index if not exists orders_created_idx on orders (created_at desc);

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

-- Lock the database completely from browsers: RLS on, zero public policies.
-- Only the server (service-role key) can read or write.
alter table orders enable row level security;
alter table newsletter_subscribers enable row level security;
