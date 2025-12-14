import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Review } from '@/types';

interface ReviewStore {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'helpful'>) => void;
  getProductReviews: (productId: string) => Review[];
  markHelpful: (reviewId: string) => void;
  getAverageRating: (productId: string) => number;
}

export const useReviewStore = create<ReviewStore>()(
  persist(
    (set, get) => ({
      reviews: [],

      addReview: (review) => {
        const newReview: Review = {
          ...review,
          id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          helpful: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ reviews: [...state.reviews, newReview] }));
      },

      getProductReviews: (productId) => {
        return get().reviews
          .filter((review) => review.productId === productId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      markHelpful: (reviewId) => {
        set((state) => ({
          reviews: state.reviews.map((review) =>
            review.id === reviewId
              ? { ...review, helpful: review.helpful + 1 }
              : review
          ),
        }));
      },

      getAverageRating: (productId) => {
        const productReviews = get().getProductReviews(productId);
        if (productReviews.length === 0) return 0;
        const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
        return sum / productReviews.length;
      },
    }),
    {
      name: 'reviews-storage',
      skipHydration: true,
    }
  )
);
