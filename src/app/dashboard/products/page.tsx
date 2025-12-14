'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-storage';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Package, Plus, Edit, Trash2, Search, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  image: string;
  vendorId?: string | null;
}

export default function ProductsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const load = async () => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);

      try {
        let url = '/api/products';

        if (currentUser.role === 'vendor') {
          // Obtener la tienda del vendor y filtrar por vendorId
          const meRes = await fetch('/api/vendors/me');
          if (!meRes.ok) {
            toast.error('Error loading vendor info');
            setProducts([]);
            setFilteredProducts([]);
            return;
          }
          const meData = await meRes.json();
          const vendorId = meData.data.id as string;
          url = `/api/products?vendorId=${encodeURIComponent(vendorId)}`;
        } else if (currentUser.role !== 'admin') {
          // Otros roles no tienen acceso al dashboard de productos
          setProducts([]);
          setFilteredProducts([]);
          return;
        }

        const res = await fetch(url);
        if (!res.ok) {
          toast.error('Error loading products');
          return;
        }
        const data = await res.json();

        const mapped: Product[] = (data.data || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category_id || 'Uncategorized',
          price: parseFloat(p.price),
          stock: p.stock ?? 0,
          status: p.is_active ? 'active' : 'inactive',
          image: '/assets/assets1/hat1.jpg',
          vendorId: p.vendor_id ?? null,
        }));

        setProducts(mapped);
        setFilteredProducts(mapped);
      } catch (error) {
        console.error('Error loading products for dashboard:', error);
        toast.error('Unexpected error loading products');
      }
    };

    load();
  }, [router]);

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  const handleDelete = async (id: string) => {
    try {
      if (!user) {
        toast.error('User not authenticated');
        return;
      }

      if (user.role !== 'admin') {
        toast.error('You do not have permission to delete products');
        return;
      }

      if (!window.confirm('Are you sure you want to delete this product?')) {
        return;
      }

      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        toast.error(data?.error || 'Failed to delete product');
        return;
      }

      const updatedProducts = products.filter(p => p.id !== id);
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error in handleDelete:', error);
      toast.error('Error deleting product');
    }
  };

  const handleEdit = (product: Product) => {
    try {
      if (!user) {
        toast.error('User not authenticated');
        return;
      }

      if (user.role !== 'admin' && user.role !== 'vendor') {
        toast.error('You do not have permission to edit products');
        return;
      }

      setEditingProduct(product);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error in handleEdit:', error);
      toast.error('Error editing product');
    }
  };

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const canCreate = user.role === 'admin' || user.role === 'vendor';
  const canDelete = user.role === 'admin';

  return (
    <div className="min-h-screen">
      <DashboardHeader 
        title="Products" 
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Products' }
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
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-dark-surface dark:text-dark-text"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-dark-surface dark:text-dark-text"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>

            {canCreate && (
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Product
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white dark:bg-dark-surface rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 relative">
                <Package className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-gray-400" />
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-dark dark:text-dark-text">{product.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {product.status}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{product.category}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-primary">${product.price}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Stock: {product.stock}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      handleEdit(product);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  
                  {user.role === 'admin' && (
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Start by adding your first product'}
            </p>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-surface rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-dark dark:text-dark-text">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!user) {
                    toast.error('User not authenticated');
                    return;
                  }

                  const formData = new FormData(e.currentTarget);
                  const name = formData.get('name') as string;
                  const categoryLabel = (formData.get('category') as string) || 'Uncategorized';
                  const price = parseFloat(formData.get('price') as string);
                  const stock = parseInt(formData.get('stock') as string, 10);
                  const status = formData.get('status') as 'active' | 'inactive';

                  if (!name || Number.isNaN(price) || Number.isNaN(stock)) {
                    toast.error('Please fill all required fields correctly');
                    return;
                  }

                  try {
                    // De momento, usamos una descripción generada a partir del nombre
                    const description = `${name} - ${categoryLabel}`;
                    const shortDescription = description;

                    const body = {
                      name,
                      slug: name
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, ''),
                      description,
                      shortDescription,
                      price,
                      stock,
                      featured: status === 'active',
                    };

                    const res = await fetch('/api/products', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(body),
                    });

                    if (!res.ok) {
                      const data = await res.json().catch(() => null);
                      toast.error(data?.error || 'Failed to save product');
                      return;
                    }

                    const data = await res.json();
                    const p = data.data;

                    const mapped: Product = {
                      id: p.id,
                      name: p.name,
                      category: categoryLabel,
                      price: parseFloat(p.price),
                      stock: p.stock ?? stock,
                      status: p.is_active ? 'active' : 'inactive',
                      image: '/assets/assets1/hat1.jpg',
                      vendorId: p.vendor_id ?? null,
                    };

                    const newProducts = [...products, mapped];
                    setProducts(newProducts);
                    setFilteredProducts(newProducts);
                    toast.success('Product saved successfully');
                    setIsModalOpen(false);
                    setEditingProduct(null);
                  } catch (error) {
                    console.error('Error saving product:', error);
                    toast.error('Unexpected error saving product');
                  }
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editingProduct?.name}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-dark-surface dark:text-dark-text"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      defaultValue={editingProduct?.category}
                      placeholder="Category label (for dashboard only)"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-dark-surface dark:text-dark-text"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        name="price"
                        step="0.01"
                        defaultValue={editingProduct?.price}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-dark-surface dark:text-dark-text"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Stock
                      </label>
                      <input
                        type="number"
                        name="stock"
                        defaultValue={editingProduct?.stock}
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
                      defaultValue={editingProduct?.status || 'active'}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-dark-surface dark:text-dark-text"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingProduct(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
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
