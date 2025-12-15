-- Simulated analytics schema for Power BI
-- Project: Online store "Ancestral Heartbeat" (Colombian handicrafts)
-- Suggested engine: PostgreSQL (but the script is easy to adapt to other engines)

-- 1) DROP PREVIOUS TABLES (test environment only)
DROP TABLE IF EXISTS fact_sales CASCADE;
DROP TABLE IF EXISTS dim_product CASCADE;
DROP TABLE IF EXISTS dim_vendor CASCADE;
DROP TABLE IF EXISTS dim_category CASCADE;
DROP TABLE IF EXISTS dim_customer CASCADE;
DROP TABLE IF EXISTS dim_date CASCADE;

-- 2) DIMENSIONS

-- Date dimension: enables grouping by year, month, quarter, day of week, etc.
CREATE TABLE dim_date (
  date_id       SERIAL PRIMARY KEY,
  full_date     DATE UNIQUE NOT NULL,
  year          INT NOT NULL,
  quarter       INT NOT NULL,
  month         INT NOT NULL,
  month_name    VARCHAR(20) NOT NULL,
  day           INT NOT NULL,
  day_of_week   VARCHAR(20) NOT NULL
);

-- Customer dimension: describes the buyer profile
CREATE TABLE dim_customer (
  customer_id   SERIAL PRIMARY KEY,
  customer_code VARCHAR(20) NOT NULL,
  full_name     VARCHAR(120) NOT NULL,
  email         VARCHAR(120) NOT NULL,
  country       VARCHAR(80) NOT NULL,
  city          VARCHAR(80) NOT NULL,
segment       VARCHAR(40) NOT NULL  -- e.g.: "Local", "International", "Tourist"
);

-- Product category dimension
CREATE TABLE dim_category (
  category_id     SERIAL PRIMARY KEY,
  category_code   VARCHAR(20) NOT NULL,
  name            VARCHAR(80) NOT NULL,
  parent_category VARCHAR(80)
);

-- Artisan / vendor dimension
CREATE TABLE dim_vendor (
  vendor_id    SERIAL PRIMARY KEY,
  vendor_code  VARCHAR(20) NOT NULL,
  vendor_name  VARCHAR(120) NOT NULL,
  region       VARCHAR(80) NOT NULL,
  community    VARCHAR(120),
  fair_trade   BOOLEAN NOT NULL DEFAULT TRUE
);

-- Product dimension
CREATE TABLE dim_product (
  product_id    SERIAL PRIMARY KEY,
  product_code  VARCHAR(20) NOT NULL,
  product_name  VARCHAR(160) NOT NULL,
  category_id   INT REFERENCES dim_category(category_id),
  material      VARCHAR(80),
price_range   VARCHAR(40),   -- "Low", "Medium", "High"
  is_featured   BOOLEAN NOT NULL DEFAULT FALSE
);

-- 3) SALES FACT TABLE
-- Each row represents an order line (product x order)
CREATE TABLE fact_sales (
  sale_id         SERIAL PRIMARY KEY,
  order_number    VARCHAR(30) NOT NULL,
  order_date_id   INT NOT NULL REFERENCES dim_date(date_id),
  customer_id     INT NOT NULL REFERENCES dim_customer(customer_id),
  product_id      INT NOT NULL REFERENCES dim_product(product_id),
  vendor_id       INT NOT NULL REFERENCES dim_vendor(vendor_id),
  quantity        INT NOT NULL,
  unit_price      NUMERIC(12,2) NOT NULL,
  discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  shipping_cost   NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_amount    NUMERIC(12,2) NOT NULL,
payment_method  VARCHAR(40) NOT NULL, -- "Card", "Transfer", "Cash on delivery", etc.
  channel         VARCHAR(40) NOT NULL  -- "Web", "Marketplace", "Wholesale"
);

-- 4) LOAD SIMULATED DATA

-- 4.1 Dates
INSERT INTO dim_date (full_date, year, quarter, month, month_name, day, day_of_week) VALUES
  ('2025-01-10', 2025, 1, 1, 'Enero', 10, 'Viernes'),
  ('2025-01-15', 2025, 1, 1, 'Enero', 15, 'Miércoles'),
  ('2025-02-02', 2025, 1, 2, 'Febrero', 2,  'Domingo'),
  ('2025-03-20', 2025, 1, 3, 'Marzo',   20, 'Jueves');

-- 4.2 Customers
INSERT INTO dim_customer (customer_code, full_name, email, country, city, segment) VALUES
  ('CUST-001', 'María Gómez',   'maria.gomez@example.com',   'Colombia', 'Bogotá',   'Local'),
  ('CUST-002', 'John Smith',    'john.smith@example.com',    'Estados Unidos', 'New York', 'Internacional'),
  ('CUST-003', 'Ana Rodríguez', 'ana.rodriguez@example.com', 'Colombia', 'Medellín', 'Turista');

-- 4.3 Categories (aligned with the catalog: hats, bags, hammocks, decor)
INSERT INTO dim_category (category_code, name, parent_category) VALUES
  ('SOMB', 'Sombreros',      'Accesorios'),
  ('MOCH', 'Mochilas Wayuu', 'Accesorios'),
  ('HAMA', 'Hamacas',        'Hogar'),
  ('DECO', 'Decoración',     'Hogar');

-- 4.4 Vendors / artisans
INSERT INTO dim_vendor (vendor_code, vendor_name, region, community, fair_trade) VALUES
  ('VEND-001', 'Taller Wayuu El Camino', 'La Guajira', 'Comunidad Wayuu', TRUE),
  ('VEND-002', 'Tejidos del Caribe',     'Atlántico',  'Colectivo Artesanal', TRUE),
  ('VEND-003', 'Hamacas del Magdalena',  'Magdalena',  'Familia Artesana', TRUE),
  ('VEND-004', 'Cerámica Andina',        'Cundinamarca','Comunidad Andina', TRUE);

-- 4.5 Products (examples consistent with the project)
INSERT INTO dim_product (product_code, product_name, category_id, material, price_range, is_featured)
SELECT * FROM (
  VALUES
    ('PRD-001', 'Sombrero Vueltiao Tradicional',  (SELECT category_id FROM dim_category WHERE category_code = 'SOMB'), 'Caña flecha', 'Alto',  TRUE),
    ('PRD-002', 'Mochila Wayuu Multicolor',       (SELECT category_id FROM dim_category WHERE category_code = 'MOCH'), 'Hilo acrílico', 'Medio', TRUE),
    ('PRD-003', 'Hamaca Tejida Doble',            (SELECT category_id FROM dim_category WHERE category_code = 'HAMA'), 'Algodón', 'Alto', FALSE),
    ('PRD-004', 'Camino de Mesa Ancestral',       (SELECT category_id FROM dim_category WHERE category_code = 'DECO'), 'Algodón', 'Medio', FALSE),
    ('PRD-005', 'Mochila Wayuu Minimalista',      (SELECT category_id FROM dim_category WHERE category_code = 'MOCH'), 'Hilo acrílico', 'Bajo',  FALSE)
) AS t(product_code, product_name, category_id, material, price_range, is_featured);

-- 4.6 Simulated sales (fact_sales)
-- Note: we use subqueries to link to the dimension IDs.
INSERT INTO fact_sales (
  order_number, order_date_id, customer_id, product_id, vendor_id,
  quantity, unit_price, discount_amount, shipping_cost, total_amount,
  payment_method, channel
) VALUES
  -- Order 1: local customer buys a sombrero vueltiao
  (
    'ORD-1001',
    (SELECT date_id FROM dim_date WHERE full_date = '2025-01-10'),
    (SELECT customer_id FROM dim_customer WHERE customer_code = 'CUST-001'),
    (SELECT product_id FROM dim_product  WHERE product_code   = 'PRD-001'),
    (SELECT vendor_id  FROM dim_vendor   WHERE vendor_code    = 'VEND-002'),
    1, 180000, 0, 15000, 195000,
    'Tarjeta', 'Web'
  ),
  -- Order 2: international customer buys a bag and a hammock
  (
    'ORD-1002',
    (SELECT date_id FROM dim_date WHERE full_date = '2025-01-15'),
    (SELECT customer_id FROM dim_customer WHERE customer_code = 'CUST-002'),
    (SELECT product_id FROM dim_product  WHERE product_code   = 'PRD-002'),
    (SELECT vendor_id  FROM dim_vendor   WHERE vendor_code    = 'VEND-001'),
    2, 120000, 20000, 40000, 280000,
    'Tarjeta', 'Web'
  ),
  (
    'ORD-1002',
    (SELECT date_id FROM dim_date WHERE full_date = '2025-01-15'),
    (SELECT customer_id FROM dim_customer WHERE customer_code = 'CUST-002'),
    (SELECT product_id FROM dim_product  WHERE product_code   = 'PRD-003'),
    (SELECT vendor_id  FROM dim_vendor   WHERE vendor_code    = 'VEND-003'),
    1, 250000, 0, 60000, 310000,
    'Tarjeta', 'Web'
  ),
  -- Order 3: tourist customer buys decor
  (
    'ORD-1003',
    (SELECT date_id FROM dim_date WHERE full_date = '2025-02-02'),
    (SELECT customer_id FROM dim_customer WHERE customer_code = 'CUST-003'),
    (SELECT product_id FROM dim_product  WHERE product_code   = 'PRD-004'),
    (SELECT vendor_id  FROM dim_vendor   WHERE vendor_code    = 'VEND-004'),
    3, 80000, 0, 20000, 260000,
    'Efectivo', 'Marketplace'
  ),
  -- Order 4: local customer repeats purchase of an affordable bag
  (
    'ORD-1004',
    (SELECT date_id FROM dim_date WHERE full_date = '2025-03-20'),
    (SELECT customer_id FROM dim_customer WHERE customer_code = 'CUST-001'),
    (SELECT product_id FROM dim_product  WHERE product_code   = 'PRD-005'),
    (SELECT vendor_id  FROM dim_vendor   WHERE vendor_code    = 'VEND-001'),
    1, 65000, 5000, 10000, 70000,
    'Transferencia', 'Web'
  );

-- 5) POWER BI RECOMMENDATIONS
--
-- 1. Create a database (for example "tienda_virtual_analytics") in PostgreSQL.
-- 2. Run this full script.
-- 3. From Power BI Desktop, use the PostgreSQL connector and point it to that DB.
-- 4. Import the dim_* tables and fact_sales.
-- 5. Verify that Power BI automatically detects relationships (via the IDs),
--    or create them manually if needed.
-- 6. From there you can build metrics such as:
--    * Total sales by category, by product, or by artisan/vendor.
--    * Average ticket by customer segment.
--    * Sales by country/city and by channel.
--    * Sales evolution over time by month/quarter.
