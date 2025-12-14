import { Request } from 'express';

// ============================================
// EXTENSIÓN DE REQUEST
// ============================================

export interface RequestWithUser extends Request {
  user?: Usuario;
  body: any;
  params: Record<string, string>;
  query: Record<string, string | string[]>;
}

// ============================================
// ENUMS DE BASE DE DATOS
// ============================================

export type UserRole = 'customer' | 'admin' | 'vendor' | 'moderator' | 'provider';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'card' | 'paypal' | 'transfer' | 'cash_on_delivery' | 'cryptocurrency';
export type CouponType = 'percentage' | 'fixed_amount' | 'free_shipping';
export type NotificationType = 'order' | 'shipping' | 'promotion' | 'review' | 'system' | 'vendor_application' | 'vendor_approved';
export type NotificationStatus = 'unread' | 'read' | 'archived';
export type VendorStatus = 'pending' | 'active' | 'suspended' | 'rejected';
export type ProductStatus = 'active' | 'inactive' | 'out_of_stock' | 'discontinued';

// ============================================
// USUARIOS
// ============================================

export interface Usuario {
  id: string; // UUID
  email: string;
  password_hash?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role: UserRole;
  is_active: boolean;
  status: UserStatus;
  vendor_id?: string;
  email_verified: boolean;
  email_verified_at?: Date;
  created_at: Date;
  updated_at: Date;
  last_login?: Date;
}

export interface CreateUserDTO {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role?: UserRole;
}

export interface RegisterDTO {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface UpdateUserDTO {
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: Omit<Usuario, 'password_hash'>;
  message: string;
}

// ============================================
// DIRECCIONES
// ============================================

export interface Direccion {
  id: string;
  usuario_id: string;
  full_name: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  is_default: boolean;
  tipo?: string;
  created_at: Date;
  updated_at: Date;
}

// ============================================
// CATEGORÍAS
// ============================================

export interface Categoria {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent_id?: string;
  display_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// ============================================
// PRODUCTOS
// ============================================

export interface Variante {
  id: string;
  producto_id: string;
  size?: string;
  color?: string;
  material?: string;
  model?: string;
  stock: number;
  price_modifier: number;
  sku?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ImagenProducto {
  id: string;
  producto_id: string;
  url: string;
  alt_text?: string;
  display_order: number;
  is_primary: boolean;
  created_at: Date;
}

export interface Producto {
  id: string;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  price: number;
  cost_price?: number;
  category_id?: string;
  brand?: string;
  material?: string;
  featured: boolean;
  is_active: boolean;
  stock: number;
  sku?: string;
  weight?: number;
  dimensions?: string;
  rating_average: number;
  reviews_count: number;
  views_count: number;
  sales_count: number;
  vendor_id?: string;
  status: ProductStatus;
  created_by?: string;
  featured_by_admin: boolean;
  created_at: Date;
  updated_at: Date;
  // Relaciones
  variantes?: Variante[];
  imagenes?: ImagenProducto[];
  categoria?: Categoria;
}

export interface CreateProductDTO {
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  price: number;
  cost_price?: number;
  category_id?: string;
  brand?: string;
  material?: string;
  stock?: number;
  sku?: string;
  weight?: number;
  dimensions?: string;
  vendor_id?: string;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
  featured?: boolean;
  is_active?: boolean;
  status?: ProductStatus;
}

// ============================================
// VENDORS
// ============================================

export interface Vendor {
  id: string;
  business_name: string;
  slug: string;
  description?: string;
  logo?: string;
  banner?: string;
  owner_id: string;
  status: VendorStatus;
  commission_rate: number;
  contact_email: string;
  contact_phone?: string;
  address?: any;
  business_documents?: any;
  created_at: Date;
  updated_at: Date;
  approved_at?: Date;
  approved_by?: string;
}

// ============================================
// CUPONES
// ============================================

export interface Cupon {
  id: string;
  code: string;
  type: CouponType;
  discount_value: number;
  min_purchase_amount: number;
  max_discount_amount?: number;
  usage_limit?: number;
  usage_count: number;
  usage_limit_per_user: number;
  starts_at: Date;
  expires_at: Date;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// ============================================
// PEDIDOS
// ============================================

export interface DetallePedido {
  id: string;
  pedido_id: string;
  producto_id: string;
  variante_id?: string;
  product_name: string;
  product_sku?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: Date;
}

export interface Pedido {
  id: string;
  usuario_id: string;
  order_number: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  shipping_cost: number;
  discount_amount: number;
  total: number;
  cupon_id?: string;
  direccion_id?: string;
  metodo_pago_id?: string;
  notes?: string;
  invoice_url?: string;
  vendor_id?: string;
  commission_amount: number;
  admin_fee: number;
  vendor_payout_status: string;
  vendor_payout_date?: Date;
  created_at: Date;
  updated_at: Date;
  // Relaciones
  detalles?: DetallePedido[];
}

export interface CreateOrderDTO {
  usuario_id: string;
  items: Array<{
    producto_id: string;
    variante_id?: string;
    quantity: number;
    unit_price: number;
  }>;
  direccion_id: string;
  metodo_pago_id: string;
  cupon_id?: string;
  notes?: string;
}

export interface UpdateOrderStatusDTO {
  status: OrderStatus;
}

// ============================================
// PAGOS
// ============================================

export interface Pago {
  id: string;
  pedido_id: string;
  amount: number;
  status: PaymentStatus;
  payment_method: PaymentMethod;
  transaction_id?: string;
  external_reference?: string;
  payment_gateway?: string;
  currency: string;
  paid_at?: Date;
  created_at: Date;
  updated_at: Date;
}

// ============================================
// WISHLIST
// ============================================

export interface WishlistItem {
  id: string;
  usuario_id: string;
  producto_id: string;
  added_at: Date;
}

export interface AddToWishlistDTO {
  producto_id: string;
}

// ============================================
// RESEÑAS
// ============================================

export interface Reseña {
  id: string;
  producto_id: string;
  usuario_id: string;
  pedido_id?: string;
  rating: number;
  title?: string;
  comment?: string;
  verified_purchase: boolean;
  helpful_count: number;
  is_approved: boolean;
  approved_at?: Date;
  approved_by?: string;
  created_at: Date;
  updated_at: Date;
}

// ============================================
// NOTIFICACIONES
// ============================================

export interface Notificacion {
  id: string;
  usuario_id: string;
  type: NotificationType;
  title: string;
  message: string;
  status: NotificationStatus;
  link?: string;
  data?: any;
  read_at?: Date;
  created_at: Date;
}

// ============================================
// RESPUESTAS API
// ============================================

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
  status?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  skip?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  count: number;
  total: number;
  page: number;
  pages: number;
}

// ============================================
// CONFIG
// ============================================

export interface AppConfig {
  PORT: string | number;
  NODE_ENV: 'development' | 'production' | 'test';
  DATABASE_URL?: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  JWT_SECRET: string;
  JWT_EXPIRE: string;
  CORS_ORIGIN: string;
}
