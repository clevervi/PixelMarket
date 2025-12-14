"use client";

import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import { products, categories } from "@/data/products";
import Link from "next/link";
import { useState, useMemo, use } from "react";

interface CategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { id } = use(params);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const category = categories.find((c) => c.id === id);

  if (!category) {
    notFound();
  }

  const categoryProducts = products.filter((p) => p.category === id);

  // Obtener colores únicos de los productos de esta categoría
  const availableColors = useMemo(() => {
    const colors = categoryProducts
      .map((p) => p.color)
      .filter((color): color is string => !!color);
    return Array.from(new Set(colors)).sort();
  }, [categoryProducts]);

  // Filtrar productos basado en búsqueda
  const filteredProducts = useMemo(() => {
    return categoryProducts.filter((product) => {
      const matchesSearch = searchTerm
        ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      const matchesColor = selectedColor
        ? product.color === selectedColor
        : true;

      return matchesSearch && matchesColor;
    });
  }, [categoryProducts, searchTerm, selectedColor]);

  const handleSearch = (term: string, color: string) => {
    setSearchTerm(term);
    setSelectedColor(color);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Breadcrumb */}
      <nav className="mb-8 text-gray-600">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        {" / "}
        <Link href="/collections" className="hover:text-primary">
          collections
        </Link>
        {" / "}
        <span className="text-dark font-semibold">{category.name}</span>
      </nav>

      {/* Category Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-4 text-dark">{category.name}</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {category.description}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {categoryProducts.length} {categoryProducts.length === 1 ? 'product' : 'products'} available
        </p>
      </div>

      {/* Search Bar */}
      {categoryProducts.length > 0 && (
        <SearchBar
          onSearch={handleSearch}
          availableColors={availableColors}
        />
      )}

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <>
          <div className="mb-4 text-gray-600">
         Showing <strong>{filteredProducts.length}</strong> from  <strong>{categoryProducts.length}</strong> products
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      ) : categoryProducts.length > 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-lg">
          <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xl text-gray-600 mb-4">
           No products were found with the selected filters.
          </p>
          <button
            onClick={() => handleSearch("", "")}
            className="btn-primary"
          >
            Clean filters
          </button>
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600 mb-6">
           There are currently no products in this category.
          </p>
          <Link href="/collections" className="btn-primary">
           See All Collections
          </Link>
        </div>
      )}

      {/* Back to Collections */}
      <div className="text-center mt-12">
        <Link
          href="/collections"
          className="inline-flex items-center text-primary hover:text-secondary transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
       Back to Collections
        </Link>
      </div>
    </div>
  );
}
