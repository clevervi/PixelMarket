"use client";

import LoyaltyProgram from '@/components/LoyaltyProgram';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function PointsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/profile" 
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors mb-4"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to profile
          </Link>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Loyalty Program
          </h1>
          <p className="text-gray-600">
            Earn points with your purchases and redeem them for amazing rewards
          </p>
        </div>

        {/* Loyalty Program Component */}
        <LoyaltyProgram />
      </div>
    </div>
  );
}
