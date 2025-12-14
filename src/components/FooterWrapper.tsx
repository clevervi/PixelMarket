'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function FooterWrapper() {
  const pathname = usePathname();

  // Ocultar el footer en todas las páginas del dashboard
  if (pathname.startsWith('/dashboard')) {
    return null;
  }

  return <Footer />;
}
