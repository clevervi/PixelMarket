'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getCurrentUser } from '@/lib/auth-storage';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Tag, Plus, Edit, Trash2, Calendar, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { products } from '@/data/products';

interface Promotion {
  id: number;
  name: string;
  discount: string;
  code: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'scheduled' | 'expired';
  image?: string;
}

const featuredProducts = products.filter(p => p.featured);

const initialPromotions: Promotion[] = [
  { 
    id: 1, 
    name: 'Summer Sale', 
    discount: '20%', 
    code: 'SUMMER20', 
    startDate: '2024-06-01', 
    endDate: '2024-08-31', 
    status: 'active',
    image: featuredProducts[0]?.image || '/assets/assets11/hamaca.webp'
  },
  { 
    id: 2, 
    name: 'New Customer', 
    discount: '15%', 
    code: 'WELCOME15', 
    startDate: '2024-01-01', 
    endDate: '2024-12-31', 
    status: 'active',
    image: featuredProducts[1]?.image || '/assets/assets11/mochila.webp'
  },
  { 
    id: 3, 
    name: 'Black Friday', 
    discount: '50%', 
    code: 'BF50', 
    startDate: '2024-11-29', 
    endDate: '2024-11-29', 
    status: 'scheduled',
    image: featuredProducts[2]?.image || '/assets/assets11/sombrero-vueltiao.webp'
  },
];

export default function PromotionsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    if (currentUser.role !== 'admin' && currentUser.role !== 'store_manager') {
      router.push('/dashboard');
      return;
    }
    setUser(currentUser);
  }, [router]);

  const handleEdit = (promo: Promotion) => {
    setEditingPromo(promo);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      setPromotions(promotions.filter(p => p.id !== id));
      toast.success('Promotion deleted successfully');
    }
  };

  const handleCreate = () => {
    setEditingPromo(null);
    setIsModalOpen(true);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <DashboardHeader 
        title="Promotions" 
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Promotions' }
        ]} 
      />

      <div className="p-6">
        <div className="mb-6 flex justify-end">
          <button 
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Promotion
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promo) => (
            <div key={promo.id} className="bg-white dark:bg-dark-surface rounded-lg shadow-md overflow-hidden">
              {/* Imagen del producto */}
              {promo.image && (
                <div className="relative h-80 bg-gray-200">
                  <Image
                    src={promo.image}
                    alt={promo.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <span className={`absolute top-3 right-3 px-3 py-1.5 text-sm font-semibold rounded-full ${
                    promo.status === 'active' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-yellow-500 text-white'
                  }`}>
                    {promo.status}
                  </span>
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-dark dark:text-dark-text">{promo.name}</h3>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Discount:</span>
                    <span className="text-sm font-semibold text-primary">{promo.discount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Code:</span>
                    <code className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{promo.code}</code>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {promo.startDate} - {promo.endDate}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(promo)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(promo.id)}
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Create/Edit Promotion */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-surface rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-dark dark:text-dark-text">
                  {editingPromo ? 'Edit Promotion' : 'Create New Promotion'}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingPromo(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const promoData: Promotion = {
                  id: editingPromo?.id || Date.now(),
                  name: formData.get('name') as string,
                  discount: formData.get('discount') as string,
                  code: formData.get('code') as string,
                  startDate: formData.get('startDate') as string,
                  endDate: formData.get('endDate') as string,
                  status: formData.get('status') as 'active' | 'scheduled' | 'expired',
                };

                if (editingPromo) {
                  // Update existing promotion
                  setPromotions(promotions.map(p => 
                    p.id === editingPromo.id ? promoData : p
                  ));
                  toast.success('Promotion updated successfully');
                } else {
                  // Create new promotion
                  setPromotions([...promotions, promoData]);
                  toast.success('Promotion created successfully');
                }

                setIsModalOpen(false);
                setEditingPromo(null);
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Promotion Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editingPromo?.name}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-dark-surface dark:text-dark-text"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Discount (e.g., 20%)
                      </label>
                      <input
                        type="text"
                        name="discount"
                        defaultValue={editingPromo?.discount}
                        required
                        placeholder="20%"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-dark-surface dark:text-dark-text"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Promo Code
                      </label>
                      <input
                        type="text"
                        name="code"
                        defaultValue={editingPromo?.code}
                        required
                        placeholder="SUMMER20"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-dark-surface dark:text-dark-text uppercase"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        defaultValue={editingPromo?.startDate}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-dark-surface dark:text-dark-text"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        defaultValue={editingPromo?.endDate}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-dark-surface dark:text-dark-text"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      defaultValue={editingPromo?.status || 'active'}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-dark-surface dark:text-dark-text"
                    >
                      <option value="active">Active</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingPromo(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                  >
                    {editingPromo ? 'Update Promotion' : 'Create Promotion'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
