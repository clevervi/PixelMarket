'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { categories } from '@/data/products';

interface FilterState {
  categories: string[];
  priceRange: [number, number];
  colors: string[];
  inStock: boolean;
}

interface ProductFilterProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

const colors = [
  { name: 'Multicolor', value: 'Multicolor', color: 'linear-gradient(to right, red, orange, yellow, green, blue, purple)' },
  { name: 'Natural', value: 'Natural', color: '#F5DEB3' },
  { name: 'Brown', value: 'Café', color: '#8B4513' },
  { name: 'White', value: 'White', color: '#FFFFFF' },
  { name: 'Black', value: 'Black', color: '#000000' },
  { name: 'Blue', value: 'Blue', color: '#4169E1' },
  { name: 'Red', value: 'Red', color: '#DC143C' },
  { name: 'Green', value: 'Green', color: '#228B22' },
  { name: 'Pink', value: 'Pink', color: '#FF69B4' },
  { name: 'Gold', value: 'Gold', color: '#FFD700' },
];

export default function ProductFilter({ filters, onFilterChange, onClose, isMobile = false }: ProductFilterProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true,
    price: true,
    colors: true,
    stock: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(c => c !== categoryId)
      : [...filters.categories, categoryId];
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handleColorToggle = (color: string) => {
    const newColors = filters.colors.includes(color)
      ? filters.colors.filter(c => c !== color)
      : [...filters.colors, color];
    onFilterChange({ ...filters, colors: newColors });
  };

  const handlePriceChange = (index: 0 | 1, value: number) => {
    const newRange: [number, number] = [...filters.priceRange];
    newRange[index] = value;
    onFilterChange({ ...filters, priceRange: newRange });
  };

  const clearAllFilters = () => {
    onFilterChange({
      categories: [],
      priceRange: [0, 1000000],
      colors: [],
      inStock: false,
    });
  };

  const activeFiltersCount = 
    filters.categories.length + 
    filters.colors.length + 
    (filters.inStock ? 1 : 0);

  return (
    <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md h-fit">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-dark dark:text-dark-text">Filters</h2>
            {activeFiltersCount > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {activeFiltersCount} active filter{activeFiltersCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          {isMobile && onClose && (
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-dark-brown rounded-lg">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="mt-3 text-sm text-primary hover:text-secondary font-semibold"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Categories */}
        <div>
          <button
            onClick={() => toggleSection('categories')}
            className="flex items-center justify-between w-full mb-4"
          >
            <h3 className="font-semibold text-dark dark:text-dark-text">Categories</h3>
            {expandedSections.categories ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>
          {expandedSections.categories && (
            <div className="space-y-2">
              {categories.map(category => (
                <label
                  key={category.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-brown cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-dark dark:text-dark-text capitalize">
                    {category.name}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full mb-4"
          >
            <h3 className="font-semibold text-dark dark:text-dark-text">Price Range</h3>
            {expandedSections.price ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>
          {expandedSections.price && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-primary dark:bg-dark-brown dark:text-dark-text"
                  placeholder="Min"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-primary dark:bg-dark-brown dark:text-dark-text"
                  placeholder="Max"
                />
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                ${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()} COP
              </div>
            </div>
          )}
        </div>

        {/* Colors */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
          <button
            onClick={() => toggleSection('colors')}
            className="flex items-center justify-between w-full mb-4"
          >
            <h3 className="font-semibold text-dark dark:text-dark-text">Colors</h3>
            {expandedSections.colors ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>
          {expandedSections.colors && (
            <div className="grid grid-cols-5 gap-3">
              {colors.map(color => (
                <button
                  key={color.value}
                  onClick={() => handleColorToggle(color.value)}
                  className={`
                    relative w-10 h-10 rounded-full border-2 transition-all
                    ${filters.colors.includes(color.value)
                      ? 'border-primary scale-110'
                      : 'border-gray-300 dark:border-gray-700 hover:scale-105'
                    }
                  `}
                  style={{
                    background: color.color,
                    boxShadow: color.value === 'White' ? 'inset 0 0 0 1px rgba(0,0,0,0.1)' : 'none'
                  }}
                  title={color.name}
                >
                  {filters.colors.includes(color.value) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white dark:bg-dark-bg rounded-full" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Stock Status */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
          <button
            onClick={() => toggleSection('stock')}
            className="flex items-center justify-between w-full mb-4"
          >
            <h3 className="font-semibold text-dark dark:text-dark-text">Availability</h3>
            {expandedSections.stock ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>
          {expandedSections.stock && (
            <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-brown cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => onFilterChange({ ...filters, inStock: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-dark dark:text-dark-text">
                In Stock Only
              </span>
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
