"use client";

import { useState } from "react";

interface SearchBarProps {
  onSearch: (searchTerm: string, color: string) => void;
  availableColors: string[];
}

export default function SearchBar({ onSearch, availableColors }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  // Update state but don't filter until the button is pressed
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedColor(e.target.value);
  };

  const handleSearch = () => {
    onSearch(searchTerm, selectedColor);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedColor("");
    onSearch("", "");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search by name */}
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2">
            Search by name
          </label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Ex: Hammock, Backpack, Bracelet..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>

        {/* Filter by color */}
        <div className="md:w-64">
          <label htmlFor="color" className="block text-sm font-semibold text-gray-700 mb-2">
            Filter by color
          </label>
          <select
            id="color"
            value={selectedColor}
            onChange={handleColorChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white cursor-pointer"
          >
            <option value="">All colors</option>
            {availableColors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>

        {/* Search button */}
        <div className="flex items-end">
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-300 font-semibold whitespace-nowrap"
          >
            Buscar
          </button>
        </div>

        {/* Clear button */}
        {(searchTerm || selectedColor) && (
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-300 font-semibold whitespace-nowrap"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Results indicator */}
      {(searchTerm || selectedColor) && (
        <div className="mt-4 text-sm text-gray-600">
          Filtering by:{" "}
          {searchTerm && (
            <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full mr-2">
              <strong>Name:</strong> "{searchTerm}"
            </span>
          )}
          {selectedColor && (
            <span className="inline-block bg-accent/20 text-dark px-3 py-1 rounded-full">
              <strong>Color:</strong> {selectedColor}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
