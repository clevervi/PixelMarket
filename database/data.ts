import { Product, Order, User, Review } from '@/types';
import { products as initialProducts } from '@/data/products';

// In-memory database
export interface Database {
  users: User[];
  products: Product[];
  orders: Order[];
  reviews: Review[];
  sessions: Map<string, { userId: string; expiresAt: number }>;
}

export const db: Database = {
  users: [
    {
      id: '1',
      name: 'Demo User',
      email: 'demo@latidoancestral.com',
      password: 'demo123', // In production, use bcrypt
      addresses: [
        {
          id: 'addr1',
          type: 'shipping',
          firstName: 'Demo',
          lastName: 'User',
          address: 'Calle 123 #45-67',
          city: 'Bogotá',
          state: 'Cundinamarca',
          country: 'Colombia',
          zipCode: '110111',
          phone: '3001234567',
          isDefault: true
        }
      ],
      createdAt: new Date().toISOString()
    }
  ],
  products: initialProducts,
  orders: [],
  reviews: [],
  sessions: new Map()
};

// Helper functions
export function findUserByEmail(email: string): User | undefined {
  return db.users.find(u => u.email === email);
}

export function findUserById(id: string): User | undefined {
  return db.users.find(u => u.id === id);
}

export function createUser(user: Omit<User, 'id' | 'createdAt'>): User {
  const newUser: User = {
    ...user,
    id: `user_${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  db.users.push(newUser);
  return newUser;
}

export function findProductById(id: string): Product | undefined {
  return db.products.find(p => p.id === id);
}

export function createOrder(order: Omit<Order, 'id' | 'createdAt'>): Order {
  const newOrder: Order = {
    ...order,
    id: `ORD${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  db.orders.push(newOrder);
  return newOrder;
}

export function findOrderById(id: string): Order | undefined {
  return db.orders.find(o => o.id === id);
}

export function getOrdersByUserId(userId: string): Order[] {
  return db.orders.filter(o => o.userId === userId);
}

export function createReview(review: Omit<Review, 'id' | 'createdAt'>): Review {
  const newReview: Review = {
    ...review,
    id: `rev_${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  db.reviews.push(newReview);
  return newReview;
}

export function getReviewsByProductId(productId: string): Review[] {
  return db.reviews.filter(r => r.productId === productId);
}

export function createSession(userId: string): string {
  const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
  db.sessions.set(sessionId, { userId, expiresAt });
  return sessionId;
}

export function validateSession(sessionId: string): string | null {
  const session = db.sessions.get(sessionId);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    db.sessions.delete(sessionId);
    return null;
  }
  return session.userId;
}

export function deleteSession(sessionId: string): void {
  db.sessions.delete(sessionId);
}
