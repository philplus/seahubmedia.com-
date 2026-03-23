-- GMV1 Creators schema extension (v0.1)

CREATE TABLE IF NOT EXISTS creators (
  id TEXT PRIMARY KEY,              -- internal creator id (uuid/slug)
  creator_platform_id TEXT,         -- platform creator id if available
  handle TEXT,
  name TEXT,
  whatsapp_number TEXT,             -- saved for outreach (manual entry/import)
  category_lv1_id TEXT,
  category_lv1_name TEXT,
  category_lv2_id TEXT,
  category_lv2_name TEXT,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT
);

-- Daily creator performance (seller center / brand creators)
CREATE TABLE IF NOT EXISTS creator_daily (
  store_id TEXT NOT NULL,
  day TEXT NOT NULL,                -- YYYY-MM-DD (WIB)
  creator_id TEXT NOT NULL,
  creator_gmv REAL NOT NULL,        -- platform definition
  creator_orders INTEGER,
  creator_aov REAL,
  returns_amount REAL,
  returns_rate REAL,
  commission_amount REAL,
  commission_rate REAL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT,
  PRIMARY KEY (store_id, day, creator_id),
  FOREIGN KEY (store_id) REFERENCES stores(id),
  FOREIGN KEY (creator_id) REFERENCES creators(id)
);

-- Creator x product contribution (Top products per creator/day)
CREATE TABLE IF NOT EXISTS creator_products_daily (
  store_id TEXT NOT NULL,
  day TEXT NOT NULL,
  creator_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT,
  units INTEGER,
  creator_gmv REAL,
  rank INTEGER,
  PRIMARY KEY (store_id, day, creator_id, product_id),
  FOREIGN KEY (store_id) REFERENCES stores(id),
  FOREIGN KEY (creator_id) REFERENCES creators(id)
);

-- Outreach CRM (WhatsApp)
CREATE TABLE IF NOT EXISTS creator_outreach (
  creator_id TEXT PRIMARY KEY,
  outreach_status TEXT NOT NULL DEFAULT 'uncontacted',
  last_contacted_at TEXT,
  next_followup_at TEXT,
  owner TEXT,
  notes TEXT,
  updated_at TEXT,
  FOREIGN KEY (creator_id) REFERENCES creators(id)
);
