import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Ancestral Heartbeat',
  description: 'Privacy Policy and data protection of Ancestral Heartbeat - Colombian handicrafts store',
};

export default function PoliticaPrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-amber-600">1. Information We Collect</h2>
            <p className="text-gray-700 leading-relaxed">
              At <strong>Ancestral heartbeat</strong>, we collect personal information that you voluntarily provide to us when:
            </p>
            <ul className="list-disc list-inside mt-3 text-gray-700 space-y-2 ml-4">
              <li>You register on our online store</li>
              <li>You make a purchase</li>
              <li>You contact our customer service</li>
              <li>You subscribe to our newsletter</li>
              <li>You leave a review or comment</li>
            </ul>
            <p className="mt-3 text-gray-700">
              The information may include: name, email address, shipping address, phone number, payment information (processed securely).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-amber-600">2. Use of Information</h2>
            <p className="text-gray-700 leading-relaxed">
              We use your personal information to:
            </p>
            <ul className="list-disc list-inside mt-3 text-gray-700 space-y-2 ml-4">
              <li>Process and deliver your orders</li>
              <li>Communicate with you about your order</li>
              <li>Improve our products and services</li>
              <li>Send you promotional information (if you have given your consent)</li>
              <li>Prevent fraud and enhance security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-amber-600">3. Data Protection</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information against:
            </p>
            <ul className="list-disc list-inside mt-3 text-gray-700 space-y-2 ml-4">
              <li>Unauthorized access</li>
              <li>Alteration, disclosure, or destruction</li>
              <li>Accidental loss</li>
            </ul>
            <p className="mt-3 text-gray-700">
              All payments are processed through secure platforms that comply with PCI DSS standards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-amber-600">4. Sharing Information</h2>
            <p className="text-gray-700 leading-relaxed">
              We do not sell, rent, or share your personal information with third parties, except:
            </p>
            <ul className="list-disc list-inside mt-3 text-gray-700 space-y-2 ml-4">
              <li>Service providers (shipping, payments) necessary to complete your order</li>
              <li>When required by law or to protect our rights</li>
              <li>With your explicit consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-amber-600">5. Cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              We use cookies and similar technologies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can control the use of cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-amber-600">6. Your Rights</h2>
            <p className="text-gray-700 leading-relaxed">
              According to Colombian data protection legislation, you have the right to:
            </p>
            <ul className="list-disc list-inside mt-3 text-gray-700 space-y-2 ml-4">
              <li>Access your personal information</li>
              <li>Rectify inaccurate data</li>
              <li>Request the deletion of your data</li>
              <li>Object to the processing of your data</li>
              <li>Revoke your consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-amber-600">7. Minors</h2>
            <p className="text-gray-700 leading-relaxed">
              Our services are not directed to individuals under 18 years of age. We do not intentionally collect information from minors. If we discover that we have collected data from a minor, we will delete it immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-amber-600">8. Changes to this Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              Nos reservamos el derecho de actualizar esta Privacy Policy en cualquier momento. Te notificaremos sobre cambios significativos publicando la nueva política en esta página y actualizando la fecha de "Última actualización".
            </p>
          </section> We reserve the right to update this Privacy Policy at any time. We will notify you of significant changes by posting the new policy on this page and updating the “Last Updated” date. 

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-amber-600">9. Contact</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about this Privacy Policy or the processing of your personal data, you can contact us:
            </p>
            <ul className="mt-3 text-gray-700 space-y-2">
              <li><strong>Email:</strong> privacidad@latidoancestral.com</li>
              <li><strong>Phone:</strong> +57 300 123 4567</li>
              <li><strong>Address:</strong> Carrera 7 #123-45, Bogotá, Colombia</li>
            </ul>
          </section>

          <div className="mt-8 pt-6 border-t text-center text-gray-600">
            <p>Last Updated: {new Date().toLocaleDateString('en-US')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
