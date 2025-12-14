'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import { useNotificationStore } from '@/store/notificationStore';
import { products as featuredProductsData } from '@/data/products';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  createdAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotificationStore();
  
  // Force refresh - using featured products with images

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      // Usar productos de featured products con datos mock
      const mockProducts = featuredProductsData.map((p, index) => ({
        id: index + 1,
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        stock: 30 + Math.floor(Math.random() * 50),
        image: p.image,
        createdAt: new Date().toISOString(),
      }));
      setProducts(mockProducts);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load products',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId));
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Product deleted successfully',
          duration: 3000,
        });
      } else {
        addNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to delete product',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Delete error:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error deleting product',
        duration: 5000,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#8B4513]">Products Management</h1>
          <p className="text-gray-600 mt-1">Manage all products in your store (with images)</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-[#8B4513] text-white px-6 py-2 rounded-lg hover:bg-[#6B3410] transition-colors font-medium"
        >
          <FaPlus size={16} />
          New Product
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-gray-50 outline-none text-gray-700"
          />
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-500">Loading products...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-500">No products found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-64 bg-gray-200">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
                  product.stock > 10
                    ? 'bg-green-500 text-white'
                    : product.stock > 0
                    ? 'bg-yellow-500 text-white'
                    : 'bg-red-500 text-white'
                }`}>
                  Stock: {product.stock}
                </span>
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1 text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                <p className="text-xl font-bold text-[#8B4513] mb-4">${product.price.toFixed(2)}</p>
                
                <div className="flex gap-2">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <FaEdit size={14} />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Footer */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <p className="text-sm text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>
    </div>
  );
}
