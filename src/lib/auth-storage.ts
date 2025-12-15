// In-memory storage system for development
// In production, use a real database

export interface ResetTokenData {
  email: string;
  expiresAt: number;
}

export interface UserData {
  id?: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Reset token storage
export const resetTokens = new Map<string, ResetTokenData>();

// User storage (mocked)
let usersData: UserData[] = [
  { 
    id: 1,
    email: 'admin@latido.com', 
    password: 'admin123', 
    firstName: 'Admin', 
    lastName: 'User',
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: 2,
    email: 'manager@latido.com', 
    password: 'manager123', 
    firstName: 'Store', 
    lastName: 'Manager',
    role: 'store_manager',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: 3,
    email: 'user@latido.com', 
    password: 'user123', 
    firstName: 'Regular', 
    lastName: 'User',
    role: 'customer',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Get all users (admin-only)
export function getAllUsers(): UserData[] {
  return usersData;
}

// Get user by ID
export function getUserById(id: number): UserData | undefined {
  return usersData.find(user => user.id === id);
}

// Create a new user
export function createUser(userData: Omit<UserData, 'id' | 'createdAt' | 'updatedAt'>): UserData | null {
  const existingUser = usersData.find(u => u.email === userData.email);
  if (existingUser) return null;
  
  const newUser: UserData = {
    ...userData,
    id: usersData.length > 0 ? Math.max(...usersData.map(u => u.id || 0)) + 1 : 1,
    role: userData.role || 'customer',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  usersData.push(newUser);
  return newUser;
}

// Update a user
export function updateUser(id: number, userData: Partial<UserData>): UserData | null {
  const userIndex = usersData.findIndex(u => u.id === id);
  if (userIndex === -1) return null;
  
  usersData[userIndex] = {
    ...usersData[userIndex],
    ...userData,
    updatedAt: new Date()
  };
  
  return usersData[userIndex];
}

// Delete a user
export function deleteUser(id: number): boolean {
  const initialLength = usersData.length;
  usersData = usersData.filter(u => u.id !== id);
  return usersData.length < initialLength;
}

// Get user by email
export function getUserByEmail(email: string): UserData | undefined {
  return usersData.find(u => u.email === email);
}

// Get the current user from localStorage
export function getCurrentUser(): UserData | null {
  if (typeof window === 'undefined') return null;
  const userJson = localStorage.getItem('user');
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
}

// Persist the current user in localStorage
export function setCurrentUser(user: UserData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
}

// Update a user's password
export function updateUserPassword(email: string, newPassword: string): boolean {
  const userIndex = usersData.findIndex(u => u.email === email);
  if (userIndex === -1) return false;
  
  usersData[userIndex] = {
    ...usersData[userIndex],
    password: newPassword,
    updatedAt: new Date()
  };
  
  // Update localStorage if this is the current user
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.email === email) {
    setCurrentUser(usersData[userIndex]);
  }
  
  return true;
}

// Create a reset token
export function createResetToken(email: string): string {
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const expiresAt = Date.now() + 3600000; // 1 hour expiration
  resetTokens.set(token, { email, expiresAt });
  return token;
}

// Get reset token data
export function getResetTokenData(token: string): ResetTokenData | undefined {
  const data = resetTokens.get(token);
  if (!data) return undefined;
  
  // Delete the token if it has expired
  if (data.expiresAt < Date.now()) {
    resetTokens.delete(token);
    return undefined;
  }
  
  return data;
}

// Delete a reset token
export function deleteResetToken(token: string): void {
  resetTokens.delete(token);
}

// Log out
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
}

// Check if the user is authenticated
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

// Check if the user has a specific role
export function hasRole(role: string): boolean {
  const user = getCurrentUser();
  return user ? user.role === role : false;
}

// Check if the user has any of the given roles
export function hasAnyRole(roles: string[]): boolean {
  const user = getCurrentUser();
  return user ? roles.includes(user.role) : false;
}
