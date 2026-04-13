'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Zap, ArrowRight, Layers } from 'lucide-react';

const slides = [
  {
    id: 1,
    subtitle: 'NEXUS CORE OPS',
    title: 'Precision UI Infrastructure',
    description: 'Deploy mission-critical interface systems with pixel-perfect accuracy and high-fidelity rendering.',
    image: '/assets/hero/nexus-prism.png',
    accent: 'oklch(62.6% 0.19 253)',
    link: '/shop?category=UI-Kits',
    features: ['Real-time Sync', 'HVM Ready', 'Enterprise Grade']
  },
  {
    id: 2,
    subtitle: 'SYSTEM ARCHITECTURE',
    title: 'Quantum Node Clusters',
    description: 'High-performance architectural benchmarks designed for ultra-low latency and infinite scalability.',
    image: '/assets/hero/nexus-center.png',
    accent: 'oklch(51.4% 0.19 278)',
    link: '/shop?category=Infrastructure',
    features: ['Edge Compute', 'Mesh Protocol', 'Zero Latency']
  },
  {
    id: 3,
    subtitle: 'SECURITY PROTOCOLS',
    title: 'Encrypted Asset Vault',
    description: 'Secure, multi-layer verification protocols to fortify your digital asset sovereignty.',
    image: '/assets/hero/nexus-chip.png',
    accent: 'oklch(86.5% 0.18 184)',
    link: '/shop?category=Security',
    features: ['Biometric Auth', 'Quantum Proof', 'Full Audit']
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative h-[85vh] min-h-[700px] w-full bg-slate-950 overflow-hidden">
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,oklch(62.6%_0.19_253_/_0.05)_0%,transparent_70%)] animate-pulse" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Main Visual */}
          <div className="absolute inset-0">
            <Image
              src={slides[current].image}
              alt={slides[current].title}
              fill
              className="object-cover object-center scale-105"
              priority
            />
            {/* Visual Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
            <div className="absolute inset-0 bg-slate-950/20 backdrop-brightness-75 z-5" />
          </div>

          {/* Interface Elements (Grid) */}
          <div className="absolute inset-0 grid-overlay opacity-10 z-10" />

          {/* Content Container */}
          <div className="relative z-20 h-full container mx-auto px-6 flex flex-col justify-center">
            <div className="max-w-3xl">
              {/* Subtitle / Trace */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="w-8 h-[1px] bg-cyan-500/50" />
                <span className="text-xs font-black tracking-[0.4em] uppercase text-cyan-400 font-nexus">
                  {slides[current].subtitle}
                </span>
                <div className="px-2 py-0.5 rounded border border-cyan-500/20 bg-cyan-500/5 text-[9px] font-mono text-cyan-500 animate-pulse">
                  STATUS: OPTIMAL
                </div>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-5xl lg:text-8xl font-black mb-8 leading-[0.9] text-white italic uppercase font-nexus"
              >
                {slides[current].title.split(' ').map((word, i) => (
                  <span key={i} className={i === 0 ? 'text-white' : 'text-glow text-cyan-500 block lg:inline ml-0 lg:ml-2'}>
                    {word}{' '}
                  </span>
                ))}
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-slate-400 text-lg lg:text-xl font-medium max-w-xl mb-12 leading-relaxed border-l-2 border-slate-800 pl-6"
              >
                {slides[current].description}
              </motion.p>

              {/* Features List */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex flex-wrap gap-8 mb-12"
              >
                {slides[current].features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_oklch(62.6%_0.19_253)] transition-transform group-hover:scale-150" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">{f}</span>
                  </div>
                ))}
              </motion.div>

              {/* Action */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="flex items-center gap-6"
              >
                <Link
                  href={slides[current].link}
                  className="group relative px-10 py-5 bg-white text-black overflow-hidden transition-all hover:pr-14 active:scale-95"
                >
                  <div className="absolute inset-0 bg-cyan-500 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                  <span className="relative z-10 font-black uppercase tracking-widest text-xs flex items-center gap-3">
                    Initialize Protocol <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                
                <div className="hidden lg:flex flex-col">
                  <span className="text-[8px] font-black text-slate-500 tracking-[0.3em] uppercase mb-1">Authorization Layer</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map(i => <div key={i} className="w-4 h-0.5 bg-slate-800" />)}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress Bars (Nav Side) */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col gap-8">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="flex items-center gap-4 group"
          >
            <div className="text-[10px] font-black text-slate-500 tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">
              0{i + 1}
            </div>
            <div className={`relative h-20 w-[2px] transition-all duration-500 ${current === i ? 'bg-cyan-500 h-24 shadow-[0_0_15px_oklch(62.6%_0.19_253)]' : 'bg-slate-800'}`}>
              {current === i && (
                <motion.div 
                  layoutId="indicator"
                  className="absolute inset-0 bg-white"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Corner Data points */}
      <div className="absolute bottom-12 left-12 z-30 flex items-center gap-12 text-[10px] font-black text-slate-600 tracking-widest uppercase">
        <div className="flex items-center gap-3">
          <Zap size={14} className="text-cyan-500" />
          <span>Active Nodes: 1,204</span>
        </div>
        <div className="flex items-center gap-3">
          <Layers size={14} />
          <span>Uptime: 99.9%</span>
        </div>
      </div>

      <style jsx>{`
        .grid-overlay {
          background-image: radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </section>
  );
}
