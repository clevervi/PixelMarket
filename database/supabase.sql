-- =========================
-- INICIO DEL ESQUEMA
-- =========================

-- WARNING: Este esquema está diseñado para ejecución secuencial
-- El orden de creación es importante para evitar problemas de FK

-- Extensiones requeridas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================
-- ELIMINAR ESQUEMAS EXISTENTES (si es necesario)
-- =========================
DROP SCHEMA IF EXISTS auth CASCADE;
DROP SCHEMA IF EXISTS storage CASCADE;
DROP SCHEMA IF EXISTS vault CASCADE;

-- Crear esquemas
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS storage;
CREATE SCHEMA IF NOT EXISTS vault;

-- =========================
-- TIPOS ENUMERADOS (ENUMS) - Crear primero
-- =========================

-- Enums para auth schema
CREATE TYPE auth.aal_level AS ENUM ('aal1','aal2','aal3');
CREATE TYPE auth.factor_type AS ENUM ('totp','webauthn','phone');
CREATE TYPE auth.factor_status AS ENUM ('unverified','verified');
CREATE TYPE auth.code_challenge_method AS ENUM ('s256','plain');
CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token','reauthentication_token','recovery_token',
    'email_change_token_new','email_change_token_current','phone_change_token'
);
CREATE TYPE auth.oauth_registration_type AS ENUM ('dynamic','manual');
CREATE TYPE auth.oauth_client_type AS ENUM ('public','confidential');
CREATE TYPE auth.oauth_response_type AS ENUM ('code');
CREATE TYPE auth.oauth_authorization_status AS ENUM ('pending','approved','denied','expired');

-- Enums para storage schema
CREATE TYPE storage.buckettype AS ENUM ('STANDARD','ANALYTICS','VECTOR');

-- Enums para public schema
CREATE TYPE public.user_role AS ENUM ('customer','admin','vendor','moderator','provider');
CREATE TYPE public.payment_method_type AS ENUM ('card','paypal','transfer','cash_on_delivery','cryptocurrency');
CREATE TYPE public.inventory_movement_type AS ENUM ('purchase','sale','return','adjustment','damaged','lost');
CREATE TYPE public.coupon_type AS ENUM ('percentage','fixed_amount','free_shipping');
CREATE TYPE public.order_status AS ENUM ('pending','processing','shipped','delivered','cancelled','refunded');
CREATE TYPE public.payment_status AS ENUM ('pending','completed','failed','refunded');
CREATE TYPE public.notification_type AS ENUM ('order','shipping','promotion','review','system','vendor_application','vendor_approved');
CREATE TYPE public.notification_status AS ENUM ('unread','read','archived');
CREATE TYPE public.subscription_status AS ENUM ('active','inactive','pending');

-- =========================
-- SCHEMA: auth
-- =========================

-- Tablas sin dependencias
CREATE TABLE auth.schema_migrations (
    version character varying PRIMARY KEY
);

CREATE TABLE auth.instances (
    id uuid PRIMARY KEY,
    uuid uuid,
    raw_base_config text,
    created_at timestamptz,
    updated_at timestamptz
);

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid PRIMARY KEY,
    payload json,
    created_at timestamptz,
    ip_address character varying DEFAULT ''::character varying
);

-- Tabla principal de usuarios
CREATE TABLE auth.users (
    instance_id uuid,
    id uuid PRIMARY KEY,
    aud character varying,
    role character varying,
    email character varying,
    encrypted_password character varying,
    email_confirmed_at timestamptz,
    invited_at timestamptz,
    confirmation_token character varying,
    confirmation_sent_at timestamptz,
    recovery_token character varying,
    recovery_sent_at timestamptz,
    email_change_token_new character varying,
    email_change character varying,
    email_change_sent_at timestamptz,
    last_sign_in_at timestamptz,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamptz,
    updated_at timestamptz,
    phone text UNIQUE DEFAULT NULL::character varying,
    phone_confirmed_at timestamptz,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying DEFAULT ''::character varying,
    phone_change_sent_at timestamptz,
    confirmed_at timestamptz GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0 CHECK (email_change_confirm_status >= 0 AND email_change_confirm_status <= 2),
    banned_until timestamptz,
    reauthentication_token character varying DEFAULT ''::character varying,
    reauthentication_sent_at timestamptz,
    is_sso_user boolean DEFAULT false,
    deleted_at timestamptz,
    is_anonymous boolean DEFAULT false
);

-- Tablas que dependen de auth.users
CREATE SEQUENCE IF NOT EXISTS auth.refresh_tokens_id_seq;

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint PRIMARY KEY DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass),
    token character varying UNIQUE,
    user_id character varying,
    revoked boolean,
    created_at timestamptz,
    updated_at timestamptz,
    parent character varying,
    session_id uuid
);

CREATE TABLE auth.identities (
    provider_id text,
    user_id uuid,
    identity_data jsonb,
    provider text,
    last_sign_in_at timestamptz,
    created_at timestamptz,
    updated_at timestamptz,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid PRIMARY KEY DEFAULT gen_random_uuid()
);

CREATE TABLE auth.sessions (
    id uuid PRIMARY KEY,
    user_id uuid,
    created_at timestamptz,
    updated_at timestamptz,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamptz,
    refreshed_at timestamp,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid,
    refresh_token_hmac_key text,
    refresh_token_counter bigint,
    scopes text CHECK (char_length(scopes) <= 4096)
);

CREATE TABLE auth.mfa_factors (
    id uuid PRIMARY KEY,
    user_id uuid,
    friendly_name text,
    factor_type auth.factor_type,
    status auth.factor_status,
    created_at timestamptz,
    updated_at timestamptz,
    secret text,
    phone text,
    last_challenged_at timestamptz UNIQUE,
    web_authn_credential jsonb,
    web_authn_aaguid uuid,
    last_webauthn_challenge_data jsonb
);

-- Tablas de MFA y SSO
CREATE TABLE auth.mfa_challenges (
    id uuid PRIMARY KEY,
    factor_id uuid,
    created_at timestamptz,
    verified_at timestamptz,
    ip_address inet,
    otp_code text,
    web_authn_session_data jsonb
);

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid,
    created_at timestamptz,
    updated_at timestamptz,
    authentication_method text,
    id uuid PRIMARY KEY
);

CREATE TABLE auth.sso_providers (
    id uuid PRIMARY KEY,
    resource_id text CHECK (resource_id = NULL::text OR char_length(resource_id) > 0),
    created_at timestamptz,
    updated_at timestamptz,
    disabled boolean
);

CREATE TABLE auth.sso_domains (
    id uuid PRIMARY KEY,
    sso_provider_id uuid,
    domain text CHECK (char_length(domain) > 0),
    created_at timestamptz,
    updated_at timestamptz
);

CREATE TABLE auth.saml_providers (
    id uuid PRIMARY KEY,
    sso_provider_id uuid,
    entity_id text UNIQUE CHECK (char_length(entity_id) > 0),
    metadata_xml text CHECK (char_length(metadata_xml) > 0),
    metadata_url text CHECK (metadata_url = NULL::text OR char_length(metadata_url) > 0),
    attribute_mapping jsonb,
    created_at timestamptz,
    updated_at timestamptz,
    name_id_format text
);

CREATE TABLE auth.saml_relay_states (
    id uuid PRIMARY KEY,
    sso_provider_id uuid,
    request_id text CHECK (char_length(request_id) > 0),
    for_email text,
    redirect_to text,
    created_at timestamptz,
    updated_at timestamptz,
    flow_state_id uuid
);

CREATE TABLE auth.flow_state (
    id uuid PRIMARY KEY,
    user_id uuid,
    auth_code text,
    code_challenge_method auth.code_challenge_method,
    code_challenge text,
    provider_type text,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamptz,
    updated_at timestamptz,
    authentication_method text,
    auth_code_issued_at timestamptz
);

CREATE TABLE auth.one_time_tokens (
    id uuid PRIMARY KEY,
    user_id uuid,
    token_type auth.one_time_token_type,
    token_hash text CHECK (char_length(token_hash) > 0),
    relates_to text,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

-- Tablas OAuth
CREATE TABLE auth.oauth_clients (
    id uuid PRIMARY KEY,
    client_secret_hash text,
    registration_type auth.oauth_registration_type,
    redirect_uris text,
    grant_types text,
    client_name text CHECK (char_length(client_name) <= 1024),
    client_uri text CHECK (char_length(client_uri) <= 2048),
    logo_uri text CHECK (char_length(logo_uri) <= 2048),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    deleted_at timestamptz,
    client_type auth.oauth_client_type DEFAULT 'confidential'::auth.oauth_client_type
);

CREATE TABLE auth.oauth_authorizations (
    id uuid PRIMARY KEY,
    authorization_id text UNIQUE,
    client_id uuid,
    user_id uuid,
    redirect_uri text CHECK (char_length(redirect_uri) <= 2048),
    scope text CHECK (char_length(scope) <= 4096),
    state text CHECK (char_length(state) <= 4096),
    resource text CHECK (char_length(resource) <= 2048),
    code_challenge text CHECK (char_length(code_challenge) <= 128),
    code_challenge_method auth.code_challenge_method,
    response_type auth.oauth_response_type DEFAULT 'code'::auth.oauth_response_type,
    status auth.oauth_authorization_status DEFAULT 'pending'::auth.oauth_authorization_status,
    authorization_code text UNIQUE CHECK (char_length(authorization_code) <= 255),
    created_at timestamptz DEFAULT now(),
    expires_at timestamptz DEFAULT (now() + '00:03:00'::interval),
    approved_at timestamptz,
    nonce text CHECK (char_length(nonce) <= 255)
);

CREATE TABLE auth.oauth_consents (
    id uuid PRIMARY KEY,
    user_id uuid,
    client_id uuid,
    scopes text CHECK (char_length(scopes) <= 2048),
    granted_at timestamptz DEFAULT now(),
    revoked_at timestamptz
);

CREATE TABLE auth.oauth_client_states (
    id uuid PRIMARY KEY,
    provider_type text,
    code_verifier text,
    created_at timestamptz
);

-- =========================
-- SCHEMA: storage
-- =========================

CREATE TABLE storage.migrations (
    id integer PRIMARY KEY,
    name character varying UNIQUE,
    hash character varying,
    executed_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE storage.buckets (
    id text PRIMARY KEY,
    name text,
    owner uuid,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype
);

CREATE TABLE storage.objects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    last_accessed_at timestamptz DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb,
    level integer
);

CREATE TABLE storage.s3_multipart_uploads (
    id text PRIMARY KEY,
    in_progress_size bigint DEFAULT 0,
    upload_signature text,
    bucket_id text,
    key text,
    version text,
    owner_id text,
    created_at timestamptz DEFAULT now(),
    user_metadata jsonb
);

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    upload_id text,
    size bigint DEFAULT 0,
    part_number integer,
    bucket_id text,
    key text,
    etag text,
    owner_id text,
    version text,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE storage.prefixes (
    bucket_id text,
    name text,
    level integer GENERATED ALWAYS AS (storage.get_level(name)) STORED,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    PRIMARY KEY (bucket_id, name, level)
);

CREATE TABLE storage.buckets_analytics (
    name text,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype,
    format text DEFAULT 'ICEBERG'::text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    deleted_at timestamptz
);

CREATE TABLE storage.buckets_vectors (
    id text PRIMARY KEY,
    type storage.buckettype DEFAULT 'VECTOR'::storage.buckettype,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE storage.vector_indexes (
    id text DEFAULT gen_random_uuid() PRIMARY KEY,
    name text,
    bucket_id text,
    data_type text,
    dimension integer,
    distance_metric text,
    metadata_configuration jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- =========================
-- SCHEMA: vault
-- =========================

CREATE TABLE vault.secrets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text,
    description text DEFAULT ''::text,
    secret text,
    key_id uuid,
    nonce bytea DEFAULT vault.crypto_aead_det_noncegen(),
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- SCHEMA: public - Tablas básicas primero
-- =========================

-- Tablas básicas (sin dependencias externas)
CREATE TABLE public.roles (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name character varying UNIQUE,
    description text,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.permisos (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name character varying UNIQUE,
    description text,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.etiquetas (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name character varying UNIQUE,
    slug character varying UNIQUE,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.configuracion (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    key character varying NOT NULL UNIQUE,
    value text NOT NULL,
    description text,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de categorías (tiene auto-referencia)
CREATE TABLE public.categorias (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name character varying UNIQUE,
    slug character varying UNIQUE,
    description text,
    image character varying,
    parent_id uuid,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Ahora agregar la FK después de crear la tabla
ALTER TABLE public.categorias 
ADD CONSTRAINT categorias_parent_id_fkey 
FOREIGN KEY (parent_id) REFERENCES public.categorias(id);

-- Tabla principal de usuarios (public)
CREATE TABLE public.usuarios (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email character varying UNIQUE,
    password_hash character varying,
    first_name character varying,
    last_name character varying,
    phone character varying,
    role user_role DEFAULT 'customer'::user_role,
    is_active boolean DEFAULT true,
    status character varying DEFAULT 'active'::character varying CHECK (status::text = ANY (ARRAY['active'::character varying, 'inactive'::character varying, 'suspended'::character varying, 'pending'::character varying]::text[])),
    vendor_id uuid,
    email_verified boolean DEFAULT false,
    email_verified_at timestamp,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    last_login timestamp
);

-- Tablas de relaciones de usuarios
CREATE TABLE public.roles_permisos (
    role_id uuid,
    permiso_id uuid,
    PRIMARY KEY (role_id, permiso_id),
    CONSTRAINT roles_permisos_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id),
    CONSTRAINT roles_permisos_permiso_id_fkey FOREIGN KEY (permiso_id) REFERENCES public.permisos(id)
);

CREATE TABLE public.usuarios_roles (
    usuario_id uuid,
    role_id uuid,
    assigned_at timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id, role_id),
    CONSTRAINT usuarios_roles_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id),
    CONSTRAINT usuarios_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id)
);

-- Tablas de direcciones y métodos de pago
CREATE TABLE public.direcciones (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id uuid,
    full_name character varying,
    street character varying,
    city character varying,
    state character varying,
    postal_code character varying,
    country character varying,
    phone character varying,
    is_default boolean DEFAULT false,
    tipo character varying,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT direcciones_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id)
);

CREATE TABLE public.metodos_pago (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id uuid,
    type payment_method_type,
    card_last_four character varying,
    card_brand character varying,
    expiry_date character varying,
    paypal_email character varying,
    bank_name character varying,
    account_number_encrypted text,
    is_default boolean DEFAULT false,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT metodos_pago_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id)
);

-- Tabla de cupones
CREATE TABLE public.cupones (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    code character varying UNIQUE,
    type coupon_type,
    discount_value numeric CHECK (discount_value >= 0::numeric),
    min_purchase_amount numeric DEFAULT 0,
    max_discount_amount numeric,
    usage_limit integer,
    usage_count integer DEFAULT 0,
    usage_limit_per_user integer DEFAULT 1,
    starts_at timestamp NOT NULL,
    expires_at timestamp NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Tablas de suscripciones
CREATE TABLE public.suscripciones (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email character varying UNIQUE,
    status subscription_status DEFAULT 'active'::subscription_status,
    token character varying UNIQUE,
    subscribed_at timestamp DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at timestamp
);

-- Tablas de vendedores
CREATE TABLE public.vendors (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name character varying,
    slug character varying UNIQUE,
    description text,
    logo character varying,
    banner character varying,
    owner_id uuid,
    status character varying DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'active'::character varying, 'suspended'::character varying, 'rejected'::character varying]::text[])),
    commission_rate numeric DEFAULT 10.00 CHECK (commission_rate >= 0::numeric AND commission_rate <= 100::numeric),
    contact_email character varying,
    contact_phone character varying,
    address jsonb,
    business_documents jsonb,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    approved_at timestamp,
    approved_by uuid,
    CONSTRAINT vendors_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.usuarios(id),
    CONSTRAINT vendors_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.usuarios(id)
);

-- Ahora agregar la FK de usuarios a vendors
ALTER TABLE public.usuarios 
ADD CONSTRAINT fk_usuarios_vendor_id 
FOREIGN KEY (vendor_id) REFERENCES public.vendors(id);

-- Continuar con tablas relacionadas con vendors
CREATE TABLE public.vendor_applications (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid,
    business_name character varying,
    business_description text,
    contact_email character varying,
    contact_phone character varying,
    business_address jsonb,
    documents jsonb,
    status character varying DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying, 'under_review'::character varying]::text[])),
    submitted_at timestamp DEFAULT CURRENT_TIMESTAMP,
    reviewed_at timestamp,
    reviewed_by uuid,
    rejection_reason text,
    notes text,
    CONSTRAINT vendor_applications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.usuarios(id),
    CONSTRAINT vendor_applications_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.usuarios(id)
);

CREATE TABLE public.vendor_analytics (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id uuid,
    date date,
    orders_count integer DEFAULT 0,
    revenue numeric DEFAULT 0,
    commission_amount numeric DEFAULT 0,
    products_sold integer DEFAULT 0,
    views integer DEFAULT 0,
    unique_customers integer DEFAULT 0,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT vendor_analytics_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id)
);

CREATE TABLE public.vendor_payouts (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id uuid,
    amount numeric,
    commission_amount numeric,
    orders_count integer,
    period_start timestamp,
    period_end timestamp,
    status character varying DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'processing'::character varying, 'paid'::character varying, 'failed'::character varying]::text[])),
    payment_method character varying,
    payment_reference character varying,
    notes text,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    processed_by uuid,
    processed_at timestamp,
    CONSTRAINT vendor_payouts_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id),
    CONSTRAINT vendor_payouts_processed_by_fkey FOREIGN KEY (processed_by) REFERENCES public.usuarios(id)
);

-- Tablas de productos
CREATE TABLE public.productos (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name character varying,
    slug character varying UNIQUE,
    description text,
    short_description character varying,
    price numeric CHECK (price >= 0::numeric),
    cost_price numeric CHECK (cost_price >= 0::numeric),
    category_id uuid,
    brand character varying,
    material character varying,
    featured boolean DEFAULT false,
    is_active boolean DEFAULT true,
    stock integer DEFAULT 0 CHECK (stock >= 0),
    sku character varying UNIQUE,
    weight numeric,
    dimensions character varying,
    rating_average numeric DEFAULT 0 CHECK (rating_average >= 0::numeric AND rating_average <= 5::numeric),
    reviews_count integer DEFAULT 0,
    views_count integer DEFAULT 0,
    sales_count integer DEFAULT 0,
    vendor_id uuid,
    status character varying DEFAULT 'active'::character varying CHECK (status::text = ANY (ARRAY['active'::character varying, 'inactive'::character varying, 'out_of_stock'::character varying, 'discontinued'::character varying]::text[])),
    created_by uuid,
    featured_by_admin boolean DEFAULT false,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT productos_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categorias(id),
    CONSTRAINT productos_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id),
    CONSTRAINT productos_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.usuarios(id)
);

CREATE TABLE public.variantes (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    producto_id uuid,
    size character varying,
    color character varying,
    material character varying,
    model character varying,
    stock integer DEFAULT 0 CHECK (stock >= 0),
    price_modifier numeric DEFAULT 0,
    sku character varying UNIQUE,
    is_active boolean DEFAULT true,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT variantes_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id)
);

CREATE TABLE public.imagenes_producto (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    producto_id uuid,
    url character varying NOT NULL,
    alt_text character varying,
    display_order integer DEFAULT 0,
    is_primary boolean DEFAULT false,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT imagenes_producto_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id)
);

CREATE TABLE public.productos_etiquetas (
    producto_id uuid,
    etiqueta_id uuid,
    PRIMARY KEY (producto_id, etiqueta_id),
    CONSTRAINT productos_etiquetas_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id),
    CONSTRAINT productos_etiquetas_etiqueta_id_fkey FOREIGN KEY (etiqueta_id) REFERENCES public.etiquetas(id)
);

-- Tablas de pedidos
CREATE TABLE public.pedidos (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id uuid,
    order_number character varying UNIQUE,
    status order_status DEFAULT 'pending'::order_status,
    subtotal numeric CHECK (subtotal >= 0::numeric),
    tax numeric DEFAULT 0 CHECK (tax >= 0::numeric),
    shipping_cost numeric DEFAULT 0 CHECK (shipping_cost >= 0::numeric),
    discount_amount numeric DEFAULT 0 CHECK (discount_amount >= 0::numeric),
    total numeric CHECK (total >= 0::numeric),
    cupon_id uuid,
    direccion_id uuid,
    metodo_pago_id uuid,
    notes text,
    invoice_url character varying,
    vendor_id uuid,
    commission_amount numeric DEFAULT 0,
    admin_fee numeric DEFAULT 0,
    vendor_payout_status character varying DEFAULT 'pending'::character varying CHECK (vendor_payout_status::text = ANY (ARRAY['pending'::character varying, 'processing'::character varying, 'paid'::character varying, 'hold'::character varying]::text[])),
    vendor_payout_date timestamp,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pedidos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id),
    CONSTRAINT pedidos_cupon_id_fkey FOREIGN KEY (cupon_id) REFERENCES public.cupones(id),
    CONSTRAINT pedidos_direccion_id_fkey FOREIGN KEY (direccion_id) REFERENCES public.direcciones(id),
    CONSTRAINT pedidos_metodo_pago_id_fkey FOREIGN KEY (metodo_pago_id) REFERENCES public.metodos_pago(id),
    CONSTRAINT pedidos_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id)
);

-- Tablas que dependen de pedidos
CREATE TABLE public.detalle_pedido (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    pedido_id uuid,
    producto_id uuid,
    variante_id uuid,
    product_name character varying,
    product_sku character varying,
    quantity integer CHECK (quantity > 0),
    unit_price numeric CHECK (unit_price >= 0::numeric),
    subtotal numeric CHECK (subtotal >= 0::numeric),
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT detalle_pedido_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES public.pedidos(id),
    CONSTRAINT detalle_pedido_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id),
    CONSTRAINT detalle_pedido_variante_id_fkey FOREIGN KEY (variante_id) REFERENCES public.variantes(id)
);

CREATE TABLE public.envios (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    pedido_id uuid,
    direccion_id uuid,
    carrier_name character varying,
    tracking_code character varying,
    tracking_url character varying,
    estimated_delivery_date date,
    shipped_at timestamp,
    delivered_at timestamp,
    notes text,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT envios_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES public.pedidos(id),
    CONSTRAINT envios_direccion_id_fkey FOREIGN KEY (direccion_id) REFERENCES public.direcciones(id)
);

CREATE TABLE public.pagos (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    pedido_id uuid,
    amount numeric CHECK (amount >= 0::numeric),
    status payment_status DEFAULT 'pending'::payment_status,
    payment_method payment_method_type,
    transaction_id character varying,
    external_reference character varying,
    payment_gateway character varying,
    currency character varying DEFAULT 'COP'::character varying,
    paid_at timestamp,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pagos_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES public.pedidos(id)
);

-- Tablas adicionales que dependen de pedidos/productos
CREATE TABLE public.cupones_usuarios (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    cupon_id uuid,
    usuario_id uuid,
    pedido_id uuid,
    used_at timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT cupones_usuarios_cupon_id_fkey FOREIGN KEY (cupon_id) REFERENCES public.cupones(id),
    CONSTRAINT cupones_usuarios_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id),
    CONSTRAINT cupones_usuarios_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES public.pedidos(id)
);

CREATE TABLE public.wishlist (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id uuid,
    producto_id uuid,
    added_at timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT wishlist_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id),
    CONSTRAINT wishlist_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id)
);

-- Tablas de contenido y reseñas
CREATE TABLE public.reseñas (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    producto_id uuid,
    usuario_id uuid,
    pedido_id uuid,
    rating integer CHECK (rating >= 1 AND rating <= 5),
    title character varying,
    comment text,
    verified_purchase boolean DEFAULT false,
    helpful_count integer DEFAULT 0,
    is_approved boolean DEFAULT false,
    approved_at timestamp,
    approved_by uuid,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reseñas_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id),
    CONSTRAINT reseñas_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id),
    CONSTRAINT reseñas_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES public.pedidos(id),
    CONSTRAINT reseñas_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.usuarios(id)
);

CREATE TABLE public.multimedia_reseña (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    reseña_id uuid,
    type character varying CHECK (type::text = ANY (ARRAY['image'::character varying, 'video'::character varying]::text[])),
    url character varying,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT multimedia_reseña_reseña_id_fkey FOREIGN KEY (reseña_id) REFERENCES public.reseñas(id)
);

CREATE TABLE public.preguntas (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    producto_id uuid,
    usuario_id uuid,
    question text,
    answer text,
    answered_by uuid,
    answered_at timestamp,
    helpful_count integer DEFAULT 0,
    is_public boolean DEFAULT true,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT preguntas_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id),
    CONSTRAINT preguntas_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id),
    CONSTRAINT preguntas_answered_by_fkey FOREIGN KEY (answered_by) REFERENCES public.usuarios(id)
);

-- Tablas de inventario
CREATE TABLE public.inventario (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    producto_id uuid,
    variante_id uuid,
    movement_type inventory_movement_type,
    quantity integer,
    stock_before integer,
    stock_after integer,
    reference_id uuid,
    notes text,
    created_by uuid,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT inventario_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id),
    CONSTRAINT inventario_variante_id_fkey FOREIGN KEY (variante_id) REFERENCES public.variantes(id),
    CONSTRAINT inventario_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.usuarios(id)
);

-- Tablas de notificaciones
CREATE TABLE public.notificaciones (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id uuid,
    type notification_type,
    title character varying,
    message text,
    status notification_status DEFAULT 'unread'::notification_status,
    link character varying,
    data jsonb,
    read_at timestamp,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT notificaciones_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id)
);

-- Tablas de logs y auditoría
CREATE TABLE public.logs (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id uuid,
    action character varying,
    entity_type character varying,
    entity_id uuid,
    old_values jsonb,
    new_values jsonb,
    ip_address inet,
    user_agent text,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT logs_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id)
);

CREATE TABLE public.audit_log (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid,
    action character varying,
    entity_type character varying,
    entity_id uuid,
    old_values jsonb,
    new_values jsonb,
    ip_address character varying,
    user_agent text,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT audit_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.usuarios(id)
);

-- Tablas de backups
CREATE TABLE public.backups (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename character varying,
    file_path character varying,
    file_size bigint,
    backup_type character varying,
    status character varying DEFAULT 'completed'::character varying,
    created_by uuid,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    restored_at timestamp,
    CONSTRAINT backups_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.usuarios(id)
);

-- Tablas de análisis
CREATE TABLE public.ventas (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    date date,
    period character varying,
    total_orders integer DEFAULT 0,
    total_revenue numeric DEFAULT 0,
    total_products_sold integer DEFAULT 0,
    average_order_value numeric DEFAULT 0,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- ÍNDICES PARA MEJORAR EL RENDIMIENTO
-- =========================

-- Índices para usuarios
CREATE INDEX idx_usuarios_email ON public.usuarios(email);
CREATE INDEX idx_usuarios_vendor_id ON public.usuarios(vendor_id);
CREATE INDEX idx_usuarios_role ON public.usuarios(role);
CREATE INDEX idx_usuarios_status ON public.usuarios(status);

-- Índices para productos
CREATE INDEX idx_productos_category_id ON public.productos(category_id);
CREATE INDEX idx_productos_vendor_id ON public.productos(vendor_id);
CREATE INDEX idx_productos_slug ON public.productos(slug);
CREATE INDEX idx_productos_status ON public.productos(status);
CREATE INDEX idx_productos_created_by ON public.productos(created_by);
CREATE INDEX idx_productos_price ON public.productos(price);
CREATE INDEX idx_productos_is_active ON public.productos(is_active);

-- Índices para variantes
CREATE INDEX idx_variantes_producto_id ON public.variantes(producto_id);
CREATE INDEX idx_variantes_sku ON public.variantes(sku);
CREATE INDEX idx_variantes_is_active ON public.variantes(is_active);

-- Índices para pedidos
CREATE INDEX idx_pedidos_usuario_id ON public.pedidos(usuario_id);
CREATE INDEX idx_pedidos_status ON public.pedidos(status);
CREATE INDEX idx_pedidos_order_number ON public.pedidos(order_number);
CREATE INDEX idx_pedidos_vendor_id ON public.pedidos(vendor_id);
CREATE INDEX idx_pedidos_created_at ON public.pedidos(created_at);

-- Índices para detalle_pedido
CREATE INDEX idx_detalle_pedido_pedido_id ON public.detalle_pedido(pedido_id);
CREATE INDEX idx_detalle_pedido_producto_id ON public.detalle_pedido(producto_id);

-- Índices para pagos
CREATE INDEX idx_pagos_pedido_id ON public.pagos(pedido_id);
CREATE INDEX idx_pagos_status ON public.pagos(status);
CREATE INDEX idx_pagos_created_at ON public.pagos(created_at);

-- Índices para reseñas
CREATE INDEX idx_reseñas_producto_id ON public.reseñas(producto_id);
CREATE INDEX idx_reseñas_usuario_id ON public.reseñas(usuario_id);
CREATE INDEX idx_reseñas_rating ON public.reseñas(rating);
CREATE INDEX idx_reseñas_is_approved ON public.reseñas(is_approved);

-- Índices para inventario
CREATE INDEX idx_inventario_producto_id ON public.inventario(producto_id);
CREATE INDEX idx_inventario_variante_id ON public.inventario(variante_id);
CREATE INDEX idx_inventario_movement_type ON public.inventario(movement_type);
CREATE INDEX idx_inventario_created_at ON public.inventario(created_at);

-- Índices para notificaciones
CREATE INDEX idx_notificaciones_usuario_id ON public.notificaciones(usuario_id);
CREATE INDEX idx_notificaciones_status ON public.notificaciones(status);
CREATE INDEX idx_notificaciones_created_at ON public.notificaciones(created_at);
CREATE INDEX idx_notificaciones_usuario_id_status ON public.notificaciones(usuario_id, status);

-- Índices para logs
CREATE INDEX idx_logs_usuario_id ON public.logs(usuario_id);
CREATE INDEX idx_logs_created_at ON public.logs(created_at);
CREATE INDEX idx_logs_action ON public.logs(action);

-- Índices para cupones
CREATE INDEX idx_cupones_code ON public.cupones(code);
CREATE INDEX idx_cupones_is_active ON public.cupones(is_active);
CREATE INDEX idx_cupones_expires_at ON public.cupones(expires_at);

-- Índices para vendors
CREATE INDEX idx_vendors_owner_id ON public.vendors(owner_id);
CREATE INDEX idx_vendors_status ON public.vendors(status);
CREATE INDEX idx_vendors_slug ON public.vendors(slug);

-- Índices para categorías
CREATE INDEX idx_categorias_parent_id ON public.categorias(parent_id);
CREATE INDEX idx_categorias_slug ON public.categorias(slug);
CREATE INDEX idx_categorias_is_active ON public.categorias(is_active);

-- =========================
-- FIN DEL ESQUEMA
-- =========================