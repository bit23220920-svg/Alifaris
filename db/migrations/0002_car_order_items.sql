PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS car_order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  car_id TEXT REFERENCES cars(id) ON DELETE SET NULL,
  car_name TEXT NOT NULL,
  brand TEXT NOT NULL,
  model_year INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity = 1),
  unit_price REAL NOT NULL CHECK (unit_price >= 0)
);

CREATE INDEX IF NOT EXISTS car_order_items_order_idx ON car_order_items(order_id);
