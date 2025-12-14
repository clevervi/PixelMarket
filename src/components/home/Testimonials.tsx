'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    id: 1,
    name: 'María González',
    role: 'Customer',
    rating: 5,
    comment: 'Beautiful handcrafted products! The quality exceeded my expectations.',
    image: '/assets/testimonials/user1.jpg'
  },
  {
    id: 2,
    name: 'Carlos Ramírez',
    role: 'Customer',
    rating: 5,
    comment: 'Authentic Colombian craftsmanship. Each piece tells a story.',
    image: '/assets/testimonials/user2.jpg'
  },
  {
    id: 3,
    name: 'Ana Silva',
    role: 'Customer',
    rating: 5,
    comment: 'Fast shipping and excellent customer service. Highly recommended!',
    image: '/assets/testimonials/user3.jpg'
  }
];

export default function Testimonials() {
  return (
  <section className="py-16 bg-[#F5F5DC]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#8B4513] mb-4">
            What Our Customers Say
          </h2>
          <p className="text-[#2C1810] max-w-2xl mx-auto">
            Discover why our customers love Ancestral heartbeat
          </p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
          className="testimonials-swiper"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="bg-white rounded-lg p-6 shadow-lg h-full">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-[#8B4513] rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                      <h4 className="font-semibold text-[#2C1810]">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {testimonial.role}
                      </p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 fill-[#F4A460]"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-[#2C1810] italic">
                  &quot;{testimonial.comment}&quot;
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <style jsx global>{`
          .testimonials-swiper .swiper-pagination-bullet {
            background: #8B4513;
            opacity: 0.5;
          }
          .testimonials-swiper .swiper-pagination-bullet-active {
            opacity: 1;
          }
        `}</style>
      </div>
    </section>
  );
}
