'use client';

import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import NewsletterSection from "@/components/NewsletterSection";
import HeroSliderWrapper from "@/components/home/HeroSliderWrapper";
import Testimonials from "@/components/home/Testimonials";
import { products, categories } from "@/data/products";
import { useTranslation } from "@/hooks/useTranslation";
import { motion } from "framer-motion";
import { TrendingUp, Shield, Zap, Database } from "lucide-react";

export default function Home() {
  const { t } = useTranslation();
  const featuredProducts = products.filter((p) => p.is_featured_admin);

  return (
    <div className="bg-slate-950 text-white selection:bg-cyan-500/30">
      {/* Hero Slider */}
      <HeroSliderWrapper />

      {/* Market Intel Live Ticker */}
      <div className="w-full bg-slate-900/50 border-y border-white/5 py-4 overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-10" />
        
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap gap-12 items-center"
        >
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-12 items-center">
              <div className="flex items-center gap-2 text-cyan-400 font-black text-[10px] tracking-widest uppercase">
                <TrendingUp size={14} />
                <span>NEXUS-INDEX: +1.24%</span>
              </div>
              <div className="flex items-center gap-2 text-violet-400 font-black text-[10px] tracking-widest uppercase">
                <Database size={14} />
                <span>TOTAL LIQUIDITY: 14.8M CR</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-black text-[10px] tracking-widest uppercase">
                <Shield size={14} />
                <span>AUTH ENTITY: VERIFIED</span>
              </div>
              <div className="flex items-center gap-2 text-amber-400 font-black text-[10px] tracking-widest uppercase">
                <Zap size={14} />
                <span>SYSTEM LATENCY: 12ms</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Featured Assets */}
      <section className="container mx-auto px-4 py-24 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-cyan-500/5 blur-[120px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 relative z-10">
          <div>
            <h2 className="text-4xl md:text-6xl font-black text-white font-nexus tracking-tighter mb-4 italic uppercase">
              Featured <span className="text-cyan-500">Assets</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-xl font-medium">
              Hand-picked premium logic, visuals, and hardware from top-tier digital architects.
            </p>
          </div>
          <Link href="/collections/all" className="group flex items-center text-cyan-500 font-black text-sm uppercase tracking-widest hover:text-white transition-colors">
            Access Full Protocol
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
      <section className="bg-slate-900/30 py-24 border-y border-white/5 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 px-4">
            <h2 className="text-4xl md:text-6xl font-black text-white font-nexus tracking-tighter mb-4 italic uppercase">
              Developer <span className="text-violet-500">Nexus</span>
            </h2>
            <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto italic">Browse specific domains of our digital ecosystem where code meets craftsmanship.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/collections/${category.id}`}
                className="group relative overflow-hidden rounded-3xl h-[450px] block transition-all duration-700 hover:-translate-y-2 border border-white/5"
              >
                {/* Image Section with Advanced Effects */}
                <div className="absolute inset-0">
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    fill
                    className="object-cover transition-all duration-1000 brightness-[0.3] group-hover:brightness-75 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-slate-950/60 mix-blend-multiply transition-opacity duration-700 group-hover:opacity-0" />
                </div>
                
                {/* Visual Glitch Frame */}
                <div className="absolute inset-0 border border-cyan-500/0 group-hover:border-cyan-500/20 transition-all duration-700 m-4 rounded-2xl pointer-events-none" />
                
                {/* Card Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-10 z-20">
                  <div className="mb-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 bg-cyan-400/10 px-4 py-1.5 rounded-full border border-cyan-400/20 backdrop-blur-xl">
                      Module Type: {category.id}
                    </span>
                  </div>
                  <h3 className="text-4xl font-black text-white mb-3 tracking-tighter italic uppercase font-nexus group-hover:text-cyan-400 transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="text-slate-400 group-hover:text-slate-200 transition-colors duration-300 text-sm leading-relaxed max-w-[90%] font-medium">
                    {category.description}
                  </p>
                  
                  <div className="mt-8 flex items-center text-cyan-500 gap-3 group-hover:translate-x-2 transition-all duration-500 opacity-0 group-hover:opacity-100">
                    <span className="font-black text-xs tracking-[0.2em] uppercase">{t.home.exploreCollection}</span>
                    <div className="h-[1px] w-8 bg-cyan-500/50" />
                    <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
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
      <section className="container mx-auto px-4 py-40 relative overflow-hidden">
        <div className="absolute -right-24 top-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[150px] rounded-full" />
        <div className="absolute -left-24 bottom-0 w-[500px] h-[500px] bg-violet-500/10 blur-[150px] rounded-full" />

        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-24 relative z-10">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-[10px] font-black tracking-widest uppercase mb-6">
              <span className="w-1 h-1 rounded-full bg-cyan-500 animate-ping" />
              Core Philosophy
            </div>
            <h2 className="text-6xl md:text-8xl font-black mb-10 text-white font-nexus tracking-tighter leading-[0.9] italic uppercase">
              Engineering <br/>
              <span className="text-cyan-500">Excellence</span>
            </h2>
            <p className="text-xl text-slate-400 mb-12 leading-relaxed font-medium italic">
              {t.home.traditionText}
            </p>
            <div className="flex flex-wrap gap-6">
              <Link href="/essence" className="px-8 py-4 bg-white text-black font-black text-xs uppercase tracking-[0.2em] hover:bg-cyan-500 hover:text-white transition-all rounded-full flex items-center gap-3 group">
                {t.home.learnMoreAboutUs}
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <div className="flex items-center gap-3 px-6 py-4 border border-white/10 rounded-full text-slate-500 text-xs font-black uppercase tracking-widest bg-white/5 backdrop-blur-xl">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                Network Latency: 12ms
              </div>
            </div>
          </div>
          <div className="flex-1 aspect-[4/5] w-full max-w-md bg-slate-900 rounded-[48px] relative overflow-hidden group border border-white/10">
             <Image 
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
                alt="Tech core"
                fill
                className="object-cover opacity-40 group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
             <div className="absolute bottom-12 left-12 right-12 text-white">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500 mb-2">Protocol 0x1A</div>
                <div className="text-3xl font-black italic uppercase font-nexus tracking-tighter">Nexus Framework</div>
             </div>
             {/* Decorative Elements */}
             <div className="absolute top-12 right-12 flex gap-1">
                <div className="w-1 h-3 bg-white/20" />
                <div className="w-1 h-3 bg-cyan-500" />
                <div className="w-1 h-3 bg-white/20" />
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
