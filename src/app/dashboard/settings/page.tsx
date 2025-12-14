'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, updateUserPassword } from '@/lib/auth-storage';
import { toast } from 'react-hot-toast';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  } | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    
    setUser({
      email: currentUser.email,
      firstName: currentUser.firstName || '',
      lastName: currentUser.lastName || '',
      role: currentUser.role || 'customer'
    });
    
    setFormData(prev => ({
      ...prev,
      firstName: currentUser.firstName || '',
      lastName: currentUser.lastName || ''
    }));
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para actualizar el perfil
    toast.success('Perfil actualizado correctamente');
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Aquí iría la lógica para actualizar la contraseña
      const success = updateUserPassword(
        user?.email || '',
        formData.newPassword
      );
      
      if (success) {
        toast.success('Contraseña actualizada correctamente');
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        toast.error('Error al actualizar la contraseña');
      }
    } catch (error) {
      toast.error('Ocurrió un error al actualizar la contraseña');
      console.error('Error updating password:', error);
    } finally {
      setIsLoading(false);
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
        title="Settings" 
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Settings' }
        ]} 
      />
      
      <div className="p-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Perfil */}
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-dark dark:text-dark-text mb-6">
            Profile Information
          </h2>
          
          <form onSubmit={handleProfileUpdate}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-dark-surface dark:text-dark-text"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-dark-surface dark:text-dark-text"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
        
        {/* Cambiar contraseña */}
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-dark dark:text-dark-text mb-6">
            Change Password
          </h2>
          
          <form onSubmit={handlePasswordUpdate}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-dark-surface dark:text-dark-text"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-dark-surface dark:text-dark-text"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-dark-surface dark:text-dark-text"
              />
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Updating...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Sección de cierre de sesión */}
      <div className="mt-8 bg-white dark:bg-dark-surface rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-dark dark:text-dark-text mb-4">
          Logout
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Do you want to logout from your current session?
        </p>
        <button
          onClick={() => {
            // Aquí iría la lógica para cerrar sesión
            localStorage.removeItem('user');
            router.push('/login');
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Logout
        </button>
      </div>
      </div>
    </div>
  );
}
