PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS car_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS cars (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL REFERENCES car_categories(id),
  price REAL NOT NULL CHECK (price >= 0),
  year INTEGER NOT NULL,
  mileage INTEGER NOT NULL DEFAULT 0 CHECK (mileage >= 0),
  fuel_type TEXT NOT NULL DEFAULT '',
  transmission TEXT NOT NULL DEFAULT '',
  engine TEXT NOT NULL DEFAULT '',
  horsepower INTEGER NOT NULL DEFAULT 0,
  color TEXT NOT NULL DEFAULT '',
  features_json TEXT NOT NULL DEFAULT '[]',
  description TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  images_json TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS spare_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS spares (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  part_number TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL REFERENCES spare_categories(id),
  condition TEXT NOT NULL CHECK (condition IN ('new', 'used')),
  grade TEXT,
  price REAL NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  description TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  images_json TEXT NOT NULL DEFAULT '[]',
  is_sample INTEGER NOT NULL DEFAULT 0 CHECK (is_sample IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS spare_compatibility (
  spare_id TEXT NOT NULL REFERENCES spares(id) ON DELETE CASCADE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year_from INTEGER NOT NULL,
  year_to INTEGER NOT NULL,
  PRIMARY KEY (spare_id, make, model, year_from, year_to),
  CHECK (year_to >= year_from)
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  fulfilment TEXT NOT NULL CHECK (fulfilment IN ('Delivery', 'Pickup')),
  status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'confirmed', 'fulfilled', 'cancelled')),
  total REAL NOT NULL CHECK (total >= 0),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  spare_id TEXT REFERENCES spares(id) ON DELETE SET NULL,
  spare_name TEXT NOT NULL,
  part_number TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price REAL NOT NULL CHECK (unit_price >= 0)
);

CREATE INDEX IF NOT EXISTS cars_category_idx ON cars(category);
CREATE INDEX IF NOT EXISTS spares_category_idx ON spares(category);
CREATE INDEX IF NOT EXISTS spare_fitment_idx ON spare_compatibility(make, model, year_from, year_to);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status, created_at);
