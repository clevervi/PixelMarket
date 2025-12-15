// Global shared state for the app
// In production, this should live in a real database
// Note: this state is lost when the server restarts

let vendorApplications: any[] = [];
let registeredUsers: any[] = [
  {
    id: '1',
    email: 'admin@latido.com',
    passwordHash: '$2b$10$fx5UYY5n6rbwxSLad.E5BuN1gjrFePoYxirQ6Uxvpr5hYPWjhZwBa',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    isActive: true
  }
];

// Helpers for vendorApplications
export function addVendorApplication(application: any) {
  vendorApplications.push(application);
}

export function getVendorApplications() {
  return vendorApplications;
}

export function getVendorApplicationById(id: string) {
  return vendorApplications.find(app => app.id === id);
}

export function updateVendorApplication(id: string, updates: any) {
  const index = vendorApplications.findIndex(app => app.id === id);
  if (index !== -1) {
    vendorApplications[index] = { ...vendorApplications[index], ...updates };
    return vendorApplications[index];
  }
  return null;
}

// Helpers for registeredUsers
export function findUserByEmail(email: string) {
  return registeredUsers.find(u => u.email === email);
}

export function addUser(user: any) {
  registeredUsers.push(user);
  return user;
}

export function updateUser(email: string, updates: any) {
  const index = registeredUsers.findIndex(u => u.email === email);
  if (index !== -1) {
    registeredUsers[index] = { ...registeredUsers[index], ...updates };
    return registeredUsers[index];
  }
  return null;
}

export function getAllUsers() {
  return registeredUsers;
}
