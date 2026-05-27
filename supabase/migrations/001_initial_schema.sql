-- =====================================================
-- Hüda-i Şifa — İlk Veritabanı Şeması
-- Supabase SQL Editor'de çalıştırın
-- =====================================================

-- UUID uzantısı
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- 1. ÜRÜNLER
-- ─────────────────────────────────────────────
create table if not exists products (
  id              uuid primary key default uuid_generate_v4(),
  slug            text unique not null,
  name_key        text not null,
  desc_key        text not null,
  brand           text not null,
  amount          text not null,
  price           numeric(10,2) not null,
  original_price  numeric(10,2),
  badge           text check (badge in ('expert','bestseller','new')),
  category        text not null,
  rating          numeric(3,2) default 5.0,
  review_count    int default 0,
  stock           int default 0,
  ingredients_key text not null,
  usage_key       text not null,
  expert_note_key text,
  active          boolean default true,
  created_at      timestamptz default now()
);

-- ─────────────────────────────────────────────
-- 2. KULLANICILARIN SİPARİŞLERİ
-- ─────────────────────────────────────────────
create table if not exists orders (
  id               uuid primary key default uuid_generate_v4(),
  order_number     text unique not null,
  user_id          uuid references auth.users(id) on delete set null,
  guest_email      text,
  status           text not null default 'pending'
                    check (status in ('pending','processing','shipped','delivered','cancelled')),
  total            numeric(10,2) not null,
  discount         numeric(10,2) default 0,
  coupon_code      text,
  shipping_name    text not null,
  shipping_address text not null,
  shipping_city    text not null,
  shipping_phone   text not null,
  items            jsonb not null default '[]',
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- Sipariş güncellenince updated_at otomatik güncelle
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

-- ─────────────────────────────────────────────
-- 3. YORUMLAR
-- ─────────────────────────────────────────────
create table if not exists reviews (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid references products(id) on delete cascade,
  user_id     uuid references auth.users(id) on delete set null,
  order_id    uuid references orders(id) on delete set null,
  author      text not null,
  rating      int not null check (rating between 1 and 5),
  title       text not null,
  body        text not null,
  verified    boolean default false,
  approved    boolean default false,
  created_at  timestamptz default now()
);

-- Yorum onaylandığında ürünün rating/review_count'ını güncelle
create or replace function refresh_product_rating()
returns trigger language plpgsql as $$
begin
  update products set
    rating       = (select round(avg(rating)::numeric, 2) from reviews where product_id = new.product_id and approved = true),
    review_count = (select count(*) from reviews where product_id = new.product_id and approved = true)
  where id = new.product_id;
  return new;
end;
$$;

create trigger reviews_refresh_rating
  after insert or update on reviews
  for each row execute function refresh_product_rating();

-- ─────────────────────────────────────────────
-- 4. BÜLTEN ABONELERİ
-- ─────────────────────────────────────────────
create table if not exists subscribers (
  id         uuid primary key default uuid_generate_v4(),
  email      text unique not null,
  source     text default 'footer' check (source in ('footer','checkout','popup','other')),
  active     boolean default true,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────────
-- 5. KUPON KODLARI
-- ─────────────────────────────────────────────
create table if not exists coupons (
  id          uuid primary key default uuid_generate_v4(),
  code        text unique not null,
  discount    numeric(10,2) not null,
  type        text not null check (type in ('pct','flat')),
  min_cart    numeric(10,2) default 0,
  max_uses    int,
  used_count  int default 0,
  active      boolean default true,
  expires_at  timestamptz,
  created_at  timestamptz default now()
);

-- Varsayılan kuponlar
insert into coupons (code, discount, type, min_cart) values
  ('HOSGELDIN10', 10, 'pct', 0),
  ('SAGLIK50',    50, 'flat', 200),
  ('YENI20',      20, 'pct', 0)
on conflict (code) do nothing;

-- ─────────────────────────────────────────────
-- 6. ROW LEVEL SECURITY
-- ─────────────────────────────────────────────

-- Products: herkes okuyabilir, sadece service role yazabilir
alter table products enable row level security;
create policy "products_select" on products for select using (active = true);

-- Orders: kullanıcı sadece kendi siparişini görür
alter table orders enable row level security;
create policy "orders_select_own" on orders for select
  using (auth.uid() = user_id or guest_email = auth.jwt() ->> 'email');
create policy "orders_insert" on orders for insert with check (true);

-- Reviews: onaylananları herkes görür
alter table reviews enable row level security;
create policy "reviews_select" on reviews for select using (approved = true);
create policy "reviews_insert" on reviews for insert with check (true);

-- Subscribers: sadece service role
alter table subscribers enable row level security;
create policy "subscribers_insert" on subscribers for insert with check (true);

-- Coupons: sadece service role okur/yazar (RLS ile kapatıldı)
alter table coupons enable row level security;
