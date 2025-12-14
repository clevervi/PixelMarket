"use client";

import { useState } from "react";

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission would be implemented here
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-5xl font-bold text-center mb-8 text-dark">
        Contact
      </h1>

      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Información de contacto */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6 text-primary">
             Contact Information
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-secondary mb-2">
                  Email
                </h3>
                <p className="text-gray-700">Latidoancestral1015@gmail.com</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-secondary mb-2">
                  Location
                </h3>
                <p className="text-gray-700">Colombia</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-secondary mb-2">
                  Business Hours
                </h3>
                <p className="text-gray-700">
                 Monday to Friday: 9:00 AM - 6:00 PM<br />
                  Saturdays: 10:00 AM - 2:00 PM
                </p>
              </div>
            </div>

            <div className="mt-8">
            <h3 className="font-semibold text-lg text-secondary mb-4">
                Why Choose Us?
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  100% handmade products
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  Fair trade with artisans
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  Secure shipping nationwide
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  Fair trade with artisans
                </li>
              </ul>
            </div>
          </div>

          {/* Formulario de contacto */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6 text-primary">
              Send us a message
            </h2>

            {submitted ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                Thank you for your message! We will contact you soon.
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              <button type="submit" className="btn-primary w-full">
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Map or additional information */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4 text-primary">
            Do you have questions about our products?
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            We are here to help you. Contact us and we will gladly answer
            all your questions about our Colombian crafts.
          </p>
          <p className="text-lg text-gray-700">
            You can also visit us on our social media to learn more
            about our artisan community.
          </p>
        </div>
      </div>
    </div>
  );
}
