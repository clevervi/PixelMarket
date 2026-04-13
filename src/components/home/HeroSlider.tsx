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
    title: 'Enterprise UI Solutions',
    description: 'Deploy pixel-perfect interface systems and high-end design assets for your mission-critical applications.',
    image: '/assets/assets11/sombrero-vueltiao.webp', // Keeping original paths for now, following user instruction to replace when ready
    discount: '15',
    link: '/shop?category=UI-Kits',
    buttonText: 'Explore Assets'
  },
  {
    id: 2,
    title: 'System Infrastructure',
    description: 'High-performance clusters and architectural benchmarks designed for maximum scalability.',
    image: '/assets/assets11/mochila.webp',
    discount: '20',
    link: '/shop?category=Infrastructure',
    buttonText: 'Inspect Nodes'
  },
  {
    id: 3,
    title: 'Advanced Operations',
    description: 'Secure, encrypted protocols and verified assets to fortify your operational integrity.',
    image: '/assets/assets11/hamaca.webp',
    discount: '10',
    link: '/shop?category=Security',
    buttonText: 'Execute Access'
  },
];

export default function HeroSlider() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="relative bg-slate-900 overflow-hidden">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="rounded-2xl shadow-2xl overflow-hidden bg-slate-800 min-h-[500px] lg:min-h-[600px] animate-pulse" />
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-slate-950 overflow-hidden">
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
            bulletClass: 'swiper-pagination-bullet !bg-emerald-500',
            bulletActiveClass: 'swiper-pagination-bullet-active !bg-emerald-400',
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="hero-slider rounded-2xl shadow-2xl overflow-hidden glass-morphism border border-white/10"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative bg-slate-900/40 text-white">
                <div className="flex flex-col lg:flex-row items-center min-h-[500px] lg:min-h-[600px]">
                  {/* Content */}
                  <div className="w-full lg:w-1/2 p-8 lg:p-16 z-20 relative">
                    {/* Discount Badge */}
                    <div className="inline-flex items-center gap-3 mb-6 bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 rounded-full px-6 py-3">
                      <span className="text-5xl font-bold text-indigo-400">
                        {slide.discount}%
                      </span>
                      <span className="text-sm font-semibold text-slate-300 leading-tight uppercase tracking-wider">
                        Nexus
                        <br />
                        Credit
                      </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl lg:text-5xl xl:text-7xl font-black mb-6 leading-tight tracking-tight text-white drop-shadow-lg">
                      {slide.title}
                    </h1>

                    {/* Description */}
                    <p className="text-lg lg:text-xl mb-10 text-slate-300 max-w-xl font-medium leading-relaxed">
                      {slide.description}
                    </p>

                    {/* CTA Button */}
                    <Link
                      href={slide.link}
                      className="inline-flex items-center gap-3 bg-indigo-600 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-indigo-500 transform hover:-translate-y-1 transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.4)] group"
                    >
                      {slide.buttonText}
                      <svg
                        className="w-6 h-6 group-hover:translate-x-1 transition-transform"
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
                  <div className="w-full lg:w-1/2 relative h-[400px] lg:h-[600px]">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/20 to-transparent z-10" />
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover object-center grayscale-[20%] brightness-75"
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
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: '🚀',
              title: 'Instant Deployment',
              description: 'Access assets via secure Nexus protocols.',
            },
            {
              icon: '🛡️',
              title: 'Verified Integrity',
              description: 'All components audited for performance.',
            },
            {
              icon: '🔐',
              title: 'Secure Nexus',
              description: 'End-to-end encrypted asset transfers.',
            },
            {
              icon: '💬',
              title: 'Ops Support',
              description: '24/7 technical assistance for entities.',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-5 p-8 bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl shadow-xl hover:bg-slate-800/80 transition-all duration-300 group"
            >
              <div className="text-5xl group-hover:scale-110 transition-transform">{feature.icon}</div>
              <div>
                <h3 className="font-bold text-xl text-white mb-2 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400 font-medium">
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
          background: rgba(30, 41, 59, 0.6);
          backdrop-filter: blur(8px);
          width: 60px;
          height: 60px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .hero-slider .swiper-button-next:hover,
        .hero-slider .swiper-button-prev:hover {
          background: rgba(79, 70, 229, 0.8);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .hero-slider .swiper-button-next:after,
        .hero-slider .swiper-button-prev:after {
          font-size: 24px;
          font-weight: bold;
        }

        .hero-slider .swiper-pagination {
          bottom: 30px;
        }

        .hero-slider .swiper-pagination-bullet {
          width: 30px;
          height: 4px;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.3);
          opacity: 1;
          transition: all 0.3s;
        }

        .hero-slider .swiper-pagination-bullet-active {
          width: 50px;
          background: #34d399; /* emerald-400 */
      `}</style>
    </section>
  );
}
