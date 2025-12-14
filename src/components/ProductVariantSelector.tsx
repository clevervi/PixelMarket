"use client";

import { useState } from 'react';
import { ProductVariant } from '@/types';

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  onVariantChange: (variant: ProductVariant) => void;
}

export default function ProductVariantSelector({ 
  variants, 
  onVariantChange 
}: ProductVariantSelectorProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(variants[0]);

  // Extraer opciones únicas
  const sizes = [...new Set(variants.map(v => v.size).filter(Boolean))];
  const colors = [...new Set(variants.map(v => v.color).filter(Boolean))];
  const materials = [...new Set(variants.map(v => v.material).filter(Boolean))];
  const models = [...new Set(variants.map(v => v.model).filter(Boolean))];

  const handleChange = (key: keyof ProductVariant, value: string) => {
    const newVariant = variants.find(v => {
      if (key === 'size') return v.size === value;
      if (key === 'color') return v.color === value;
      if (key === 'material') return v.material === value;
      if (key === 'model') return v.model === value;
      return false;
    });

    if (newVariant) {
      setSelectedVariant(newVariant);
      onVariantChange(newVariant);
    }
  };

  return (
    <div className="space-y-6">
      {/* Selector de Talla */}
      {sizes.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Size
          </label>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const variant = variants.find(v => v.size === size);
              const isSelected = selectedVariant.size === size;
              const isOutOfStock = variant && variant.stock === 0;

              return (
                <button
                  key={size}
                  onClick={() => !isOutOfStock && handleChange('size', size!)}
                  disabled={isOutOfStock}
                  className={`
                    px-4 py-2 rounded-lg border-2 font-medium transition-all
                    ${isSelected 
                      ? 'border-primary bg-primary text-white' 
                      : 'border-gray-300 bg-white text-gray-700 hover:border-primary'
                    }
                    ${isOutOfStock 
                      ? 'opacity-50 cursor-not-allowed line-through' 
                      : 'cursor-pointer'
                    }
                  `}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selector de Color */}
      {colors.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const variant = variants.find(v => v.color === color);
              const isSelected = selectedVariant.color === color;
              const isOutOfStock = variant && variant.stock === 0;

              return (
                <button
                  key={color}
                  onClick={() => !isOutOfStock && handleChange('color', color!)}
                  disabled={isOutOfStock}
                  className={`
                    px-4 py-2 rounded-lg border-2 font-medium transition-all
                    ${isSelected 
                      ? 'border-primary bg-primary text-white' 
                      : 'border-gray-300 bg-white text-gray-700 hover:border-primary'
                    }
                    ${isOutOfStock 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'cursor-pointer'
                    }
                  `}
                >
                  {color}
                  {isOutOfStock && <span className="ml-2 text-xs">(Agotado)</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selector de Material */}
      {materials.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Material
          </label>
          <select
            value={selectedVariant.material || ''}
            onChange={(e) => handleChange('material', e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-all"
          >
            {materials.map((material) => (
              <option key={material} value={material}>
                {material}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Selector de Modelo */}
      {models.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Model
          </label>
          <select
            value={selectedVariant.model || ''}
            onChange={(e) => handleChange('model', e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-all"
          >
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Info de Stock y Precio */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Available Stock:</span>
          <span className={`font-bold ${
            selectedVariant.stock > 10 ? 'text-green-600' :
            selectedVariant.stock > 0 ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {selectedVariant.stock > 0 
              ? `${selectedVariant.stock} unidades` 
              : 'Agotado'
            }
          </span>
        </div>
        
        {selectedVariant.priceModifier && selectedVariant.priceModifier !== 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Price Modifier:</span>
            <span className={`font-bold ${
              selectedVariant.priceModifier > 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {selectedVariant.priceModifier > 0 ? '+' : ''}
              ${selectedVariant.priceModifier.toLocaleString('es-CO')} COP
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
