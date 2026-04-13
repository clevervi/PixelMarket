import Link from "next/link";
import Image from "next/image";
import { categories } from "@/data/products";

export default function ColeccionesPage() {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-100">
      {/* Background Detail */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] -z-10" />

      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-4xl mb-20">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white">
            Repository<span className="text-primary">.</span>Index
          </h1>
          <p className="text-slate-400 text-xl font-medium tracking-wide max-w-2xl leading-relaxed">
            Standardized asset classes for advanced full-stack architectures. Each repository is curated for maximum performance and cross-stack compatibility.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/collections/${category.id}`}
              className="group relative h-[450px] rounded-[2rem] overflow-hidden border border-white/10 bg-slate-900 shadow-2xl transition-all duration-500 hover:border-primary/50"
            >
              {/* Image Layer */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={category.image_url}
                  alt={category.name}
                  fill
                  className="object-cover opacity-40 group-hover:opacity-60 transition-all duration-1000 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent group-hover:via-slate-950/20 transition-all duration-500 z-10" />
              
              {/* Content Layer */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 z-20">
                <div className="mb-4 flex items-center gap-3">
                  <span className="w-8 h-[2px] bg-primary rounded-full" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Class_{category.id}</span>
                </div>
                <h3 className="text-3xl font-black text-white mb-4 tracking-tighter group-hover:translate-x-2 transition-transform duration-300">
                  {category.name}
                </h3>
                <p className="text-slate-400 font-medium leading-relaxed mb-6 group-hover:text-slate-200 transition-colors">
                  {category.description}
                </p>
                
                <div className="flex items-center text-white/50 group-hover:text-primary transition-colors duration-300">
                  <span className="text-xs font-black uppercase tracking-widest">Deploy Assets</span>
                  <svg className="w-5 h-5 ml-3 transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 transition-colors group-hover:bg-primary/20 blur-3xl rounded-full -mr-12 -mt-12" />
            </Link>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-slate-500 text-sm font-medium italic max-w-xl text-center md:text-left">
            "Every asset repository represents a standard of innovation, meticulously tested for edge-case stability and architectural integrity."
          </p>
          <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">All Nodes Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
