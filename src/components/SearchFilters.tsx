'use client';

import { useState } from 'react';
import { SearchFilters as ISearchFilters } from '@/types';
import { categories } from '@/data/products';
import { FiX } from 'react-icons/fi';

interface SearchFiltersProps {
  filters: ISearchFilters;
  onFilterChange: (filters: ISearchFilters) => void;
  onClose?: () => void;
}

export default function SearchFilters({ filters, onFilterChange, onClose }: SearchFiltersProps) {
  const [localFilters, setLocalFilters] = useState<ISearchFilters>(filters);

  const handleChange = (key: keyof ISearchFilters, value: string | number | string[] | undefined) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    if (type === 'min') {
      handleChange('minPrice', numValue);
    } else {
      handleChange('maxPrice', numValue);
    }
  };

  const resetFilters = () => {
    const emptyFilters: ISearchFilters = {};
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const colors = ['Blanco', 'Negro', 'Café', 'Beige', 'Azul', 'Verde', 'Rojo', 'Rosa', 'Multicolor', 'Natural', 'Crema', 'Dorado', 'Gris', 'Morado', 'Naranja'];
  const materials = ['Caña flecha', 'Algodón', 'Palma', 'Iraca', 'Mimbre', 'Crochet', 'Mostacilla', 'Macramé', 'Hilo', 'Bambú'];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Filtros</h3>
        {onClose && (
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Categoría */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Categoría
          </label>
          <select
            value={localFilters.category || ''}
            onChange={(e) => handleChange('category', e.target.value || undefined)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Rango de precio */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Rango de Precio
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder="Mín"
              value={localFilters.minPrice || ''}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              placeholder="Máx"
              value={localFilters.maxPrice || ''}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Color
          </label>
          <select
            value={localFilters.color || ''}
            onChange={(e) => handleChange('color', e.target.value || undefined)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Todos los colores</option>
            {colors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>

        {/* Material */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Material
          </label>
          <select
            value={localFilters.material || ''}
            onChange={(e) => handleChange('material', e.target.value || undefined)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Todos los materiales</option>
            {materials.map((material) => (
              <option key={material} value={material}>
                {material}
              </option>
            ))}
          </select>
        </div>

        {/* Ordenar por */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Ordenar por
          </label>
          <select
            value={localFilters.sortBy || ''}
            onChange={(e) => handleChange('sortBy', e.target.value || undefined)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Predeterminado</option>
            <option value="price_asc">Precio: Menor a Mayor</option>
            <option value="price_desc">Precio: Mayor a Menor</option>
            <option value="name_asc">Nombre: A-Z</option>
            <option value="name_desc">Nombre: Z-A</option>
            <option value="newest">Más Recientes</option>
            <option value="rating">Mejor Calificación</option>
          </select>
        </div>

        {/* Botones */}
        <div className="flex gap-2 pt-4">
          <button
            onClick={resetFilters}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Limpiar
          </button>
        </div>
      </div>
    </div>
  );
}
