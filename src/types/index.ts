// Variantes de producto
export interface ProductVariant {
  id: string;
  size?: string;        // Talla (S, M, L, XL, etc.)
  color?: string;       // Color
  material?: string;    // Material
  model?: string;       // Modelo
  stock: number;        // Stock disponible
  priceModifier?: number; // Modificador de precio (+/- cantidad)
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[];    // Múltiples imágenes
  category: string;
  color?: string;
  featured?: boolean;
  brand?: string;       // Marca
  material?: string;    // Material
  variants?: ProductVariant[]; // Variantes disponibles
  tags?: string[];      // Tags para búsqueda
  rating?: number;      // Calificación promedio
  reviewsCount?: number; // Cantidad de reseñas
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

// Carrito de compras
export interface CartItem {
  product: Product;
  quantity: number;
  variant?: ProductVariant;
}

// Dirección
export interface Address {
  id: string;
  type?: 'shipping' | 'billing';
  firstName?: string;
  lastName?: string;
  fullName?: string;
  address?: string;
  street?: string;
  city: string;
  state: string;
  zipCode?: string;
  postalCode?: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

// Método de pago
export type PaymentMethodType = 'card' | 'paypal' | 'transfer' | 'cash_on_delivery';

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  cardLastFour?: string;
  cardBrand?: string;
  expiryDate?: string;
  paypalEmail?: string;
  bankName?: string;
  accountNumber?: string;
  isDefault?: boolean;
}

// Estado de pedido
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// Item de pedido
export interface OrderItem {
  product: Product;
  quantity: number;
  variant?: ProductVariant;
  price: number; // Precio al momento de la compra
}

// Pedido
export interface Order {
  id: string;
  userId?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  discount?: number;
  couponCode?: string;
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: PaymentMethod;
  createdAt: string | Date;
  updatedAt?: string | Date;
  invoiceUrl?: string;
}

// Usuario
export interface User {
  id: string;
  name?: string;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  addresses?: Address[];
  paymentMethods?: PaymentMethod[];
  wishlist?: string[]; // IDs de productos
  orders?: Order[];
  createdAt: string | Date;
}

// Filtros de búsqueda
export interface SearchFilters {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  color?: string;
  material?: string;
  tags?: string[];
  sortBy?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest' | 'rating';
}

// Reseñas
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  images?: string[]; // URLs de imágenes subidas
  videos?: string[]; // URLs de videos subidos
  verifiedPurchase: boolean;
  helpful: number; // Contador de "útil"
  createdAt: string | Date;
  updatedAt?: string | Date;
}

// Preguntas y Respuestas
export interface Question {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  question: string;
  answer?: string;
  answeredBy?: string;
  answeredAt?: string | Date;
  helpful: number;
  createdAt: string | Date;
}

// Tema
export type Theme = 'light' | 'dark';

// Idioma
export type Language = 'es' | 'en';

// Moneda
export type Currency = 'COP' | 'USD';

export interface I18nConfig {
  language: Language;
  currency: Currency;
}
