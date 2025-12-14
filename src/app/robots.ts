import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/perfil/', '/checkout/', '/carrito/'],
      },
    ],
    sitemap: 'https://latidoancestral.com/sitemap.xml',
  };
}
