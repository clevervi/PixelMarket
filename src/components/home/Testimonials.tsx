'use client';

import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    id: 1,
    name: 'Alex Rivera',
    role: 'Lead Fullstack Architect',
    rating: 5,
    comment: 'The quality of the UI kits is unparalleled. Clean components, logic-first architecture, and a design that actually looks senior-level.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'Sarah Chen',
    role: 'CTO @ NexusFlow',
    rating: 5,
    comment: 'We integrated the PixelMarket scripts into our production environment. 0 latency issues and the documentation made it a breeze.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Marcus Thorne',
    role: 'Embedded Systems Engineer',
    rating: 5,
    comment: "The developer hardware is top-notch. High durability and the pre-configured modules saved us weeks of dev time.",
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop'
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-white border-b border-slate-100 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-[0.2em]">
            Verified Feedback
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter">
            Architect & <span className="text-primary italic">Developer</span> Trusted
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Join thousands of senior professionals scaling their infrastructure with PixelMarket assets.
          </p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          pagination={{ 
            clickable: true,
            dynamicBullets: true 
          }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
          className="testimonials-swiper !pb-16"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="bg-slate-50 border border-slate-200 rounded-[32px] p-8 h-full transition-all duration-300 hover:bg-white hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 flex flex-col items-start">
                <div className="flex items-center mb-8 w-full">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md">
                     <Image 
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                     />
                  </div>
                  <div className="ml-5">
                      <h4 className="font-black text-slate-900 tracking-tight">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs font-bold text-primary uppercase tracking-widest">
                        {testimonial.role}
                      </p>
                  </div>
                </div>
                
                <div className="flex mb-6 gap-0.5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 fill-accent"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-slate-600 leading-relaxed font-medium flex-grow">
                  &quot;{testimonial.comment}&quot;
                </p>
                
                <div className="mt-8 pt-6 border-t border-slate-200 w-full flex items-center justify-between opacity-40">
                   <div className="text-[10px] font-black tracking-tighter uppercase">Verified System Log</div>
                   <div className="text-[10px] font-black tracking-tighter uppercase">2026.04.13</div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <style jsx global>{`
          .testimonials-swiper .swiper-pagination-bullet {
            background: var(--primary);
            opacity: 0.2;
            width: 12px;
            height: 4px;
            border-radius: 2px;
            transition: all 0.3s ease;
          }
          .testimonials-swiper .swiper-pagination-bullet-active {
            opacity: 1;
            width: 32px;
          }
        `}</style>
      </div>
    </section>
  );
}
