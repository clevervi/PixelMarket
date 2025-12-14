"use client";

import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { useTranslation } from '@/hooks/useTranslation';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-[#2C1810] text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-accent">Ancestral heartbeat</h3>
            <p className="text-white">
              Promoting Colombian culture and ancestral traditions through handmade crafts.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4 text-accent">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/essence" className="text-white hover:text-accent transition-colors">
                  Our Essence
                </Link>
              </li>
              <li>
                <Link href="/collections" className="text-white hover:text-accent transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/inspiration" className="text-white hover:text-accent transition-colors">
                  Inspiration
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white hover:text-accent transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4 text-accent">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-white hover:text-accent transition-colors">
                  {t.footer.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-white hover:text-accent transition-colors">
                  {t.footer.termsOfService}
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-white hover:text-accent transition-colors">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-white hover:text-accent transition-colors">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4 text-accent">Contact</h4>
            <ul className="space-y-2 text-white">
              <li>Email: katemartinez1507@gmail.com</li>
              <li></li>
              <li>Colombia</li>
            </ul>
            
            {/* Social Media */}
            <div className="mt-6">
              <h5 className="text-sm font-semibold mb-3 text-accent">{t.footer.followUs}</h5>
              <div className="flex gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-accent transition-colors"
                  aria-label="Facebook"
                >
                  <FaFacebook size={24} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-accent transition-colors"
                  aria-label="Instagram"
                >
                  <FaInstagram size={24} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-accent transition-colors"
                  aria-label="Twitter"
                >
                  <FaTwitter size={24} />
                </a>
                <a
                  href="https://wa.me/573001234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-accent transition-colors"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 dark:border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} Ancestral Heartbeat. {t.footer.allRightsReserved}</p>
          <p className="mt-2 text-sm text-gray-400">Kateryn Martinez | Made with ❤️ in Colombia</p>
          <div className="mt-3 flex justify-center gap-4 text-sm">
            <Link href="/privacy-policy" className="text-gray-400 hover:text-accent transition-colors">
              Privacy
            </Link>
            <span>|</span>
            <Link href="/terms-of-service" className="text-gray-400 hover:text-accent transition-colors">
              Terms
            </Link>
            <span>|</span>
            <Link href="/sitemap.xml" className="text-gray-400 hover:text-accent transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
