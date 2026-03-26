-- GMV1 SQLite schema (v0.1)

-- 1) 基础维度
CREATE TABLE IF NOT EXISTS stores (
  id TEXT PRIMARY KEY,            -- internal store id (uuid or slug)
  name TEXT NOT NULL,
  entity_name TEXT,               -- legal entity
  platform TEXT NOT NULL,         -- tiktok_shop, shopee, etc
  platform_shop_id TEXT,          -- shop_id / seller_id
  timezone TEXT DEFAULT 'Asia/Jakarta',
  currency TEXT,                  -- platform currency if known
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT (datetime('now'))
);

-- 2) 原始拉取（可选：先不存全量，v0.1 以日聚合为主）
CREATE TABLE IF NOT EXISTS raw_orders (
  store_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  created_at TEXT NOT NULL,       -- ISO8601
  status TEXT,
  gross_amount REAL,
  net_amount REAL,                -- if provided
  currency TEXT,
  raw_json TEXT,                  -- store full payload if needed
  PRIMARY KEY (store_id, order_id),
  FOREIGN KEY (store_id) REFERENCES stores(id)
);

CREATE TABLE IF NOT EXISTS raw_returns (
  store_id TEXT NOT NULL,
  return_id TEXT NOT NULL,
  order_id TEXT,
  created_at TEXT NOT NULL,
  amount REAL,
  currency TEXT,
  reason TEXT,
  raw_json TEXT,
  PRIMARY KEY (store_id, return_id),
  FOREIGN KEY (store_id) REFERENCES stores(id)
);

CREATE TABLE IF NOT EXISTS raw_product_sales (
  store_id TEXT NOT NULL,
  day TEXT NOT NULL,              -- YYYY-MM-DD (WIB)
  product_id TEXT NOT NULL,
  product_name TEXT,
  units INTEGER,
  gross_amount REAL,
  net_amount REAL,
  currency TEXT,
  raw_json TEXT,
  PRIMARY KEY (store_id, day, product_id),
  FOREIGN KEY (store_id) REFERENCES stores(id)
);

-- 3) 日聚合指标（日报核心）
CREATE TABLE IF NOT EXISTS orders_daily (
  store_id TEXT NOT NULL,
  day TEXT NOT NULL,
  orders_created INTEGER NOT NULL,
  gmv_net REAL NOT NULL,          -- net sales after returns (platform definition)
  currency TEXT,
  aov REAL,                       -- average order value
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT,
  PRIMARY KEY (store_id, day),
  FOREIGN KEY (store_id) REFERENCES stores(id)
);

CREATE TABLE IF NOT EXISTS returns_daily (
  store_id TEXT NOT NULL,
  day TEXT NOT NULL,
  returns_amount REAL NOT NULL,
  returns_count INTEGER,
  returns_rate REAL,              -- returns_amount / gmv_gross or / gmv_net (define later)
  currency TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT,
  PRIMARY KEY (store_id, day),
  FOREIGN KEY (store_id) REFERENCES stores(id)
);

CREATE TABLE IF NOT EXISTS products_daily (
  store_id TEXT NOT NULL,
  day TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT,
  units INTEGER,
  gmv_net REAL,
  currency TEXT,
  rank INTEGER,                   -- rank within store/day
  PRIMARY KEY (store_id, day, product_id),
  FOREIGN KEY (store_id) REFERENCES stores(id)
);

-- 4) 达人表现（Seller Center，可后续接入）
-- See: CREATOR_SCHEMA.sql

-- 5) 广告日表（可后续接入）
CREATE TABLE IF NOT EXISTS ads_daily (
  store_id TEXT NOT NULL,
  day TEXT NOT NULL,
  platform TEXT NOT NULL,         -- tiktok_ads/meta/google
  account_id TEXT,
  campaign_id TEXT,
  campaign_name TEXT,
  spend REAL,
  impressions INTEGER,
  clicks INTEGER,
  ctr REAL,
  cpc REAL,
  conversions INTEGER,
  revenue_attrib REAL,
  roas REAL,
  currency TEXT,
  PRIMARY KEY (store_id, day, platform, COALESCE(campaign_id,'_'))
);

-- 5) 运行日志
CREATE TABLE IF NOT EXISTS runs (
  id TEXT PRIMARY KEY,
  job TEXT NOT NULL,              -- backfill / daily
  started_at TEXT NOT NULL,
  finished_at TEXT,
  status TEXT NOT NULL,           -- ok / error
  message TEXT,
  stats_json TEXT
);
