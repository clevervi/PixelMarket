"use client";

import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { useTranslation } from '@/hooks/useTranslation';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-slate-950 text-white border-t border-white/5 relative overflow-hidden">
      {/* Footer background detail */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="space-y-6">
            <h3 className="text-3xl font-black mb-6 text-white tracking-tighter">
              Pixel<span className="text-primary">Market</span>
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-medium">
              The premier destination for high-performance digital assets, enterprise-grade UI kits, and precision developer hardware.
            </p>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl w-fit">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Terminal Status: Online</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-primary">Protocol Links</h4>
            <ul className="space-y-4">
              {[
                { name: 'Core Essence', href: '/essence' },
                { name: 'Asset Index', href: '/collections' },
                { name: 'Tech Blog', href: '/inspiration' },
                { name: 'System Support', href: '/contact' }
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-400 hover:text-white transition-all text-sm font-semibold flex items-center group">
                    <span className="w-0 group-hover:w-3 h-[1px] bg-primary transition-all mr-0 group-hover:mr-2" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-primary">Compliance</h4>
            <ul className="space-y-4">
              {[
                { name: t.footer.privacyPolicy, href: '/privacy-policy' },
                { name: t.footer.termsOfService, href: '/terms-of-service' },
                { name: 'Order Logs', href: '/cart' },
                { name: 'User Profile', href: '/profile' }
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-400 hover:text-white transition-all text-sm font-semibold">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-primary">Node Contact</h4>
            <ul className="space-y-4 text-sm font-semibold">
              <li className="flex flex-col">
                <span className="text-[10px] uppercase text-slate-500 mb-1">Inbound Queries</span>
                <span className="text-slate-200">contact@pixelmarket.tech</span>
              </li>
              <li className="flex flex-col">
                <span className="text-[10px] uppercase text-slate-500 mb-1">Developer Ops</span>
                <span className="text-slate-200">ops@pixelmarket.tech</span>
              </li>
            </ul>
            
            {/* Social Media */}
            <div className="mt-10">
              <div className="flex gap-4">
                {[
                  { icon: FaFacebook, href: 'https://facebook.com', label: 'FB' },
                  { icon: FaInstagram, href: 'https://instagram.com', label: 'IG' },
                  { icon: FaTwitter, href: 'https://twitter.com', label: 'TW' },
                  { icon: FaWhatsapp, href: 'https://whatsapp.com', label: 'WA' }
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white hover:bg-primary hover:border-primary transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
            &copy; {new Date().getFullYear()} PIXELMARKET_CORE. {t.footer.allRightsReserved}
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-black text-slate-600 uppercase">Encryption</span>
               <span className="text-[10px] font-black text-primary uppercase">AES-256</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-black text-slate-600 uppercase">Latency</span>
               <span className="text-[10px] font-black text-accent uppercase">12ms</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
