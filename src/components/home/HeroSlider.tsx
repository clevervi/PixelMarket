'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const slides = [
  {
    id: 1,
    title: 'Authentic Colombian Handicrafts',
    description: 'Discover the beauty of handmade vueltiao hats, woven with tradition and passion',
    image: '/assets/assets11/sombrero-vueltiao.webp',
    discount: '20',
    link: '/collections/hats',
    buttonText: 'Shop Hats'
  },
  {
    id: 2,
    title: 'Traditional Wayuu Backpacks',
    description: 'Each backpack tells an ancestral story, handcrafted with love and dedication',
    image: '/assets/assets11/mochila.webp',
    discount: '15',
    link: '/collections/backpacks',
    buttonText: 'Shop Backpacks'
  },
  {
    id: 3,
    title: 'Handwoven Hammocks',
    description: 'Relax in comfort with our traditional Colombian hammocks',
    image: '/assets/assets11/hamaca.webp',
    discount: '25',
    link: '/collections/hammocks',
    buttonText: 'Shop Hammocks'
  },
];

export default function HeroSlider() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="relative bg-gradient-to-b from-gray-50 to-white dark:from-dark-bg dark:to-dark-surface overflow-hidden">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-r from-primary to-secondary min-h-[500px] lg:min-h-[600px] animate-pulse" />
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white dark:from-dark-bg dark:to-dark-surface overflow-hidden">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !bg-primary',
            bulletActiveClass: 'swiper-pagination-bullet-active !bg-primary',
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="hero-slider rounded-2xl shadow-2xl overflow-hidden"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative bg-gradient-to-r from-primary to-secondary text-white">
                <div className="flex flex-col lg:flex-row items-center min-h-[500px] lg:min-h-[600px]">
                  {/* Content */}
                  <div className="w-full lg:w-1/2 p-8 lg:p-16 z-10">
                    {/* Discount Badge */}
                    <div className="inline-flex items-center gap-3 mb-6 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                      <span className="text-5xl font-bold text-white">
                        {slide.discount}%
                      </span>
                      <span className="text-lg font-medium">
                        OFF
                        <br />
                        Sale
                      </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight">
                      {slide.title}
                    </h1>

                    {/* Description */}
                    <p className="text-lg lg:text-xl mb-8 text-white/90 max-w-xl">
                      {slide.description}
                    </p>

                    {/* CTA Button */}
                    <Link
                      href={slide.link}
                      className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-xl"
                    >
                      {slide.buttonText}
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </Link>
                  </div>

                  {/* Image */}
                  <div className="w-full lg:w-1/2 relative h-[300px] lg:h-full">
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-primary/50 lg:to-transparent z-10" />
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={slide.id === 1}
                    />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: '🚚',
              title: 'Free Shipping',
              description: 'For orders over $200,000 COP',
            },
            {
              icon: '↩️',
              title: 'Easy Returns',
              description: '30-day return policy',
            },
            {
              icon: '🔒',
              title: 'Secure Payment',
              description: '100% secure transactions',
            },
            {
              icon: '📞',
              title: '24/7 Support',
              description: 'Dedicated customer service',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-6 bg-white dark:bg-dark-surface rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-4xl">{feature.icon}</div>
              <div>
                <h3 className="font-bold text-lg text-dark dark:text-dark-text mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .hero-slider .swiper-button-next,
        .hero-slider .swiper-button-prev {
          color: white;
          background: rgba(139, 69, 19, 0.8);
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }

        .hero-slider .swiper-button-next:hover,
        .hero-slider .swiper-button-prev:hover {
          background: rgba(139, 69, 19, 1);
        }

        .hero-slider .swiper-button-next:after,
        .hero-slider .swiper-button-prev:after {
          font-size: 20px;
        }

        .hero-slider .swiper-pagination {
          bottom: 20px;
        }

        .hero-slider .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: white;
          opacity: 0.5;
        }

        .hero-slider .swiper-pagination-bullet-active {
          opacity: 1;
          background: white;
        }
      `}</style>
    </section>
  );
}
