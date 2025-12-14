'use client';

import { useState, useMemo } from 'react';
import { products as allProducts } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import ProductListView from '@/components/shop/ProductListView';
import ProductFilter from '@/components/shop/ProductFilter';
import Pagination from '@/components/shop/Pagination';
import { Grid, List, SlidersHorizontal, X } from 'lucide-react';

interface FilterState {
  categories: string[];
  priceRange: [number, number];
  colors: string[];
  inStock: boolean;
}

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest';

export default function ShopPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const itemsPerPage = 12;

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 1000000],
    colors: [],
    inStock: false,
  });

  // Filter products
  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false;
      }

      // Price filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // Color filter
      if (filters.colors.length > 0 && product.color && !filters.colors.includes(product.color)) {
        return false;
      }

      // Stock filter (assume all products are in stock for now)
      if (filters.inStock) {
        return true; // All products in stock
      }

      return true;
    });
  }, [filters]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'newest':
        return sorted.reverse();
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  // Paginate products
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-primary">Artisan Shop</h1>
          <p className="text-xl md:text-2xl max-w-3xl text-gray-700">
            Discover authentic Colombian handcrafted products. Each piece tells a unique story.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-4">
              <ProductFilter
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </aside>

          {/* Mobile Filter Modal */}
          {showMobileFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowMobileFilters(false)}>
              <div 
                className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-dark-surface overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <ProductFilter
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClose={() => setShowMobileFilters(false)}
                  isMobile={true}
                />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-grow">
            {/* Toolbar */}
            <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-4 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Results Count */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
                  >
                    <SlidersHorizontal className="w-5 h-5" />
                    Filters
                  </button>
                  <p className="text-dark dark:text-dark-text">
                    <span className="font-semibold">{sortedProducts.length}</span> products found
                  </p>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="flex-grow sm:flex-grow-0 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-dark dark:text-dark-text dark:bg-dark-brown focus:ring-2 focus:ring-primary"
                  >
                    <option value="default">Default Sorting</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                    <option value="newest">Newest First</option>
                  </select>

                  {/* View Toggle */}
                  <div className="flex gap-2 border border-gray-300 dark:border-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-primary text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-brown'
                      }`}
                      title="Grid View"
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded transition-colors ${
                        viewMode === 'list'
                          ? 'bg-primary text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-brown'
                      }`}
                      title="List View"
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {(filters.categories.length > 0 || filters.colors.length > 0) && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                  {filters.categories.map(category => (
                    <span
                      key={category}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium capitalize"
                    >
                      {category}
                      <button
                        onClick={() => handleFilterChange({
                          ...filters,
                          categories: filters.categories.filter(c => c !== category)
                        })}
                        className="hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {filters.colors.map(color => (
                    <span
                      key={color}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium"
                    >
                      {color}
                      <button
                        onClick={() => handleFilterChange({
                          ...filters,
                          colors: filters.colors.filter(c => c !== color)
                        })}
                        className="hover:bg-secondary/20 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Products Grid/List */}
            {paginatedProducts.length > 0 ? (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {paginatedProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {paginatedProducts.map(product => (
                      <ProductListView key={product.id} product={product} />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-dark dark:text-dark-text mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your filters to find what you're looking for
                </p>
                <button
                  onClick={() => handleFilterChange({
                    categories: [],
                    priceRange: [0, 1000000],
                    colors: [],
                    inStock: false,
                  })}
                  className="btn-primary"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
