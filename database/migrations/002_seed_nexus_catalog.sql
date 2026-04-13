-- SEED NEXUS CATALOG
-- High-tech developer assets for the PixelMarket Nexus rebrand

-- 1. Insert Categories
INSERT INTO public.categories (id, name, slug, description, image_url)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Nexus Ops', 'nexus-ops', 'Infrastructure & Security modules for high-scale environments.', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=2000&auto=format&fit=crop'),
  ('22222222-2222-2222-2222-222222222222', 'Developer Kits', 'dev-kits', 'Pre-configured hardware and SDK bundles for extreme productivity.', 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=2000&auto=format&fit=crop'),
  ('33333333-3333-3333-3333-333333333333', 'Logic Suites', 'logic-suites', 'Advanced script libraries and AI-driven automation tools.', 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=2000&auto=format&fit=crop')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Products
INSERT INTO public.products (id, name, slug, description, price, category_id, is_featured_admin)
VALUES 
  ('44444444-4444-4444-4444-444444444444', 'Nexus Core V1', 'nexus-core-v1', 'The fundamental operating layer for PixelMarket Nexus. Ultra-low latency kernel.', 299, '11111111-1111-1111-1111-111111111111', true),
  ('55555555-5555-5555-5555-555555555555', 'Void SDK', 'void-sdk', 'Zero-layer networking toolkit for senior-level integrations.', 150, '22222222-2222-2222-2222-222222222222', true),
  ('66666666-6666-6666-6666-666666666666', 'Antigravity Logic', 'antigravity-logic', 'Parallel processing suite for complex agentic workflows.', 450, '33333333-3333-3333-3333-333333333333', false),
  ('77777777-7777-7777-7777-777777777777', 'Titan Dev-Box', 'titan-hardware', '64-core local processing unit optimized for PixelMarket Nexus.', 1200, '22222222-2222-2222-2222-222222222222', true)
ON CONFLICT (id) DO NOTHING;
