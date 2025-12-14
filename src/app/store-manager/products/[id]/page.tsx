'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaSave, FaImage } from 'react-icons/fa';
import { useNotificationStore } from '@/store/notificationStore';
import { useUserStore } from '@/store/userStore';

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  createdAt: string;
}

const CATEGORIES = [
  'Hats',
  'Hammocks',
  'Bags',
  'Bracelets',
  'Clothing',
  'Other'
];

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useUserStore();
  const { addNotification } = useNotificationStore();
  const productId = params.id;
  const isNewProduct = productId === 'new';

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    category: 'Other',
    price: 0,
    stock: 0,
    image: '',
  });
  const [isLoading, setIsLoading] = useState(!isNewProduct);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!isNewProduct) {
      fetchProduct();
    }
  }, [isNewProduct, user, router]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/store-manager/products/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setFormData(data.data);
      } else {
        addNotification({
          type: 'error',
          title: 'Error',
          message: 'Product not found',
          duration: 5000,
        });
        router.push('/store-manager/products');
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load product',
        duration: 5000,
      });
      router.push('/store-manager/products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Name and price are required',
        duration: 5000,
      });
      return;
    }

    setIsSaving(true);

    try {
      const method = isNewProduct ? 'POST' : 'PUT';
      const url = isNewProduct
        ? '/api/store-manager/products'
        : `/api/store-manager/products/${productId}`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'Success',
          message: isNewProduct ? 'Product created successfully' : 'Product updated successfully',
          duration: 3000,
        });
        router.push('/store-manager/products');
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
        message: 'Failed to save product',
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B4513]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/store-manager/products"
          className="flex items-center gap-2 text-[#8B4513] hover:text-[#6B3410] font-medium"
        >
          <FaArrowLeft size={18} />
          Back to Products
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-[#8B4513]">
          {isNewProduct ? 'Create New Product' : 'Edit Product'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-[#8B4513] mb-2">
              Product Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
              placeholder="Enter product name"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-[#8B4513] mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
              placeholder="Enter product description"
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-[#8B4513] mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category || 'Other'}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-semibold text-[#8B4513] mb-2">
                Price *
              </label>
              <input
                id="price"
                name="price"
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Stock */}
          <div>
            <label htmlFor="stock" className="block text-sm font-semibold text-[#8B4513] mb-2">
              Stock
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              value={formData.stock || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
              placeholder="0"
            />
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="image" className="block text-sm font-semibold text-[#8B4513] mb-2">
              Image URL
            </label>
            <input
              id="image"
              name="image"
              type="url"
              value={formData.image || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
            {formData.image && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                <img
                  src={formData.image}
                  alt="Product preview"
                  className="h-40 w-40 object-cover rounded-lg border border-gray-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Image';
                  }}
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 bg-[#8B4513] text-white px-6 py-2 rounded-lg hover:bg-[#6B3410] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSave size={18} />
              {isSaving ? 'Saving...' : 'Save Product'}
            </button>
            <Link
              href="/store-manager/products"
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
