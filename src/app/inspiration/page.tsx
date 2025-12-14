import Image from "next/image";

export default function InspiracionPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-5xl font-bold text-center mb-8 text-dark">
        Inspiration
      </h1>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Lo que nos inspira */}
        <section className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-6 text-primary">
            What Inspires Us
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our pieces are born from more than just technique: they are born from memories, landscapes,
                and ancient voices that still whisper in each fabric. This is the inspiration that 
                guides us and that we want to share with you.
              </p>
            </div>
            <div className="relative h-80 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/assets/assets11/artesana-tejiendo-mochila2.webp"
                alt="Artesana tejiendo mochila"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Fragmentos de Sabiduría - Voces entre hilos */}
        <section className="bg-gradient-to-br from-primary/10 to-accent/20 rounded-xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-6 text-primary text-center">
            Fragments of Wisdom
          </h2>
          <h3 className="text-2xl font-semibold mb-8 text-secondary text-center">
            Voices Among Threads
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative h-96 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/assets/assets11/colores.webp"
                alt="Colores artesanales"
                fill
                className="object-cover"
              />
            </div>
            
            <div className="space-y-4">
              <blockquote className="text-xl italic text-gray-700 border-l-4 border-primary pl-4 py-2">
                "Each thread has its origin."
              </blockquote>
              <blockquote className="text-xl italic text-gray-700 border-l-4 border-secondary pl-4 py-2">
                "Popular art is not copied, it is inherited."
              </blockquote>
              <blockquote className="text-xl italic text-gray-700 border-l-4 border-primary pl-4 py-2">
                "It is not just creating, it is remembering."
              </blockquote>
              <blockquote className="text-xl italic text-gray-700 border-l-4 border-secondary pl-4 py-2">
                "Nothing made with hands is empty."
              </blockquote>
              <blockquote className="text-xl italic text-gray-700 border-l-4 border-primary pl-4 py-2">
                "What is woven with the soul never unravels."
              </blockquote>
            </div>
          </div>
        </section>

        {/* Historias que Inspiran */}
        <section className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-6 text-primary text-center">
            Stories that Inspire
          </h2>
          <h3 className="text-2xl font-semibold mb-6 text-secondary text-center">
            The Legacy in Their Hands
          </h3>
          
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              For as long as I can remember, I remember my grandmother with her hands 
              busy with art: weaving hammocks, backpacks, and memories. She never 
              needed patterns, just her intuition and the memories of those who 
              taught her before.
            </p>

            <div className="relative h-96 rounded-xl overflow-hidden shadow-lg my-8">
              <Image
                src="/assets/assets11/tejedora-hamacas.webp"
                alt="Tejedora de hamacas"
                fill
                className="object-cover"
              />
            </div>

            <p className="text-lg text-gray-700 leading-relaxed">
              Her fingers knew exactly what to do, how to knot without mistakes, how to choose colors
              that spoke of the countryside, the sky, or love. I watched her in silence, not knowing that 
              those images would stay with me forever.
            </p>

            <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg">
              <p className="text-lg text-gray-700 leading-relaxed italic">
                Now I understand that it was not just weaving. It was resistance, it was tenderness, it was belonging. 
                And today, with this store, I try to honor her legacy. Each piece is a way of saying:
                <strong className="text-primary"> "Here I am, grandma, following your thread."</strong>
              </p>
            </div>
          </div>
        </section>

        {/* Postales de Raíz */}
        <section className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-6 text-primary text-center">
            Root Postcards
          </h2>
          <h3 className="text-2xl font-semibold mb-6 text-secondary text-center">
            Memories that Speak to the Soul
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative h-96 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/assets/assets11/atardecer.webp"
                alt="Atardecer inspirador"
                fill
                className="object-cover"
              />
            </div>
            
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                We are inspired by the colors of the sunset, the textures of the earth, and the sounds of the looms in motion. Everything around us has something to tell, and we try to listen.
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                The landscape teaches us the tones of the soul, and the hands turn them into form. 
                Each piece is a fragment of that conversation between the earth and the heart.
              </p>
            </div>
          </div>
        </section>

        {/* Cierre Inspirador */}
        <section className="bg-gradient-to-r from-primary to-secondary text-white rounded-xl shadow-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">
            We Weave with the Heart
          </h2>
          <p className="text-lg leading-relaxed max-w-3xl mx-auto">
            Each craft we offer carries with it the inspiration of generations, 
            the love for tradition, and the hope that these stories remain alive 
            in every home that welcomes them.
          </p>
        </section>
      </div>
    </div>
  );
}
