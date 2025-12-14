import type { Product } from '@/types';

// Schema.org markup para productos
export function generateProductSchema(product: Product, averageRating?: number, reviewCount?: number) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images || [product.image],
    brand: {
      '@type': 'Brand',
  name: product.brand || 'Ancestral heartbeat',
    },
    offers: {
      '@type': 'Offer',
      url: `https://latidoancestral.com/products/${product.id}`,
      priceCurrency: 'COP',
      price: product.price,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Ancestral heartbeat',
      },
    },
    ...(averageRating && reviewCount ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: averageRating,
        reviewCount: reviewCount,
      },
    } : {}),
  };

  return JSON.stringify(schema);
}

// Schema.org markup para organización
export function generateOrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
  name: 'Ancestral heartbeat',
  description: 'Tienda virtual de artesanías colombianas hechas a mano',
  url: 'https://latidoancestral.com',
  logo: 'https://latidoancestral.com/logo.png',
    sameAs: [
  'https://facebook.com/latidoancestral',
  'https://instagram.com/latidoancestral',
  'https://twitter.com/latidoancestral',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+57-300-123-4567',
      contactType: 'Customer Service',
  email: 'soporte@latidoancestral.com',
      availableLanguage: ['Spanish', 'English'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Carrera 7 #123-45',
      addressLocality: 'Bogotá',
      addressCountry: 'CO',
    },
  };

  return JSON.stringify(schema);
}

// Schema.org markup para breadcrumbs
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://latidoancestral.com${item.url}`,
    })),
  };

  return JSON.stringify(schema);
}

// Generar meta tags para SEO
export interface MetaTags {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  canonical?: string;
}

export function generateMetaTags(tags: MetaTags) {
  return {
    title: tags.title,
    description: tags.description,
    keywords: tags.keywords,
    openGraph: {
      title: tags.ogTitle || tags.title,
      description: tags.ogDescription || tags.description,
      images: tags.ogImage ? [{ url: tags.ogImage }] : [],
      url: tags.ogUrl,
      type: 'website',
      siteName: 'Ancestral heartbeat',
    },
    twitter: {
      card: 'summary_large_image',
      title: tags.ogTitle || tags.title,
      description: tags.ogDescription || tags.description,
      images: tags.ogImage ? [tags.ogImage] : [],
    },
    alternates: {
      canonical: tags.canonical,
    },
  };
}

// Generar URL amigable (slug)
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9\s-]/g, '') // Eliminar caracteres especiales
    .trim()
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-'); // Eliminar guiones múltiples
}
