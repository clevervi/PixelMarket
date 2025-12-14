'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getAllUsers, createUser, updateUser, deleteUser } from '@/lib/auth-storage';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Plus, Edit, Trash2, Search, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function UsersPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    
    // Only admin can access this page
    if (currentUser.role !== 'admin') {
      router.push('/dashboard');
      toast.error('You do not have permission to access this page');
      return;
    }
    
    setUser(currentUser);
    loadUsers();
  }, [router]);

  const loadUsers = () => {
    const allUsers = getAllUsers();
    setUsers(allUsers);
    setFilteredUsers(allUsers);
  };

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(u => 
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRole !== 'all') {
      filtered = filtered.filter(u => u.role === selectedRole);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, selectedRole, users]);

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      const success = deleteUser(id);
      if (success) {
        toast.success('User deleted successfully');
        loadUsers();
      } else {
        toast.error('Failed to delete user');
      }
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'store_manager':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'customer':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader 
        title="User Management" 
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Users' }
        ]} 
      />

      <div className="p-6">
        {/* Header Actions */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-dark-surface dark:text-dark-text"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-dark-surface dark:text-dark-text"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="store_manager">Store Manager</option>
              <option value="customer">Customer</option>
            </select>

            <button
              onClick={() => toast('Add user modal coming soon')}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add User
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-dark-brown border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-dark-brown transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-semibold">
                            {u.firstName?.[0]}{u.lastName?.[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-dark dark:text-dark-text">
                            {u.firstName} {u.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="w-4 h-4" />
                        {u.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(u.role)}`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => toast('Edit user modal coming soon')}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        {u.id !== user.id && (
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No users found
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-dark dark:text-dark-text">{users.length}</p>
              </div>
              <Users className="w-12 h-12 text-primary/20" />
            </div>
          </div>

          <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Admins</p>
                <p className="text-2xl font-bold text-dark dark:text-dark-text">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
              <Shield className="w-12 h-12 text-purple-500/20" />
            </div>
          </div>

          <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Customers</p>
                <p className="text-2xl font-bold text-dark dark:text-dark-text">
                  {users.filter(u => u.role === 'customer').length}
                </p>
              </div>
              <Users className="w-12 h-12 text-green-500/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
