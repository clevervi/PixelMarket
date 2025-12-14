'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaThumbsUp, FaCheckCircle, FaImage, FaVideo } from 'react-icons/fa';
import StarRating from './StarRating';
import { useReviewStore } from '@/store/reviewStore';
import { getCurrentUser } from '@/lib/auth-storage';
import type { Review } from '@/types';

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const router = useRouter();
  const { getProductReviews, addReview, markHelpful, getAverageRating } = useReviewStore();
  const [user, setUser] = useState<any>(null);
  const reviews = getProductReviews(productId);
  const averageRating = getAverageRating(productId);

  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      if (window.confirm('You must be logged in to leave a review. Would you like to log in now?')) {
        router.push('/login');
      }
      return;
    }

    addReview({
      productId,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      rating,
      title,
      comment,
      images: images.length > 0 ? images : undefined,
      videos: videos.length > 0 ? videos : undefined,
      verifiedPurchase: false, // You can implement this check with actual order data
    });

    // Reset form
    setShowForm(false);
    setRating(5);
    setTitle('');
    setComment('');
    setImages([]);
    setVideos([]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Simulating upload - in production, you would upload to a server
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newVideos = Array.from(files).map(file => URL.createObjectURL(file));
      setVideos([...videos, ...newVideos]);
    }
  };

  return (
    <div className="bg-[#FAEBD7] rounded-xl shadow-lg p-6 mb-6 border-2 border-[#F4A460] space-y-6">
      {/* Header with summary */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-[#8B4513]">Customer Reviews</h2>
          <button
            onClick={() => {
              if (!user) {
                if (window.confirm('You must be logged in to write a review. Would you like to log in now?')) {
                  router.push('/login');
                }
                return;
              }
              setShowForm(!showForm);
            }}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
          >
            {user ? 'Write a Review' : 'Login to Review'}
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold text-[#8B4513]">{averageRating.toFixed(1)}</div>
          <div>
            <StarRating rating={averageRating} size={24} />
            <p className="text-sm text-[#2C1810] mt-1">
              Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </p>
          </div>
        </div>
      </div>

      {/* Formulario de nueva reseña */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#FFF8DC] p-6 rounded-lg space-y-4 border-2 border-[#F4A460]">
          <h3 className="text-xl font-semibold text-[#8B4513]">Write your review</h3>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#2C1810]">
              Rating
            </label>
            <StarRating 
              rating={rating} 
              interactive 
              size={32} 
              onRatingChange={setRating}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#2C1810]">
              Review title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-[#D2691E] rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-[#2C1810]"
              placeholder="Summarize your experience"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#2C1810]">
              Your review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-[#D2691E] rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-[#2C1810]"
              placeholder="Tell us more about your experience with this product"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-[#2C1810]">
                <FaImage className="inline mr-2 text-[#8B4513]" />
                Add photos
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="w-full"
              />
              {images.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {images.map((img, idx) => (
                    <img 
                      key={idx} 
                      src={img} 
                      alt={`Preview ${idx}`} 
                      className="w-20 h-20 object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-[#2C1810]">
                <FaVideo className="inline mr-2 text-[#8B4513]" />
                Add videos
              </label>
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={handleVideoUpload}
                className="w-full"
              />
              {videos.length > 0 && (
                <p className="text-sm text-[#2C1810] mt-2">
                  {videos.length} video(s) selected
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
            >
              Publish Review
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Lista de reseñas */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-center text-[#8B4513] py-8">
            Be the first to leave a review
          </p>
        ) : (
          reviews.map((review) => (
            <ReviewCard key={review.id} review={review} onMarkHelpful={markHelpful} />
          ))
        )}
      </div>
    </div>
  );
}

function ReviewCard({ review, onMarkHelpful }: { review: Review; onMarkHelpful: (id: string) => void }) {
  return (
    <div className="bg-[#FDF5E6] rounded-lg border-2 border-[#F4A460] p-6 space-y-3 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#8B4513]">{review.userName}</span>
            {review.verifiedPurchase && (
              <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                <FaCheckCircle />
                Verified Purchase
              </span>
            )}
          </div>
          <StarRating rating={review.rating} size={16} />
        </div>
        <span className="text-sm text-[#2C1810]">
          {new Date(review.createdAt).toLocaleDateString('es-ES')}
        </span>
      </div>

      <h4 className="font-semibold text-[#8B4513]">{review.title}</h4>
      <p className="text-[#2C1810]">{review.comment}</p>

      {/* Imágenes */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {review.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Review image ${idx}`}
              className="w-24 h-24 object-cover rounded cursor-pointer hover:opacity-80"
              onClick={() => window.open(img, '_blank')}
            />
          ))}
        </div>
      )}

      {/* Videos */}
      {review.videos && review.videos.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {review.videos.map((video, idx) => (
            <video
              key={idx}
              src={video}
              controls
              className="w-48 h-32 rounded"
            />
          ))}
        </div>
      )}

      {/* Útil */}
      <div className="flex items-center gap-2 pt-3 border-t border-[#F4A460]">
        <button
          onClick={() => onMarkHelpful(review.id)}
          className="flex items-center gap-2 text-sm text-[#8B4513] hover:text-secondary transition-colors"
        >
          <FaThumbsUp />
          Helpful ({review.helpful})
        </button>
      </div>
    </div>
  );
}
