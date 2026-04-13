"use client";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css/pagination";
import "swiper/css";
import Image from "next/image";
import Link from "next/link";

const HeroCarousel = () => {
  const [swiper, setSwiper] = useState<any>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      id: 1,
      tag: "NEW RELEASE",
      title: "Advanced Node Security Engine",
      description: "Secure your distributed systems with real-time threat detection and automated response modules.",
      price: "$199",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&q=80&w=800",
      link: "/shop?category=scripts-modules",
      bgClass: "bg-gradient-to-r from-slate-900 to-indigo-950",
    },
    {
      id: 2,
      tag: "FEATURED KIT",
      title: "Nexus Design System Pro",
      description: "Accelerate your development with 500+ premium React components and fully documented UI patterns.",
      price: "$89",
      image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=800",
      link: "/shop?category=ui-ux-kits",
      bgClass: "bg-gradient-to-r from-indigo-950 to-slate-900",
    },
    {
      id: 3,
      tag: "HARDWARE",
      title: "PixelBoard Mechanical Series",
      description: "Precision-engineered mechanical keyboards designed specifically for long coding sessions.",
      price: "$249",
      image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800",
      link: "/shop?category=hardware-dev",
      bgClass: "bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900",
    }
  ];

  return (
    <div className="relative group">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={false}
        modules={[Autoplay, Pagination]}
        className="hero-carousel rounded-3xl overflow-hidden shadow-2xl border border-white/10"
        onSwiper={setSwiper}
        onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className={`flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row h-[500px] lg:h-[600px] ${slide.bgClass} relative overflow-hidden`}>
              {/* Decorative Mesh Gradient Background */}
              <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent blur-[120px]" />
              </div>

              {/* Grid Overlay */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />

              <div className="relative z-10 max-w-[600px] py-10 sm:py-15 lg:py-24 pl-8 sm:pl-12 lg:pl-16">
                <div className="flex items-center gap-4 mb-6">
                  <span className="px-3 py-1 text-xs font-bold tracking-widest text-accent border border-accent/30 rounded-full bg-accent/10">
                    {slide.tag}
                  </span>
                  <span className="text-sm font-medium text-slate-400">
                    Starting at <span className="text-white font-bold">{slide.price}</span>
                  </span>
                </div>

                <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-7xl mb-6 text-white leading-tight">
                  {slide.title}
                </h1>

                <p className="text-slate-300 text-lg mb-10 max-w-md leading-relaxed">
                  {slide.description}
                </p>

                <div className="flex gap-4">
                  <Link
                    href={slide.link}
                    className="inline-flex items-center font-bold text-white text-sm rounded-xl py-4 px-10 bg-primary hover:bg-secondary transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1"
                  >
                    Get Access Now
                  </Link>
                  <Link
                    href="/collections"
                    className="inline-flex items-center font-bold text-white text-sm rounded-xl py-4 px-10 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all duration-300 hover:-translate-y-1"
                  >
                    View Demo
                  </Link>
                </div>
              </div>

              <div className="relative z-10 flex-1 flex items-center justify-center p-12 lg:p-20">
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Glowing light behind image */}
                  <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full transform scale-75 animate-pulse" />
                  
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    width={600}
                    height={600}
                    className="object-contain drop-shadow-[0_20px_50px_rgba(99,102,241,0.5)] transform hover:scale-105 transition-transform duration-700"
                    priority
                  />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom navigation controls */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => swiper?.slideTo(index)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              activeSlide === index ? 'bg-accent w-12' : 'bg-white/20 w-4 hover:bg-white/40'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
