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

  return (
    <div>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={false}
        modules={[Autoplay, Pagination]}
        className="hero-carousel rounded-lg"
        onSwiper={setSwiper}
        onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
      >
      {/* Slide 1 */}
      <SwiperSlide>
  <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row h-[500px] bg-[#FFF8DC]">
          <div className="max-w-[500px] py-10 sm:py-15 lg:py-24 pl-4 sm:pl-7.5 lg:pl-12">
            <div className="flex items-center gap-4 mb-7.5 sm:mb-10">
              <span className="block font-semibold text-5xl sm:text-6xl" style={{ color: '#8B4513' }}>
                30%
              </span>
              <span className="block text-sm sm:text-lg font-medium text-gray-800">
                OFF
                <br />
                Sale
              </span>
            </div>

            <h1 className="font-bold text-2xl sm:text-4xl mb-3" style={{ color: '#8B4513' }}>
              Handcrafted Vueltiao Hats
            </h1>

            <p className="text-gray-700 mb-6">
              Authentic Colombian traditional hats, woven with ancestral techniques passed down through generations.
            </p>

            <Link
              href="/shop"
              className="inline-flex font-medium text-white text-sm rounded-md py-3 px-9 ease-out duration-200"
              style={{ backgroundColor: '#8B4513' }}
            >
              Shop Now
            </Link>
          </div>

          <div className="flex-1 flex items-center justify-center p-8">
            <Image
              src="/assets/assets11/sombrero-vueltiao.webp"
              alt="Vueltiao Hat"
              width={400}
              height={400}
              className="object-contain"
            />
          </div>
        </div>
      </SwiperSlide>

      {/* Slide 2 */}
      <SwiperSlide>
  <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row h-[500px] bg-[#FFF8DC]">
          <div className="max-w-[500px] py-10 sm:py-15 lg:py-24 pl-4 sm:pl-7.5 lg:pl-12">
            <div className="flex items-center gap-4 mb-7.5 sm:mb-10">
              <span className="block font-semibold text-5xl sm:text-6xl" style={{ color: '#8B4513' }}>
                25%
              </span>
              <span className="block text-sm sm:text-lg font-medium text-gray-800">
                OFF
                <br />
                Sale
              </span>
            </div>

            <h1 className="font-bold text-2xl sm:text-4xl mb-3" style={{ color: '#8B4513' }}>
              Traditional Hammocks & Chairs
            </h1>

            <p className="text-gray-700 mb-6">
              Relax in comfort with our handwoven hammocks and chairs, crafted by Colombian artisans.
            </p>

            <Link
              href="/shop?category=hammocks"
              className="inline-flex font-medium text-white text-sm rounded-md py-3 px-9 ease-out duration-200"
              style={{ backgroundColor: '#8B4513' }}
            >
              Explore Collection
            </Link>
          </div>

          <div className="flex-1 flex items-center justify-center p-8">
            <Image
              src="/assets/assets11/silla-hamaca.webp"
              alt="Hammock Chair"
              width={400}
              height={400}
              className="object-contain"
            />
          </div>
        </div>
      </SwiperSlide>

      {/* Slide 3 */}
      <SwiperSlide>
  <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row h-[500px] bg-[#FFF8DC]">
          <div className="max-w-[500px] py-10 sm:py-15 lg:py-24 pl-4 sm:pl-7.5 lg:pl-12">
            <div className="flex items-center gap-4 mb-7.5 sm:mb-10">
              <span className="block font-semibold text-5xl sm:text-6xl" style={{ color: '#8B4513' }}>
                NEW
              </span>
              <span className="block text-sm sm:text-lg font-medium text-gray-800">
                Arrival
              </span>
            </div>

            <h1 className="font-bold text-2xl sm:text-4xl mb-3" style={{ color: '#8B4513' }}>
              Artisan Jewelry Collection
            </h1>

            <p className="text-gray-700 mb-6">
              Discover unique bracelets, necklaces, and accessories handmade with traditional Colombian materials.
            </p>

            <Link
              href="/shop?category=jewelry"
              className="inline-flex font-medium text-white text-sm rounded-md py-3 px-9 ease-out duration-200"
              style={{ backgroundColor: '#8B4513' }}
            >
              View Collection
            </Link>
          </div>

          <div className="flex-1 flex items-center justify-center p-8">
            <Image
              src="/assets/assets11/mochila.webp"
              alt="Artisan Bags"
              width={400}
              height={400}
              className="object-contain"
            />
          </div>
        </div>
      </SwiperSlide>
    </Swiper>

    {/* Custom pagination dots below carousel */}
    <div className="flex justify-center gap-3 mt-6">
      {[0, 1, 2].map((index) => (
        <button
          key={index}
          onClick={() => swiper?.slideTo(index)}
          className={`w-3 h-3 rounded-full transition-all ${
            activeSlide === index ? 'bg-[#8B4513] w-8' : 'bg-[#D2691E]'
          }`}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
    </div>
  );
};

export default HeroCarousel;
