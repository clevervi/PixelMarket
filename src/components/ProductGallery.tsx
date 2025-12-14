"use client";

import { useState } from 'react';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight, FiZoomIn, FiX } from 'react-icons/fi';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
        <Image
          src={images[currentIndex]}
          alt={`${productName} - ${currentIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        
        {/* Botón de zoom */}
        <button
          onClick={() => setIsZoomOpen(true)}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
        >
          <FiZoomIn className="w-5 h-5 text-gray-800" />
        </button>

        {/* Navegación de imágenes */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
            >
              <FiChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
            >
              <FiChevronRight className="w-6 h-6 text-gray-800" />
            </button>

            {/* Indicador de posición */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex ? 'bg-white w-8' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative aspect-square rounded-lg overflow-hidden transition-all ${
                idx === currentIndex
                  ? 'ring-2 ring-primary scale-105'
                  : 'hover:ring-2 hover:ring-gray-300'
              }`}
            >
              <Image
                src={image}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Modal de zoom */}
      {isZoomOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-all"
          >
            <FiX className="w-6 h-6 text-white" />
          </button>

          <div className="relative w-full h-full max-w-6xl max-h-[90vh]">
            <Image
              src={images[currentIndex]}
              alt={`${productName} zoom`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm p-4 rounded-full hover:bg-white/20 transition-all"
              >
                <FiChevronLeft className="w-8 h-8 text-white" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm p-4 rounded-full hover:bg-white/20 transition-all"
              >
                <FiChevronRight className="w-8 h-8 text-white" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
