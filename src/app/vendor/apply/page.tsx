"use client";

import { useState } from 'react';
import { FiMail, FiUser, FiPhone } from 'react-icons/fi';

export default function VendorApplyPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', business: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    setLoading(true);
    try {
      const res = await fetch('/api/vendor/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit');
      setSuccess(data.message || 'Application submitted successfully');
      setForm({ name: '', email: '', phone: '', business: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFE4B5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#8B4513] mb-2">Apply to become a vendor</h1>
          <p className="text-[#2C1810]">Tell us about your business — we'll review your application and get back to you.</p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8 border-2 border-[#F4A460]">
          {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}
          {success && <div className="mb-4 text-sm text-green-700 bg-green-50 p-3 rounded">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#8B4513] mb-2">Full name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="name" required value={form.name} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8B4513] mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="email" type="email" required value={form.email} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8B4513] mb-2">Phone (optional)</label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="phone" type="tel" value={form.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8B4513] mb-2">Business name</label>
              <input name="business" required value={form.business} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8B4513] mb-2">Tell us about your products</label>
              <textarea name="message" required value={form.message} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg min-h-[120px]" />
            </div>

            <div className="flex items-center gap-4">
              <button type="submit" disabled={loading} className="bg-[#8B4513] text-white px-6 py-3 rounded-lg hover:bg-[#D2691E] transition-colors disabled:opacity-50">
                {loading ? 'Submitting...' : 'Submit application'}
              </button>
              <a href="/login" className="text-sm text-[#8B4513] hover:underline">Back to login</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
