-- UniPass Initial Schema
-- All prices stored in EUR cents (integer)

-- ============================================
-- Extensions
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ============================================
-- Categories
-- ============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  product_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);

-- ============================================
-- Products
-- ============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  short_description TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price > 0),
  original_price INTEGER CHECK (original_price IS NULL OR original_price > price),
  university TEXT NOT NULL,
  professor TEXT,
  academic_year TEXT,
  pages INTEGER,
  format TEXT NOT NULL DEFAULT 'pdf',
  file_path TEXT,
  preview_image TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  average_rating NUMERIC(2,1) NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  download_count INTEGER NOT NULL DEFAULT 0,
  search_vector TSVECTOR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_search ON products USING GIN(search_vector);

-- Full-text search vector (Italian configuration)
CREATE OR REPLACE FUNCTION products_search_vector_update() RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('italian', COALESCE(unaccent(NEW.name), '')), 'A') ||
    setweight(to_tsvector('italian', COALESCE(unaccent(NEW.short_description), '')), 'B') ||
    setweight(to_tsvector('italian', COALESCE(unaccent(NEW.university), '')), 'B') ||
    setweight(to_tsvector('italian', COALESCE(unaccent(NEW.description), '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_search_vector
  BEFORE INSERT OR UPDATE OF name, short_description, university, description
  ON products
  FOR EACH ROW
  EXECUTE FUNCTION products_search_vector_update();

-- ============================================
-- Orders
-- ============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_session_id TEXT NOT NULL UNIQUE,
  stripe_payment_intent_id TEXT,
  customer_email TEXT NOT NULL,
  total INTEGER NOT NULL CHECK (total > 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_orders_stripe_session ON orders(stripe_session_id);

-- ============================================
-- Order Items
-- ============================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  price INTEGER NOT NULL CHECK (price > 0),
  product_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ============================================
-- Reviews
-- ============================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(order_id, product_id)
);

CREATE INDEX idx_reviews_product ON reviews(product_id) WHERE is_approved = TRUE;

-- Auto-update product average_rating
CREATE OR REPLACE FUNCTION update_product_rating() RETURNS TRIGGER AS $$
BEGIN
  UPDATE products SET
    average_rating = COALESCE((
      SELECT ROUND(AVG(rating)::numeric, 1)
      FROM reviews
      WHERE product_id = COALESCE(NEW.product_id, OLD.product_id) AND is_approved = TRUE
    ), 0),
    review_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE product_id = COALESCE(NEW.product_id, OLD.product_id) AND is_approved = TRUE
    )
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_product_rating
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_product_rating();

-- ============================================
-- Download Tokens
-- ============================================
CREATE TABLE download_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  token TEXT NOT NULL UNIQUE,
  download_count INTEGER NOT NULL DEFAULT 0,
  max_downloads INTEGER NOT NULL DEFAULT 5,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_download_tokens_token ON download_tokens(token);

-- ============================================
-- Auto-update updated_at trigger
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- Auto-update category product_count
-- ============================================
CREATE OR REPLACE FUNCTION update_category_product_count() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE categories SET product_count = (
      SELECT COUNT(*) FROM products WHERE category_id = NEW.category_id AND is_active = TRUE
    ) WHERE id = NEW.category_id;
  END IF;
  IF TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND OLD.category_id != NEW.category_id) THEN
    UPDATE categories SET product_count = (
      SELECT COUNT(*) FROM products WHERE category_id = OLD.category_id AND is_active = TRUE
    ) WHERE id = OLD.category_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_category_count
  AFTER INSERT OR UPDATE OR DELETE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_category_product_count();

-- ============================================
-- Row Level Security
-- ============================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_tokens ENABLE ROW LEVEL SECURITY;

-- Public read access: categories
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT USING (true);

-- Public read access: active products
CREATE POLICY "Active products are viewable by everyone"
  ON products FOR SELECT USING (is_active = true);

-- Public read access: approved reviews
CREATE POLICY "Approved reviews are viewable by everyone"
  ON reviews FOR SELECT USING (is_approved = true);

-- Orders, order_items, download_tokens: no public access (service role only)
-- No SELECT policies = blocked for anon/authenticated, accessible via service role

-- ============================================
-- Storage Buckets (run via Supabase dashboard or API)
-- ============================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('previews', 'previews', true);
