import Link from "next/link";
import Image from "next/image";
import { categories } from "@/data/products";

export default function ColeccionesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-5xl font-bold text-center mb-4 text-dark">
      Our Collections
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto text-lg">
        Explore the richness of our Colombian crafts. Each collection
        represents an ancestral tradition, an art passed down from generation to generation.
      </p>

      {/* Categories Grid - Expandido */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/collections/${category.id}`}
            className="group relative overflow-hidden rounded-xl shadow-xl h-80 block transform transition-all duration-500 hover:scale-105"
          >
            {/* Imagen con efecto de difuminado/aclarado */}
            <div className="absolute inset-0">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-all duration-500 brightness-50 group-hover:brightness-100 blur-sm group-hover:blur-none"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            
            {/* Gradiente de overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/70 group-hover:via-black/20 transition-all duration-500 z-10" />
            
            {/* Contenido */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
              <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-accent transition-colors duration-300">
                {category.name}
              </h3>
              <p className="text-gray-200 group-hover:text-white transition-colors duration-300">
                {category.description}
              </p>
              <div className="mt-4 flex items-center text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="font-semibold">Explore collection</span>
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Mensaje de cierre */}
      <div className="mt-16 text-center max-w-3xl mx-auto">
        <p className="text-lg text-gray-700 leading-relaxed">
          Each collection represents the soul of Colombia, woven with dedication and passion.
          Click on any category to discover the handcrafted products that carry ancestral stories with them.

        </p>
      </div>
    </div>
  );
}
