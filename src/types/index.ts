// Product variants
export interface ProductVariant {
  id: string;
  size?: string;        // Size (S, M, L, XL, etc.)
  color?: string;       // Color
  material?: string;    // Material
  model?: string;       // Model
  stock: number;        // Available stock
  priceModifier?: number; // Price modifier (+/- amount)
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[];    // Multiple images
  category: string;
  color?: string;
  featured?: boolean;
  brand?: string;       // Brand
  material?: string;    // Material
  variants?: ProductVariant[]; // Available variants
  tags?: string[];      // Search tags
  rating?: number;      // Average rating
  reviewsCount?: number; // Number of reviews
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

// Shopping cart
export interface CartItem {
  product: Product;
  quantity: number;
  variant?: ProductVariant;
}

// Address
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

// Payment method
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

// Order status
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// Order item
export interface OrderItem {
  product: Product;
  quantity: number;
  variant?: ProductVariant;
  price: number; // Price at the time of purchase
}

// Order
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

// User
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
  wishlist?: string[]; // Product IDs
  orders?: Order[];
  createdAt: string | Date;
}

// Search filters
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

// Reviews
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  images?: string[]; // Uploaded image URLs
  videos?: string[]; // Uploaded video URLs
  verifiedPurchase: boolean;
  helpful: number; // "Helpful" counter
  createdAt: string | Date;
  updatedAt?: string | Date;
}

// Q&A
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

// Theme
export type Theme = 'light' | 'dark';

// Language
export type Language = 'es' | 'en';

// Currency
export type Currency = 'COP' | 'USD';

export interface I18nConfig {
  language: Language;
  currency: Currency;
}
