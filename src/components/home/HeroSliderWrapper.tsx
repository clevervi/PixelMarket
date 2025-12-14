'use client';

import dynamic from 'next/dynamic';

// Dynamically import HeroCarousel with SSR disabled to avoid Swiper location errors
const HeroCarousel = dynamic(() => import('./HeroCarousel'), {
  ssr: false,
  loading: () => (
    <div className="relative bg-gradient-to-b from-gray-50 to-white dark:from-dark-bg dark:to-dark-surface overflow-hidden">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-r from-primary to-secondary min-h-[400px] lg:min-h-[500px] animate-pulse" />
      </div>
    </div>
  ),
});

export default function HeroSliderWrapper() {
  return (
    <section className="relative overflow-hidden py-10 lg:py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <HeroCarousel />
      </div>
    </section>
  );
}
