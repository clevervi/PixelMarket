'use client';

import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import NewsletterSection from "@/components/NewsletterSection";
import HeroSliderWrapper from "@/components/home/HeroSliderWrapper";
import Testimonials from "@/components/home/Testimonials";
import { products, categories } from "@/data/products";
import { useTranslation } from "@/hooks/useTranslation";

export default function Home() {
  const { t } = useTranslation();
  const featuredProducts = products.filter((p) => p.featured);

  return (
    <div>
      {/* Hero Slider */}
      <HeroSliderWrapper />

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-dark">
          {t.home.featuredProducts}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-dark">
            {t.home.ourCollections}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/collections/${category.id}`}
                className="group relative overflow-hidden rounded-xl shadow-xl h-80 block transform transition-all duration-500 hover:scale-105"
              >
                {/* Imagen con efecto de difuminado/aclarado */}
                <div className="absolute inset-0">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-all duration-500 brightness-50 group-hover:brightness-100 blur-sm group-hover:blur-none"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                
                {/* Gradiente de overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/70 group-hover:via-black/20 transition-all duration-500 z-10" />
                
                {/* Contenido */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                  <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-accent transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="text-gray-200 group-hover:text-white transition-colors duration-300">
                    {category.description}
                  </p>
                  <div className="mt-4 flex items-center text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="font-semibold">{t.home.exploreCollection}</span>
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-dark">
            {t.home.traditionTitle}
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            {t.home.traditionText}
          </p>
          <Link href="/essence" className="btn-primary">
            {t.home.learnMoreAboutUs}
          </Link>
        </div>
      </section>
      
      {/* Testimonials */}
      <Testimonials />

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
}
