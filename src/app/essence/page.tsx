import Image from "next/image";

export default function EsenciaPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-5xl font-bold text-center mb-8 text-dark">
        Our Essence
      </h1>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Nuestra Raíz */}
        <section className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-6 text-primary">
            Our Roots
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                In every knot, in every thread, in every color... there is a story that beats from past generations.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
             <strong className="text-primary">Ancestral heartbeat</strong> is born as a bridge between 
                memory and the present, between the wise hands of artisans
                and the hearts that value what is made with soul. We do not sell objects, we share fragments of identity.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Here, each piece is an offering of roots, a living heritage
                that continues to speak to us in weaves, textiles, and shapes.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We believe in slow, in authentic, in human. That is why we take care 
                of every detail as tradition that must not be lost is cared for; our 
                essence is a heartbeat. One that comes from afar, but that vibrates with you.
              </p>
            </div>
            <div className="relative h-96 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/assets/assets11/artesana-tejiendo-mochila1.webp"
                alt="Artesana tejiendo mochila"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Elegirnos es Abrazar una Historia */}
        <section className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-6 text-primary">
            Choosing Us is Embracing a Story
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            When you choose one of our pieces, you are embracing the voice of a community
            that has not stopped creating despite being forgotten. You are holding a fragment of land,
            sun, and handwoven history.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Each shape, each texture, has been born from patience 
            and popular wisdom. Nothing here is casual: colors have memory, knots have 
            intention. Each object carries the echo of an ancestral conversation between generations.
          </p>
          <div className="bg-primary/5 border-l-4 border-primary p-6 mt-6">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              <strong>We work with respect.</strong> We do not intervene: we accompany. We do not exploit: we share.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              We honor the processes and times of those who have made weaving a heritage and a form of resistance.
            </p>
          </div>
        </section>

        {/* Una Herencia que Vibra Contigo */}
        <section className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-6 text-primary">
            A Heritage that Vibrates with You
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Our essence is not only that of our roots, but also yours.
            Because when you connect with the authentic, you make it part of your path.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            At <strong className="text-primary">Ancestral heartbeat</strong> we weave bridges, not just products. And 
            we wish that each creation finds in you a home that also values 
            the beauty of what must not be forgotten.
          </p>
        </section>

        {/* Nuestros Valores */}
        <section className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-8 text-primary text-center">
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border-l-4 border-secondary pl-6">
              <h3 className="text-xl font-semibold mb-3 text-secondary">
                Authenticity
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Each product is genuinely handmade by Colombian artisans, ensuring unique pieces that carry the soul of their creator.
              </p>
            </div>
            <div className="border-l-4 border-secondary pl-6">
              <h3 className="text-xl font-semibold mb-3 text-secondary">
                Sustainability
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We work with natural materials and practices that respect the
                environment and ancestral traditions.
              </p>
            </div>
            <div className="border-l-4 border-secondary pl-6">
              <h3 className="text-xl font-semibold mb-3 text-secondary">
                Fair Trade
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We ensure that artisans receive fair compensation for their
                work, time, and dedication.
              </p>
            </div>
            <div className="border-l-4 border-secondary pl-6">
              <h3 className="text-xl font-semibold mb-3 text-secondary">
                Cultural Preservation
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We contribute to keeping Colombian ancestral traditions alive for future generations.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
