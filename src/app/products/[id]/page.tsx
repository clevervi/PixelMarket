import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { products } from "@/data/products";
import { generateProductSchema, generateMetaTags, generateBreadcrumbSchema } from '@/utils/seo';
import ProductReviews from '@/components/ProductReviews';
import ProductQuestions from '@/components/ProductQuestions';
import ProductRecommendations from '@/components/ProductRecommendations';
import StarRating from '@/components/StarRating';
import ProductGallery from '@/components/product/ProductGallery';
import ProductActions from '@/components/product/ProductActions';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Generar metadata dinámica para SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    return {
      title: 'Producto no encontrado',
    };
  }

  return generateMetaTags({
    title: `${product.name} | Ancestral Heartbeat`,
    description: product.description,
    keywords: `${product.name}, ${product.category}, Colombian handicrafts, handmade`,
    ogTitle: product.name,
    ogDescription: product.description,
    ogImage: product.image,
    ogUrl: `/products/${product.id}`,
    canonical: `/products/${product.id}`,
  });
}

// Generar rutas estáticas para mejor SEO
export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const formattedPrice = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(product.price);

  // Schema markup para SEO
  const productSchema = generateProductSchema(
    product,
    product.rating || 0,
    product.reviewsCount || 0
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'collections', url: '/collections' },
    { name: product.name, url: `/products/${product.id}` },
  ]);

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: productSchema }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbSchema }}
      />
      <div className="container mx-auto px-4 py-8 md:py-16">
      {/* Breadcrumb */}
      <nav className="mb-8 text-gray-600 dark:text-gray-400">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        {" / "}
        <Link href="/collections" className="hover:text-primary transition-colors">
          Collections
        </Link>
        {" / "}
  <span className="font-semibold text-black">{product.name}</span>
      </nav>

      {/* Product Details */}
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-16">
        <ProductGallery 
          images={[product.image]} 
          productName={product.name}
        />

        <div className="flex flex-col justify-center">
          {/* Badge de destacado */}
          {product.featured && (
            <span className="inline-block w-fit px-3 py-1 bg-primary text-white text-sm font-semibold rounded-full mb-3">
              Featured
            </span>
          )}

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-black">
            {product.name}
          </h1>

          {/* Rating */}
          {(product.rating && product.rating > 0) && (
            <div className="flex items-center gap-2 mb-4">
              <StarRating rating={product.rating} size={20} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ({product.reviewsCount || 0} {product.reviewsCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}

          <div className="text-3xl md:text-4xl font-bold text-primary mb-6">
            {formattedPrice}
          </div>

          <div className="bg-[#FAEBD7] dark:bg-[#FAEBD7] rounded-xl shadow-lg p-6 mb-6 border-2 border-[#F4A460]">
            <h2 className="text-2xl font-bold mb-4 text-black">Description</h2>
            <p className="text-[#2C1810] text-lg leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="bg-[#FAEBD7] dark:bg-[#FAEBD7] rounded-xl shadow-lg p-6 mb-6 border-2 border-[#F4A460]">
            <h3 className="text-xl font-bold mb-3 text-black">
              Features
            </h3>
            <ul className="space-y-2 text-[#2C1810]">
              <li className="flex items-start">
                <span className="text-[#8B4513] mr-2">✓</span>
                100% handmade
              </li>
              <li className="flex items-start">
                <span className="text-[#8B4513] mr-2">✓</span>
                Natural and sustainable materials
              </li>
              <li className="flex items-start">
                <span className="text-[#8B4513] mr-2">✓</span>
                Unique and authentic product
              </li>
              <li className="flex items-start">
                <span className="text-[#8B4513] mr-2">✓</span>
                Supports artisan communities
              </li>
              {product.color && (
                <li className="flex items-start">
                  <span className="text-[#8B4513] mr-2">✓</span>
                  Color: {product.color}
                </li>
              )}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <ProductActions product={product} />
          </div>

          <div className="mt-6 bg-[#FAEBD7] dark:bg-[#FAEBD7] rounded-xl shadow-lg p-6 mb-6 border-2 border-[#F4A460]">
            <h4 className="text-sm font-semibold text-[#8B4513] mb-2">Shipping</h4>
            <p className="text-sm text-[#2C1810]">
              Available throughout Colombia. Delivery time varies depending on location.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs de Información */}
      <div className="mb-16">
  <div className="bg-[#FDF5E6] dark:bg-[#FDF5E6] rounded-xl shadow-lg p-8 border-2 border-[#F4A460]">
          {/* Reseñas */}
          <div className="mb-12">
            <ProductReviews productId={product.id} />
          </div>

          {/* Preguntas y Respuestas */}
          <div>
            <ProductQuestions productId={product.id} />
          </div>
        </div>
      </div>

      {/* Recomendaciones */}
      <div className="bg-white dark:bg-dark-surface rounded-lg shadow-lg p-8 md:p-12 border-2 border-amber-200 dark:border-amber-800 mb-12">
        <ProductRecommendations 
          currentProductId={product.id}
          currentCategory={product.category}
          maxRecommendations={4}
        />
      </div>
      </div>
    </>
  );
}
