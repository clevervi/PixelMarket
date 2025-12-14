// Sistema de almacenamiento en memoria para desarrollo
// En producción, usar base de datos real

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

// Almacenamiento de tokens de reset
export const resetTokens = new Map<string, ResetTokenData>();

// Almacenamiento de usuarios (simulado)
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

// Obtener todos los usuarios (solo para admin)
export function getAllUsers(): UserData[] {
  return usersData;
}

// Obtener usuario por ID
export function getUserById(id: number): UserData | undefined {
  return usersData.find(user => user.id === id);
}

// Crear un nuevo usuario
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

// Actualizar usuario
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

// Eliminar usuario
export function deleteUser(id: number): boolean {
  const initialLength = usersData.length;
  usersData = usersData.filter(u => u.id !== id);
  return usersData.length < initialLength;
}

// Obtener usuario por email
export function getUserByEmail(email: string): UserData | undefined {
  return usersData.find(u => u.email === email);
}

// Obtener usuario actual desde localStorage
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

// Establecer usuario actual en localStorage
export function setCurrentUser(user: UserData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
}

// Actualizar contraseña de usuario
export function updateUserPassword(email: string, newPassword: string): boolean {
  const userIndex = usersData.findIndex(u => u.email === email);
  if (userIndex === -1) return false;
  
  usersData[userIndex] = {
    ...usersData[userIndex],
    password: newPassword,
    updatedAt: new Date()
  };
  
  // Actualizar en localStorage si es el usuario actual
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.email === email) {
    setCurrentUser(usersData[userIndex]);
  }
  
  return true;
}

// Crear token de restablecimiento
export function createResetToken(email: string): string {
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const expiresAt = Date.now() + 3600000; // 1 hora de expiración
  resetTokens.set(token, { email, expiresAt });
  return token;
}

// Obtener datos del token de restablecimiento
export function getResetTokenData(token: string): ResetTokenData | undefined {
  const data = resetTokens.get(token);
  if (!data) return undefined;
  
  // Eliminar el token si ha expirado
  if (data.expiresAt < Date.now()) {
    resetTokens.delete(token);
    return undefined;
  }
  
  return data;
}

// Eliminar token de restablecimiento
export function deleteResetToken(token: string): void {
  resetTokens.delete(token);
}

// Cerrar sesión
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
}

// Verificar si el usuario está autenticado
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

// Verificar si el usuario tiene un rol específico
export function hasRole(role: string): boolean {
  const user = getCurrentUser();
  return user ? user.role === role : false;
}

// Verificar si el usuario tiene alguno de los roles especificados
export function hasAnyRole(roles: string[]): boolean {
  const user = getCurrentUser();
  return user ? roles.includes(user.role) : false;
}
