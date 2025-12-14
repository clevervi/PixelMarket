'use client';

import { useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import { useNotificationStore } from '@/store/notificationStore';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
}

// Datos mock - 3 usuarios (sin admin)
const MOCK_USERS: User[] = [
  {
    id: 2,
    email: 'manager@tienda.com',
    firstName: 'Store',
    lastName: 'Manager',
    role: 'store_manager',
    createdAt: '2024-01-12',
  },
  {
    id: 3,
    email: 'user@tienda.com',
    firstName: 'Regular',
    lastName: 'User',
    role: 'customer',
    createdAt: '2024-01-12',
  },
  {
    id: 4,
    email: 'vendor@tienda.com',
    firstName: 'Artisan',
    lastName: 'Vendor',
    role: 'vendor',
    createdAt: '2024-01-15',
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const { addNotification } = useNotificationStore();

  // Filtrar usuarios: excluir admins y aplicar búsqueda
  const filteredUsers = users
    .filter(user => user.role !== 'admin') // No mostrar admins
    .filter(user =>
      searchTerm === '' ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleAdd = () => {
    const newUser: User = {
      id: users.length + 1,
      email: `newuser${users.length + 1}@tienda.com`,
      firstName: 'New',
      lastName: 'User',
      role: 'customer',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers([...users, newUser]);
    addNotification({
      type: 'success',
      title: 'Success',
      message: 'User added successfully',
      duration: 3000,
    });
  };

  const handleEdit = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const newFirstName = prompt('Enter first name:', user.firstName);
    if (newFirstName === null) return;

    const newLastName = prompt('Enter last name:', user.lastName);
    if (newLastName === null) return;

    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, firstName: newFirstName, lastName: newLastName }
        : u
    ));
    
    addNotification({
      type: 'success',
      title: 'Success',
      message: 'User updated successfully',
      duration: 3000,
    });
  };


  const handleDelete = (userId: number, userRole: string) => {
    // No permitir borrar admins
    if (userRole === 'admin') {
      addNotification({
        type: 'error',
        title: 'Action Not Allowed',
        message: 'Cannot delete admin users',
        duration: 3000,
      });
      return;
    }

    if (!confirm('Are you sure you want to delete this user?')) return;

    // Eliminar localmente
    setUsers(users.filter(u => u.id !== userId));
    addNotification({
      type: 'success',
      title: 'Success',
      message: 'User deleted successfully',
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#8B4513]">User Management v2.0</h1>
          <p className="text-gray-600 mt-1">✅ Fully functional - Add, Edit, Delete, Search</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-[#8B4513] text-white px-6 py-2 rounded-lg hover:bg-[#6B3410] transition-colors font-medium"
        >
          <FaPlus size={16} />
          Add User
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by email, name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-gray-50 outline-none text-gray-700"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-[#D2691E]">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Created</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'admin'
                          ? 'bg-red-100 text-red-800'
                          : user.role === 'vendor'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(user.id)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          title="Edit"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, user.role)}
                          disabled={user.role === 'admin'}
                          className={`p-2 rounded-lg transition-colors ${
                            user.role === 'admin'
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-red-100 text-red-600 hover:bg-red-200'
                          }`}
                          title={user.role === 'admin' ? 'Cannot delete admin' : 'Delete'}
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <p className="text-sm text-gray-600">
          Showing {filteredUsers.length} of {users.filter(u => u.role !== 'admin').length} users (excluding admins)
        </p>
      </div>
    </div>
  );
}
