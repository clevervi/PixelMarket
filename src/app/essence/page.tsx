import Image from "next/image";

export default function EsenciaPage() {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 selection:bg-primary/30">
      <div className="container mx-auto px-4 py-24 relative overflow-hidden">
        {/* Background Ambient Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] -z-10" />

        <div className="text-center mb-20 relative z-10">
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter text-white">
            Engineering<span className="text-primary italic">.</span>Manifesto
          </h1>
          <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto uppercase tracking-widest leading-relaxed">
            Standardizing the digital frontier through precision, integrity, and relentless innovation.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-16">
          {/* The Genesis Section */}
          <section className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2rem] p-8 md:p-16 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-all duration-700" />
            
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/30">Node_01</span>
                  <div className="h-px w-12 bg-primary/30" />
                </div>
                <h2 className="text-4xl font-black mb-10 text-white tracking-tight">
                  The Genesis of <span className="text-primary underline decoration-primary/30 underline-offset-8">Precision</span>
                </h2>
                <div className="space-y-6 text-slate-400 font-medium leading-relaxed">
                  <p className="text-lg">
                    In every binary sequence, in every modular architecture, in every pixel... there is a core logic that defines the next generation of digital excellence.
                  </p>
                  <p className="text-lg">
                    <strong className="text-white border-b border-primary/50">PixelMarket</strong> was engineered as the definitive nexus where advanced architecture meets seamless utility. We do not simply curate assets; we architect fragments of the future.
                  </p>
                  <p className="text-lg">
                    Our protocol is built on the belief that code should be as beautiful as it is robust. Every UI kit, 3D asset, and firmware module is vetted for engineering excellence, ensuring that your stack remains future-proof.
                  </p>
                </div>
              </div>
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group-hover:border-primary/50 transition-all duration-500">
                <Image
                  src="/pixelmarket_engineering_manifesto_1776100390851.png"
                  alt="PixelMarket Engineering Logic"
                  fill
                  className="object-cover scale-105 group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
                  <p className="text-xs font-black uppercase tracking-widest text-primary mb-2">Core System Architecture</p>
                  <p className="text-sm font-medium text-slate-300">Visualizing the intersection of design and deterministic logic.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Core Optimization Values */}
          <section className="py-12">
            <h2 className="text-xs font-black uppercase tracking-[0.5em] mb-16 text-primary text-center">Systemic_Standardization</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  id: "01",
                  title: "Code Integrity",
                  desc: "Every asset is subjected to rigorous static analysis and security auditing. Zero-tolerance for technical debt.",
                  color: "primary"
                },
                {
                  id: "02",
                  title: "Modular Scaling",
                  desc: "Architected for horizontal growth. Components are isolated, tested, and ready for high-concurrency environments.",
                  color: "accent"
                },
                {
                  id: "03",
                  title: "Open Governance",
                  desc: "We prioritize open-standard contributors. Ensuring that the digital commons remain accessible and secure.",
                  color: "emerald-400"
                },
                {
                  id: "04",
                  title: "Future Compliance",
                  desc: "Leading the transition to Web3 and AI-integrated assets. Prepared for the hardware of tomorrow.",
                  color: "slate-400"
                }
              ].map((val) => (
                <div key={val.id} className="group p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300">
                  <div className="text-3xl font-black mb-6 text-slate-700 group-hover:text-primary/50 transition-colors">
                    {val.id}
                  </div>
                  <h3 className="text-xl font-black mb-4 text-white tracking-tight">
                    {val.title}
                  </h3>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* The Network Effect */}
          <section className="bg-gradient-to-br from-primary/20 to-accent/10 border border-white/10 rounded-[2rem] p-8 md:p-16 text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
             <div className="relative z-10">
                <h2 className="text-4xl font-black mb-8 text-white tracking-tight">
                  Join the Developer Nexus
                </h2>
                <p className="text-xl text-slate-300 font-medium max-w-3xl mx-auto mb-12 leading-relaxed">
                  We are not just a marketplace; we are a collective of architects shaping the next epoch of digital interaction. Deploy your potential.
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                   <button className="px-10 py-4 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-300">
                      Access Terminal
                   </button>
                   <button className="px-10 py-4 bg-white/5 border border-white/10 backdrop-blur-md text-white rounded-2xl font-black uppercase tracking-widest hover:bg-white/10 transition-all duration-300">
                      View Documentation
                   </button>
                </div>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
}
