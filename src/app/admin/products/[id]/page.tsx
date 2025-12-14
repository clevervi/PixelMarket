'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useNotificationStore } from '@/store/notificationStore';
import { FaArrowLeft, FaSave } from 'react-icons/fa';

interface ProductForm {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  tags?: string[];
}

export default function ProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const isNew = productId === 'new';

  const [form, setForm] = useState<ProductForm>({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    image: '',
  });

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const { addNotification } = useNotificationStore();

  const categories = ['Sombreros', 'Mochilas', 'Hamacas', 'Textiles', 'Accesorios', 'Otros'];

  useEffect(() => {
    if (!isNew) {
      fetchProduct();
    }
  }, [productId, isNew]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/products/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setForm(data);
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load product',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.description || !form.category || form.price <= 0) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields',
        duration: 5000,
      });
      return;
    }

    try {
      setIsSaving(true);
      const method = isNew ? 'POST' : 'PUT';
      const url = isNew ? '/api/products' : `/api/products/${productId}`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'Success',
          message: isNew ? 'Product created successfully' : 'Product updated successfully',
          duration: 3000,
        });
        router.push('/admin/products');
      } else {
        const error = await response.json();
        addNotification({
          type: 'error',
          title: 'Error',
          message: error.message || 'Failed to save product',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Save error:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error saving product',
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FaArrowLeft className="text-xl text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[#8B4513]">
            {isNew ? 'Create New Product' : 'Edit Product'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isNew ? 'Add a new product to your store' : 'Update product information'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
        <div className="space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Stock */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Stock
              </label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Image Preview */}
          {form.image && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Image Preview
              </label>
              <img
                src={form.image}
                alt="Preview"
                className="h-48 object-cover rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-8 pt-6 border-t">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#8B4513] text-white px-6 py-2 rounded-lg hover:bg-[#6B3410] transition-colors font-medium disabled:opacity-50"
          >
            <FaSave size={16} />
            {isSaving ? 'Saving...' : 'Save Product'}
          </button>
          <Link
            href="/admin/products"
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
