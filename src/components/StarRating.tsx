'use client';

import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  size?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export default function StarRating({
  rating,
  totalStars = 5,
  size = 20,
  interactive = false,
  onRatingChange,
}: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);

  const handleClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {/* Estrellas completas */}
      {Array.from({ length: fullStars }).map((_, index) => (
        <FaStar
          key={`full-${index}`}
          size={size}
          className={`text-yellow-400 ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
          onClick={() => handleClick(index)}
        />
      ))}

      {/* Media estrella */}
      {hasHalfStar && (
        <FaStarHalfAlt
          size={size}
          className={`text-yellow-400 ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
          onClick={() => handleClick(fullStars)}
        />
      )}

      {/* Estrellas vacías */}
      {Array.from({ length: emptyStars }).map((_, index) => (
        <FaRegStar
          key={`empty-${index}`}
          size={size}
          className={`text-yellow-400 ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
          onClick={() => handleClick(fullStars + (hasHalfStar ? 1 : 0) + index)}
        />
      ))}
    </div>
  );
}
