import type { Product } from '@/types';

// Schema.org markup for products
export function generateProductSchema(product: Product, averageRating?: number, reviewCount?: number) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images || [product.image_url],
    brand: {
      '@type': 'Brand',
      name: product.brand || 'PixelMarket',
    },
    offers: {
      '@type': 'Offer',
      url: `https://pixelmarket.tech/products/${product.id}`,
      priceCurrency: 'USD',
      price: product.price,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'PixelMarket',
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

// Schema.org markup for organization
export function generateOrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
  name: 'PixelMarket',
  description: 'Premier destination for high-performance digital assets, enterprise-grade UI kits, and precision developer hardware.',
  url: 'https://pixelmarket.tech',
  logo: 'https://pixelmarket.tech/logo.png',
    sameAs: [
      'https://facebook.com/pixelmarket',
      'https://instagram.com/pixelmarket',
      'https://twitter.com/pixelmarket',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+57-300-123-4567',
      contactType: 'Customer Service',
  email: 'ops@pixelmarket.tech',
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

// Schema.org markup for breadcrumbs
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://pixelmarket.tech${item.url}`,
    })),
  };

  return JSON.stringify(schema);
}

// Generate SEO meta tags
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
      siteName: 'PixelMarket',
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

// Generate a URL-friendly slug
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Collapse repeated hyphens
}
