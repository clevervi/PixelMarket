-- ==================================================================================
-- LATIDO ANCESTRAL - BASE DE DATOS COMPLETA (MONOLITO + MARKETPLACE)
-- Fecha de consolidación: 2025
-- ==================================================================================

-- NOTA PARA SUPABASE
-- Este script está pensado para ejecutarse directamente sobre la base de datos
-- del proyecto de Supabase (generalmente llamada "postgres") usando el SQL Editor.
-- No crea la base de datos, solo el esquema y algunos datos de ejemplo.
-- Asegúrate de:
--   1) Ejecutarlo en el schema "public" (valor por defecto en Supabase).
--   2) Tener habilitadas las extensiones indicadas más abajo (Supabase las soporta).
--   3) Revisar o eliminar los datos de ejemplo (usuarios, productos, cupones)
--      si vas a trabajar con datos reales en producción.

-- ============================================
-- 1. CONFIGURACIÓN INICIAL Y EXTENSIONES
-- ============================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Configuración regional (opcional)
SET timezone = 'America/Bogota';

-- ============================================
-- 2. TIPOS ENUMERADOS (Consolidados)
-- ============================================

-- Se agrega 'provider' a los roles originales para soportar la lógica multi-vendor
CREATE TYPE user_role AS ENUM ('customer', 'admin', 'vendor', 'moderator', 'provider');

CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE payment_method_type AS ENUM ('card', 'paypal', 'transfer', 'cash_on_delivery', 'cryptocurrency');
CREATE TYPE notification_type AS ENUM ('order', 'shipping', 'promotion', 'review', 'system', 'vendor_application', 'vendor_approved');
CREATE TYPE notification_status AS ENUM ('unread', 'read', 'archived');
CREATE TYPE inventory_movement_type AS ENUM ('purchase', 'sale', 'return', 'adjustment', 'damaged', 'lost');
CREATE TYPE coupon_type AS ENUM ('percentage', 'fixed_amount', 'free_shipping');
CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'pending');

-- ============================================
-- 3. TABLAS BASE (Sistema Core)
-- ============================================

-- Roles y Permisos
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permisos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles_permisos (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permiso_id UUID REFERENCES permisos(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permiso_id)
);

-- Usuarios (Base + Campos Vendor preliminares)
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL, -- En inserts antiguos puede venir como 'nombre' completo, se ajustará
    phone VARCHAR(50),
    role user_role DEFAULT 'customer',
    
    -- Campos de estado y marketplace
    is_active BOOLEAN DEFAULT true,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
    vendor_id UUID, -- Se añade la FK más adelante al crear la tabla vendors
    
    email_verified BOOLEAN DEFAULT false,
    email_verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

CREATE TABLE usuarios_roles (
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id, role_id)
);

CREATE TABLE direcciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    full_name VARCHAR(200) NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    is_default BOOLEAN DEFAULT false,
    tipo VARCHAR(20), -- 'envio' o 'facturacion'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE metodos_pago (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    type payment_method_type NOT NULL,
    card_last_four VARCHAR(4),
    card_brand VARCHAR(50),
    expiry_date VARCHAR(7),
    paypal_email VARCHAR(255),
    bank_name VARCHAR(100),
    account_number_encrypted TEXT,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Catálogo
CREATE TABLE categorias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image VARCHAR(500),
    parent_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE etiquetas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. TABLAS MULTI-VENDOR (Marketplace)
-- ============================================

CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    logo VARCHAR(500),
    banner VARCHAR(500),
    owner_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'rejected')),
    commission_rate DECIMAL(5,2) DEFAULT 10.00 CHECK (commission_rate >= 0 AND commission_rate <= 100),
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    address JSONB,
    business_documents JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    approved_by UUID REFERENCES usuarios(id)
);

-- Ahora sí podemos conectar usuarios con vendors
ALTER TABLE usuarios ADD CONSTRAINT fk_usuarios_vendor_id 
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE SET NULL;

CREATE TABLE vendor_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    business_description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    business_address JSONB,
    documents JSONB,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'under_review')),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewed_by UUID REFERENCES usuarios(id),
    rejection_reason TEXT,
    notes TEXT
);

CREATE TABLE vendor_payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    orders_count INTEGER NOT NULL,
    period_start TIMESTAMP NOT NULL,
    period_end TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'failed')),
    payment_method VARCHAR(50),
    payment_reference VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_by UUID REFERENCES usuarios(id),
    processed_at TIMESTAMP
);

CREATE TABLE vendor_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    orders_count INTEGER DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0,
    commission_amount DECIMAL(10,2) DEFAULT 0,
    products_sold INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    unique_customers INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(vendor_id, date)
);

-- ============================================
-- 5. PRODUCTOS Y E-COMMERCE (Continuación)
-- ============================================

CREATE TABLE productos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    short_description VARCHAR(500),
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    cost_price DECIMAL(10, 2) CHECK (cost_price >= 0),
    category_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
    brand VARCHAR(100),
    material VARCHAR(100),
    featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    
    -- Gestión de Stock
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    sku VARCHAR(100) UNIQUE,
    
    -- Datos físicos
    weight DECIMAL(8, 2),
    dimensions VARCHAR(100),
    
    -- Métricas
    rating_average DECIMAL(3, 2) DEFAULT 0 CHECK (rating_average >= 0 AND rating_average <= 5),
    reviews_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    sales_count INTEGER DEFAULT 0,
    
    -- Datos Multi-Vendor
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'out_of_stock', 'discontinued')),
    created_by UUID REFERENCES usuarios(id),
    featured_by_admin BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE productos_etiquetas (
    producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
    etiqueta_id UUID REFERENCES etiquetas(id) ON DELETE CASCADE,
    PRIMARY KEY (producto_id, etiqueta_id)
);

CREATE TABLE imagenes_producto (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE variantes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
    size VARCHAR(50),
    color VARCHAR(50),
    material VARCHAR(100),
    model VARCHAR(100),
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    price_modifier DECIMAL(10, 2) DEFAULT 0,
    sku VARCHAR(100) UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventario (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
    variante_id UUID REFERENCES variantes(id) ON DELETE SET NULL,
    movement_type inventory_movement_type NOT NULL,
    quantity INTEGER NOT NULL,
    stock_before INTEGER NOT NULL,
    stock_after INTEGER NOT NULL,
    reference_id UUID,
    notes TEXT,
    created_by UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cupones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    type coupon_type NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL CHECK (discount_value >= 0),
    min_purchase_amount DECIMAL(10, 2) DEFAULT 0,
    max_discount_amount DECIMAL(10, 2),
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    usage_limit_per_user INTEGER DEFAULT 1,
    starts_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pedidos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status order_status DEFAULT 'pending',
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    tax DECIMAL(10, 2) DEFAULT 0 CHECK (tax >= 0),
    shipping_cost DECIMAL(10, 2) DEFAULT 0 CHECK (shipping_cost >= 0),
    discount_amount DECIMAL(10, 2) DEFAULT 0 CHECK (discount_amount >= 0),
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    cupon_id UUID REFERENCES cupones(id) ON DELETE SET NULL,
    direccion_id UUID REFERENCES direcciones(id) ON DELETE SET NULL,
    metodo_pago_id UUID REFERENCES metodos_pago(id) ON DELETE SET NULL,
    notes TEXT,
    invoice_url VARCHAR(500),
    
    -- Datos Multi-Vendor
    vendor_id UUID REFERENCES vendors(id),
    commission_amount DECIMAL(10,2) DEFAULT 0,
    admin_fee DECIMAL(10,2) DEFAULT 0,
    vendor_payout_status VARCHAR(20) DEFAULT 'pending' CHECK (vendor_payout_status IN ('pending', 'processing', 'paid', 'hold')),
    vendor_payout_date TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE detalle_pedido (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id UUID REFERENCES productos(id) ON DELETE SET NULL,
    variante_id UUID REFERENCES variantes(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pagos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    status payment_status DEFAULT 'pending',
    payment_method payment_method_type NOT NULL,
    transaction_id VARCHAR(255),
    external_reference VARCHAR(255),
    payment_gateway VARCHAR(100),
    currency VARCHAR(3) DEFAULT 'COP',
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE envios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
    direccion_id UUID REFERENCES direcciones(id) ON DELETE SET NULL,
    carrier_name VARCHAR(100),
    tracking_code VARCHAR(255),
    tracking_url VARCHAR(500),
    estimated_delivery_date DATE,
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reseñas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    pedido_id UUID REFERENCES pedidos(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200) NOT NULL,
    comment TEXT NOT NULL,
    verified_purchase BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    is_approved BOOLEAN DEFAULT false,
    approved_at TIMESTAMP,
    approved_by UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (producto_id, usuario_id, pedido_id)
);

CREATE TABLE multimedia_reseña (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reseña_id UUID REFERENCES reseñas(id) ON DELETE CASCADE,
    type VARCHAR(10) NOT NULL CHECK (type IN ('image', 'video')),
    url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE preguntas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT,
    answered_by UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    answered_at TIMESTAMP,
    helpful_count INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wishlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (usuario_id, producto_id)
);

-- ============================================
-- 6. SISTEMA (Notificaciones, Logs, Config)
-- ============================================

CREATE TABLE notificaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status notification_status DEFAULT 'unread',
    link VARCHAR(500),
    data JSONB, -- Añadido para extensibilidad del marketplace
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE suscripciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    status subscription_status DEFAULT 'active',
    token VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP
);

CREATE TABLE ventas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    period VARCHAR(20) NOT NULL, -- 'daily', 'monthly', 'yearly'
    total_orders INTEGER DEFAULT 0,
    total_revenue DECIMAL(12, 2) DEFAULT 0,
    total_products_sold INTEGER DEFAULT 0,
    average_order_value DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (date, period)
);

CREATE TABLE tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'access', 'refresh', 'email_verification', 'password_reset'
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT false,
    revoked_at TIMESTAMP,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE logs ( -- Audit Log general
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_log ( -- Audit Log específico Marketplace (si se desea mantener separado)
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES usuarios(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE backups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    backup_type VARCHAR(50),
    status VARCHAR(50) DEFAULT 'completed',
    created_by UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    restored_at TIMESTAMP
);

CREATE TABLE configuracion (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cupones_usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cupon_id UUID REFERENCES cupones(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    pedido_id UUID REFERENCES pedidos(id) ON DELETE SET NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 7. ÍNDICES
-- ============================================

-- Usuarios
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_role ON usuarios(role);
CREATE INDEX idx_usuarios_vendor ON usuarios(vendor_id);
CREATE INDEX idx_usuarios_status ON usuarios(status);

-- Vendors
CREATE INDEX idx_vendors_owner ON vendors(owner_id);
CREATE INDEX idx_vendors_slug ON vendors(slug);
CREATE INDEX idx_vendors_status ON vendors(status);

-- Productos
CREATE INDEX idx_productos_slug ON productos(slug);
CREATE INDEX idx_productos_category ON productos(category_id);
CREATE INDEX idx_productos_vendor ON productos(vendor_id);
CREATE INDEX idx_productos_featured ON productos(featured) WHERE featured = true;
CREATE INDEX idx_productos_active ON productos(is_active) WHERE is_active = true;

-- Pedidos
CREATE INDEX idx_pedidos_usuario ON pedidos(usuario_id);
CREATE INDEX idx_pedidos_vendor ON pedidos(vendor_id);
CREATE INDEX idx_pedidos_status ON pedidos(status);
CREATE INDEX idx_pedidos_number ON pedidos(order_number);

-- Otros
CREATE INDEX idx_reseñas_producto ON reseñas(producto_id);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);

-- ============================================
-- 8. FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger updated_at a tablas clave
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_productos_updated_at BEFORE UPDATE ON productos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pedidos_updated_at BEFORE UPDATE ON pedidos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendor_payouts_updated_at BEFORE UPDATE ON vendor_payouts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para actualizar el rating promedio
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE productos
    SET rating_average = (
        SELECT COALESCE(AVG(rating), 0)
        FROM reseñas
        WHERE producto_id = NEW.producto_id AND is_approved = true
    ),
    reviews_count = (
        SELECT COUNT(*)
        FROM reseñas
        WHERE producto_id = NEW.producto_id AND is_approved = true
    )
    WHERE id = NEW.producto_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_rating_on_review AFTER INSERT OR UPDATE ON reseñas
    FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- Función para generar número de pedido
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL THEN
        NEW.order_number := 'ORD-' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD') || '-' || LPAD(nextval('order_number_seq')::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE order_number_seq;
CREATE TRIGGER generate_order_number_trigger BEFORE INSERT ON pedidos
    FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Función para registrar movimientos de inventario
CREATE OR REPLACE FUNCTION register_inventory_movement()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO inventario (producto_id, variante_id, movement_type, quantity, stock_before, stock_after, reference_id)
    SELECT 
        NEW.producto_id,
        NEW.variante_id,
        'sale',
        -NEW.quantity,
        COALESCE((SELECT stock FROM variantes WHERE id = NEW.variante_id), (SELECT stock FROM productos WHERE id = NEW.producto_id)),
        COALESCE((SELECT stock FROM variantes WHERE id = NEW.variante_id), (SELECT stock FROM productos WHERE id = NEW.producto_id)) - NEW.quantity,
        NEW.pedido_id
    FROM detalle_pedido
    WHERE id = NEW.id;
    
    IF NEW.variante_id IS NOT NULL THEN
        UPDATE variantes SET stock = stock - NEW.quantity WHERE id = NEW.variante_id;
    ELSE
        UPDATE productos SET stock = stock - NEW.quantity WHERE id = NEW.producto_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER register_inventory_on_order AFTER INSERT ON detalle_pedido
    FOR EACH ROW EXECUTE FUNCTION register_inventory_movement();

-- ============================================
-- 9. DATOS DE SEMILLA (SEED DATA)
-- ============================================

-- Roles y Configuración
INSERT INTO roles (name, description) VALUES
('admin', 'Administrador con acceso completo'),
('vendor', 'Vendedor con acceso a gestión de productos'),
('moderator', 'Moderador de contenido y reseñas'),
('customer', 'Cliente estándar'),
('provider', 'Proveedor de servicios');

INSERT INTO configuracion (key, value, description) VALUES
('site_name', 'Latido Ancestral', 'Nombre del sitio web'),
('currency', 'COP', 'Moneda predeterminada'),
('tax_rate', '19', 'Tasa de impuesto en porcentaje (IVA)'),
('free_shipping_threshold', '100000', 'Monto mínimo para envío gratis');

-- Categorías
INSERT INTO categorias (name, slug, description, image, display_order) VALUES
('Sombreros', 'sombreros', 'Sombreros artesanales tradicionales', '/images/categories/sombreros.jpg', 1),
('Mochilas', 'mochilas', 'Mochilas tejidas a mano', '/images/categories/mochilas.jpg', 2),
('Joyería', 'joyeria', 'Accesorios artesanales', '/images/categories/joyeria.jpg', 3),
('Textiles', 'textiles', 'Ropa y telas', '/images/categories/textiles.jpg', 4),
('Decoración', 'decoracion', 'Hogar', '/images/categories/decoracion.jpg', 5);

-- Subcategorías
INSERT INTO categorias (name, slug, description, parent_id) 
SELECT 'Sombreros Vueltiao', 'sombreros-vueltiao', 'Sombrero Zenú', id FROM categorias WHERE slug = 'sombreros';

INSERT INTO categorias (name, slug, description, parent_id) 
SELECT 'Mochilas Wayuu', 'mochilas-wayuu', 'Mochila Wayuu', id FROM categorias WHERE slug = 'mochilas';

-- Usuarios Principales (Hardcoded IDs for reference)
-- Admin
INSERT INTO usuarios (id, first_name, last_name, email, password_hash, role, is_active, status, email_verified) VALUES 
('11111111-1111-1111-1111-111111111111', 'Admin', 'User', 'admin@latidoancestral.com', '$2a$10$YQ7VlZVGvXqJKdDQ1XKxJeX9qKqN5QnF.nF9qJ5pKdLqNF9qJ5pKd', 'admin', true, 'active', true);

-- Vendor Owner
INSERT INTO usuarios (id, first_name, last_name, email, password_hash, role, is_active, status, email_verified) VALUES 
('22222222-2222-2222-2222-222222222222', 'Carlos', 'Artesano', 'vendor@latidoancestral.com', '$2a$10$YQ7VlZVGvXqJKdDQ1XKxJeX9qKqN5QnF.nF9qJ5pKdLqNF9qJ5pKd', 'vendor', true, 'active', true);

-- Cliente
INSERT INTO usuarios (id, first_name, last_name, email, password_hash, role, is_active, status, email_verified) VALUES 
('33333333-3333-3333-3333-333333333333', 'María', 'Cliente', 'cliente@latidoancestral.com', '$2a$10$YQ7VlZVGvXqJKdDQ1XKxJeX9qKqN5QnF.nF9qJ5pKdLqNF9qJ5pKd', 'customer', true, 'active', true);

-- Crear Vendor (Tienda)
INSERT INTO vendors (id, business_name, slug, description, owner_id, status, commission_rate, contact_email, contact_phone, address, approved_at, approved_by)
VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Artesanías Ancestrales',
  'artesanias-ancestrales',
  'Tienda especializada en artesanías colombianas.',
  '22222222-2222-2222-2222-222222222222',
  'active',
  10.00,
  'vendor@latidoancestral.com',
  '+57 300 123 4567',
  '{"street": "Carrera 10 #20-30", "city": "Bogotá", "country": "Colombia"}',
  NOW(),
  '11111111-1111-1111-1111-111111111111'
);

-- Asignar usuario vendor a su tienda
UPDATE usuarios SET vendor_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' WHERE id = '22222222-2222-2222-2222-222222222222';

-- Etiquetas
INSERT INTO etiquetas (name, slug) VALUES ('Hecho a mano', 'hecho-a-mano'), ('Wayuu', 'wayuu'), ('Zenú', 'zenu');

-- Productos
INSERT INTO productos (name, slug, description, short_description, price, cost_price, category_id, brand, material, featured, stock, sku, weight, rating_average, reviews_count, vendor_id, created_by)
SELECT 
    'Sombrero Vueltiao Tradicional 19 Vueltas',
    'sombrero-vueltiao-tradicional-19',
    'Sombrero Vueltiao auténtico elaborado con fibras de caña flecha.',
    'Sombrero tradicional Zenú',
    150000,
    90000,
    c.id,
    'Artesanías Zenú',
    'Caña flecha',
    true,
    25,
    'SV-19-001',
    0.3,
    4.8,
    12,
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '22222222-2222-2222-2222-222222222222'
FROM categorias c WHERE c.slug = 'sombreros-vueltiao';

INSERT INTO productos (name, slug, description, short_description, price, cost_price, category_id, brand, material, featured, stock, sku, weight, rating_average, reviews_count, vendor_id, created_by)
SELECT 
    'Mochila Wayuu Tradicional',
    'mochila-wayuu-grande',
    'Mochila Wayuu auténtica tejida a mano.',
    'Mochila Wayuu tradicional',
    180000,
    110000,
    c.id,
    'Wayuu',
    'Algodón',
    true,
    30,
    'MW-GRD-001',
    0.4,
    4.9,
    25,
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '22222222-2222-2222-2222-222222222222'
FROM categorias c WHERE c.slug = 'mochilas-wayuu';

-- Cupones
INSERT INTO cupones (code, type, discount_value, min_purchase_amount, starts_at, expires_at)
VALUES ('BIENVENIDA10', 'percentage', 10, 50000, NOW(), NOW() + INTERVAL '90 days');

-- ============================================
-- 10. ROW LEVEL SECURITY (RLS) PARA SUPABASE (OPCIONAL)
-- ============================================

-- NOTA:
-- Estas políticas están pensadas para usarse cuando la aplicación se conecta a
-- través del cliente de Supabase (supabase-js) con JWT de usuario. Las
-- conexiones directas desde el backend usando el rol "postgres" (supersuario)
-- no se verán afectadas por RLS.
-- Si aún no vas a usar Supabase Auth + RLS puedes comentar o eliminar esta
-- sección antes de ejecutar el script.

-- Habilitar RLS en tablas clave
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cupones_usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.direcciones ENABLE ROW LEVEL SECURITY;

-- Usuarios: cada usuario ve/actualiza solo su propio perfil
CREATE POLICY "usuarios_all_service_role"
ON public.usuarios
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "usuarios_select_self"
ON public.usuarios
FOR SELECT
USING (id = auth.uid());

CREATE POLICY "usuarios_update_self"
ON public.usuarios
FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Wishlist: solo dueño puede ver/modificar
CREATE POLICY "wishlist_all_service_role"
ON public.wishlist
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "wishlist_select_own"
ON public.wishlist
FOR SELECT
USING (usuario_id = auth.uid());

CREATE POLICY "wishlist_insert_own"
ON public.wishlist
FOR INSERT
WITH CHECK (usuario_id = auth.uid());

CREATE POLICY "wishlist_delete_own"
ON public.wishlist
FOR DELETE
USING (usuario_id = auth.uid());

-- Direcciones: solo dueño puede ver/modificar
CREATE POLICY "direcciones_all_service_role"
ON public.direcciones
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "direcciones_select_own"
ON public.direcciones
FOR SELECT
USING (usuario_id = auth.uid());

CREATE POLICY "direcciones_insert_own"
ON public.direcciones
FOR INSERT
WITH CHECK (usuario_id = auth.uid());

CREATE POLICY "direcciones_update_own"
ON public.direcciones
FOR UPDATE
USING (usuario_id = auth.uid())
WITH CHECK (usuario_id = auth.uid());

CREATE POLICY "direcciones_delete_own"
ON public.direcciones
FOR DELETE
USING (usuario_id = auth.uid());

-- Pedidos: clientes solo ven sus propios pedidos (admin/service_role se maneja por backend)
CREATE POLICY "pedidos_all_service_role"
ON public.pedidos
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "pedidos_select_own"
ON public.pedidos
FOR SELECT
USING (usuario_id = auth.uid());

-- Cupones_usuarios: solo ver usos propios
CREATE POLICY "cupones_usuarios_all_service_role"
ON public.cupones_usuarios
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "cupones_usuarios_select_own"
ON public.cupones_usuarios
FOR SELECT
USING (usuario_id = auth.uid());

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
