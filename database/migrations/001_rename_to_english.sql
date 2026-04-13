-- ========================================================
-- MIGRATION: 001_rename_to_english.sql
-- DESCRIPTION: Rename all Spanish tables, columns, and enums
--              to English for the PixelMarket project.
-- ========================================================

BEGIN;

-- 1. RENAME TABLES (Public Schema)
ALTER TABLE IF EXISTS public.usuarios RENAME TO users;
ALTER TABLE IF EXISTS public.categorias RENAME TO categories;
ALTER TABLE IF EXISTS public.productos RENAME TO products;
ALTER TABLE IF EXISTS public.variantes RENAME TO variants;
ALTER TABLE IF EXISTS public.imagenes_producto RENAME TO product_images;
ALTER TABLE IF EXISTS public.etiquetas RENAME TO tags;
ALTER TABLE IF EXISTS public.productos_etiquetas RENAME TO product_tags;
ALTER TABLE IF EXISTS public.pedidos RENAME TO orders;
ALTER TABLE IF EXISTS public.detalle_pedido RENAME TO order_items;
ALTER TABLE IF EXISTS public.envios RENAME TO shipments;
ALTER TABLE IF EXISTS public.cupones RENAME TO coupons;
ALTER TABLE IF EXISTS public.cupones_usuarios RENAME TO coupon_users;
ALTER TABLE IF EXISTS public.direcciones RENAME TO addresses;
ALTER TABLE IF EXISTS public.metodos_pago RENAME TO payment_methods;
ALTER TABLE IF EXISTS public.suscripciones RENAME TO subscriptions;
ALTER TABLE IF EXISTS public.permisos RENAME TO permissions;
ALTER TABLE IF EXISTS public.roles_permisos RENAME TO roles_permissions;
ALTER TABLE IF EXISTS public.usuarios_roles RENAME TO user_roles;
ALTER TABLE IF EXISTS public.configuracion RENAME TO configuration;
ALTER TABLE IF EXISTS public.reseñas RENAME TO reviews;
ALTER TABLE IF EXISTS public.multimedia_reseña RENAME TO review_multimedia;
ALTER TABLE IF EXISTS public.preguntas RENAME TO questions;
ALTER TABLE IF EXISTS public.inventario RENAME TO inventory;
ALTER TABLE IF EXISTS public.notificaciones RENAME TO notifications;
ALTER TABLE IF EXISTS public.pagos RENAME TO payments;
ALTER TABLE IF EXISTS public.ventas RENAME TO sales;

-- 2. RENAME COLUMNS (Incremental check)

-- users
-- identity renames removed

-- categories
ALTER TABLE IF EXISTS public.categories RENAME COLUMN image TO image_url;

-- products
ALTER TABLE IF EXISTS public.products RENAME COLUMN featured_by_admin TO is_featured_admin;

-- orders & order_items
ALTER TABLE IF EXISTS public.orders RENAME COLUMN usuario_id TO user_id;
ALTER TABLE IF EXISTS public.orders RENAME COLUMN cupon_id TO coupon_id;
ALTER TABLE IF EXISTS public.orders RENAME COLUMN direccion_id TO address_id;
ALTER TABLE IF EXISTS public.orders RENAME COLUMN metodo_pago_id TO payment_method_id;

ALTER TABLE IF EXISTS public.order_items RENAME COLUMN pedido_id TO order_id;
ALTER TABLE IF EXISTS public.order_items RENAME COLUMN producto_id TO product_id;
ALTER TABLE IF EXISTS public.order_items RENAME COLUMN variante_id TO variant_id;

-- shipments
ALTER TABLE IF EXISTS public.shipments RENAME COLUMN pedido_id TO order_id;
ALTER TABLE IF EXISTS public.shipments RENAME COLUMN direccion_id TO address_id;

-- payments
ALTER TABLE IF EXISTS public.payments RENAME COLUMN pedido_id TO order_id;

-- wishlist
ALTER TABLE IF EXISTS public.wishlist RENAME COLUMN usuario_id TO user_id;
ALTER TABLE IF EXISTS public.wishlist RENAME COLUMN producto_id TO product_id;

-- reviews
ALTER TABLE IF EXISTS public.reviews RENAME COLUMN producto_id TO product_id;
ALTER TABLE IF EXISTS public.reviews RENAME COLUMN usuario_id TO user_id;
ALTER TABLE IF EXISTS public.reviews RENAME COLUMN pedido_id TO order_id;

-- variants
ALTER TABLE IF EXISTS public.variants RENAME COLUMN producto_id TO product_id;

-- inventory
ALTER TABLE IF EXISTS public.inventory RENAME COLUMN producto_id TO product_id;
ALTER TABLE IF EXISTS public.inventory RENAME COLUMN variante_id TO variant_id;

-- notifications
ALTER TABLE IF EXISTS public.notifications RENAME COLUMN usuario_id TO user_id;

-- addresses
ALTER TABLE IF EXISTS public.addresses RENAME COLUMN usuario_id TO user_id;
ALTER TABLE IF EXISTS public.addresses RENAME COLUMN tipo TO address_type;

-- payment_methods
ALTER TABLE IF EXISTS public.payment_methods RENAME COLUMN usuario_id TO user_id;

-- user_roles
ALTER TABLE IF EXISTS public.user_roles RENAME COLUMN usuario_id TO user_id;

-- coupon_users
ALTER TABLE IF EXISTS public.coupon_users RENAME COLUMN cupon_id TO coupon_id;
ALTER TABLE IF EXISTS public.coupon_users RENAME COLUMN usuario_id TO user_id;
ALTER TABLE IF EXISTS public.coupon_users RENAME COLUMN pedido_id TO order_id;

-- 3. RENAME INDEXES (Postgres renaming indexes)
ALTER INDEX IF EXISTS public.idx_usuarios_email RENAME TO idx_users_email;
ALTER INDEX IF EXISTS public.idx_usuarios_role RENAME TO idx_users_role;
ALTER INDEX IF EXISTS public.idx_productos_slug RENAME TO idx_products_slug;
ALTER INDEX IF EXISTS public.idx_pedidos_status RENAME TO idx_orders_status;
-- ... more indexes could be renamed but these are the main ones.

COMMIT;
