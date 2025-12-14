"use client";

import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX, FiFilter } from 'react-icons/fi';
import { Product } from '@/types';
import { products } from '@/data/products';
import Link from 'next/link';
import Image from 'next/image';

interface AdvancedSearchProps {
  onSearch?: (query: string) => void;
}

export default function AdvancedSearch({ onSearch }: AdvancedSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length >= 2) {
      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5);
      
      setSuggestions(filtered);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query]);

  const handleSearch = () => {
    if (onSearch && query.trim()) {
      onSearch(query);
      setIsOpen(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      {/* Barra de búsqueda principal */}
      <div className="relative">
        <div className="relative flex items-center">
          <FiSearch className="absolute left-4 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search products, categories, colors..."
            className="w-full pl-12 pr-24 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary transition-all shadow-sm"
          />
          
          <div className="absolute right-2 flex items-center gap-2">
            {query && (
              <button
                onClick={clearSearch}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiFilter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Autocomplete suggestions */}
        {isOpen && suggestions.length > 0 && (
          <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-fade-in">
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 px-3 py-2">
                Suggestions
              </div>
              {suggestions.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                  <div className="text-primary font-bold">
                    ${product.price.toLocaleString('es-CO')}
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="border-t border-gray-200 p-3 bg-gray-50">
              <button
                onClick={handleSearch}
                className="w-full text-center text-sm font-medium text-primary hover:text-primary-dark transition-colors"
              >
                View all results for "{query}"
              </button>
            </div>
          </div>
        )}

        {/* Panel de filtros avanzados */}
        {showFilters && (
          <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 p-6 z-50 animate-fade-in">
            <h3 className="font-bold text-gray-900 mb-4">Advanced Filters</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Filtro de precio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Filtro de categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary">
                  <option value="">All Categories</option>
                  <option value="hamacas">Hammocks</option>
                  <option value="mochilas">Backpacks</option>
                  <option value="sombreros">Hats</option>
                  <option value="silla-hamaca">Hammock Chairs</option>
                  <option value="ropa">Clothing</option>
                  <option value="bolsos">Bags</option>
                  <option value="abanicos">Fans</option>
                  <option value="carteras">Wallets</option>
                  <option value="pulseras">Bracelets</option>
                  <option value="aretes">Earrings</option>
                </select>
              </div>

              {/* Ordenar por */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary">
                  <option value="relevance">Relevance</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A-Z</option>
                  <option value="name_desc">Name: Z-A</option>
                  <option value="newest">Newest</option>
                </select>
              </div>

              {/* Disponibilidad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2 rounded" />
                    <span className="text-sm text-gray-700">In Stock</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2 rounded" />
                    <span className="text-sm text-gray-700">Featured Products</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowFilters(false);
                  handleSearch();
                }}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
