'use client';

import Image from 'next/image';
import { useState } from 'react';
import { FaSearchPlus, FaSearchMinus, FaTimes } from 'react-icons/fa';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleImageClick = () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
    } else {
      setIsZoomed(!isZoomed);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg border-2 border-gray-200 bg-white">
          <Image
            src={images[selectedImage]}
            alt={`${productName} - Image ${selectedImage + 1}`}
            fill
            className="object-cover cursor-zoom-in transition-transform duration-300"
            onClick={handleImageClick}
            priority
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFullscreen(true);
            }}
            className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            aria-label="Zoom image"
          >
            <FaSearchPlus size={20} className="text-[#8B4513]" />
          </button>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === idx 
                    ? 'border-[#8B4513] ring-2 ring-[#8B4513] ring-offset-2' 
                    : 'border-gray-200 hover:border-[#D2691E]'
                }`}
                aria-label={`View image ${idx + 1}`}
              >
                <Image 
                  src={img} 
                  alt={`Thumbnail ${idx + 1}`} 
                  fill 
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"
            aria-label="Close fullscreen"
          >
            <FaTimes size={24} className="text-[#8B4513]" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(!isZoomed);
            }}
            className="absolute top-4 left-4 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"
            aria-label={isZoomed ? "Zoom out" : "Zoom in"}
          >
            {isZoomed ? (
              <FaSearchMinus size={24} className="text-[#8B4513]" />
            ) : (
              <FaSearchPlus size={24} className="text-[#8B4513]" />
            )}
          </button>

          <div 
            className="relative max-w-7xl w-full h-full flex items-center justify-center overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`relative transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}>
              <Image
                src={images[selectedImage]}
                alt={`${productName} - Fullscreen`}
                width={1200}
                height={1200}
                className="object-contain max-h-[90vh]"
                onClick={handleImageClick}
              />
            </div>
          </div>

          {/* Thumbnail Navigation in Fullscreen */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white bg-opacity-90 p-2 rounded-lg">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(idx);
                  }}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === idx 
                      ? 'border-[#8B4513] ring-2 ring-[#8B4513]' 
                      : 'border-gray-300 hover:border-[#D2691E]'
                  }`}
                >
                  <Image 
                    src={img} 
                    alt={`Thumbnail ${idx + 1}`} 
                    fill 
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
