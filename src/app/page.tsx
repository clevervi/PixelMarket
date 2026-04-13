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
  const featuredProducts = products.filter((p) => p.is_featured_admin);

  return (
    <div>
      {/* Hero Slider */}
      <HeroSliderWrapper />

      {/* Featured Assets */}
      <section className="container mx-auto px-4 py-24 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-primary/5 blur-[120px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 relative z-10">
          <div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4">
              Featured <span className="text-primary italic">Assets</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-xl">
              Hand-picked premium logic, visuals, and hardware from top-tier digital architects.
            </p>
          </div>
          <Link href="/collections/all" className="group flex items-center text-primary font-bold text-lg hover:text-secondary transition-colors">
            View Protocol All Assets
            <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Tech Stack Categories */}
      <section className="bg-slate-50 py-24 border-y border-slate-200 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 underline-offset-8">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">
              The Developer <span className="text-accent underline">Nexus</span>
            </h2>
            <p className="text-slate-500 text-lg">Browse specific domains of our digital ecosystem</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/collections/${category.id}`}
                className="group relative overflow-hidden rounded-3xl shadow-2xl h-96 block transform transition-all duration-700 hover:-translate-y-2"
              >
                {/* Image Section with Advanced Effects */}
                <div className="absolute inset-0">
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    fill
                    className="object-cover transition-all duration-700 brightness-[0.4] group-hover:brightness-75 group-hover:scale-110 grayscale-[0.8] group-hover:grayscale-0"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Digital Grid Overlay */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-20" />
                </div>
                
                {/* Advanced Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent transition-all duration-500 z-10 opacity-90 group-hover:opacity-60" />
                
                {/* Card Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 z-20">
                  <div className="mb-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/80 bg-accent/10 px-3 py-1 rounded-full backdrop-blur-md border border-accent/20">
                      Module Type
                    </span>
                  </div>
                  <h3 className="text-3xl font-black text-white mb-2 tracking-tight group-hover:text-accent transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="text-slate-400 group-hover:text-white transition-colors duration-300 text-sm leading-relaxed max-w-[90%]">
                    {category.description}
                  </p>
                  
                  <div className="mt-6 flex items-center text-accent group-hover:translate-x-2 transition-all duration-400">
                    <span className="font-bold text-sm tracking-widest uppercase">{t.home.exploreCollection}</span>
                    <svg className="w-5 h-5 ml-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About / Philosophy Section */}
      <section className="container mx-auto px-4 py-32 relative overflow-hidden">
        <div className="absolute -right-24 top-0 w-96 h-96 bg-primary/10 blur-[150px] rounded-full" />
        <div className="absolute -left-24 bottom-0 w-96 h-96 bg-accent/10 blur-[150px] rounded-full" />

        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="flex-1">
            <h2 className="text-5xl md:text-7xl font-black mb-8 text-slate-900 tracking-tighter leading-none">
              Engineering <br/>
              <span className="text-primary italic">Excellence</span>
            </h2>
            <div className="w-20 h-2 bg-primary mb-10 rounded-full" />
            <p className="text-xl text-slate-600 mb-10 leading-relaxed font-medium">
              {t.home.traditionText}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/essence" className="btn-primary flex items-center gap-2 group">
                {t.home.learnMoreAboutUs}
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7 text-white" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <div className="flex items-center gap-2 px-6 py-4 border border-slate-200 rounded-2xl text-slate-500 font-bold bg-white/50 backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Network Latency: Optimal
              </div>
            </div>
          </div>
          <div className="flex-1 bg-slate-900 aspect-square rounded-[40px] relative overflow-hidden shadow-2xl rotate-3 transform hover:rotate-0 transition-all duration-700">
             <Image 
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
                alt="Tech core"
                fill
                className="object-cover opacity-60"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
             <div className="absolute bottom-10 left-10 text-white">
                <div className="text-xs font-black uppercase tracking-widest text-primary mb-2">Internal Framework</div>
                <div className="text-2xl font-bold">Standardized Development</div>
             </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <Testimonials />

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
}
