'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-storage';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';

export default function ReviewsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    setUser(currentUser);
  }, [router]);

  if (!user) return null;

  const reviews = [
    { id: 1, product: 'Vueltiao Hat', customer: 'John Doe', rating: 5, comment: 'Excellent quality!', date: '2024-01-15', status: 'approved' },
    { id: 2, product: 'Wayuu Bag', customer: 'Jane Smith', rating: 4, comment: 'Beautiful design', date: '2024-01-14', status: 'pending' },
    { id: 3, product: 'Hammock Chair', customer: 'Bob Johnson', rating: 5, comment: 'Very comfortable', date: '2024-01-13', status: 'approved' },
  ];

  return (
    <div className="min-h-screen">
      <DashboardHeader 
        title="Reviews Management" 
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Reviews' }
        ]} 
      />

      <div className="p-6">
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {reviews.map((review) => (
              <div key={review.id} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-dark dark:text-dark-text">{review.product}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">by {review.customer}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-3">{review.comment}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{review.date}</span>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-sm">
                      <ThumbsUp className="w-4 h-4" />
                      Approve
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm">
                      <ThumbsDown className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
