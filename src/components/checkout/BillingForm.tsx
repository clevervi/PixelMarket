'use client';

import React from 'react';

interface BillingFormData {
  firstName: string;
  lastName: string;
  company?: string;
  country: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  phone: string;
  email: string;
}

interface BillingFormProps {
  data: BillingFormData;
  onChange: (data: BillingFormData) => void;
}

export default function BillingForm({ data, onChange }: BillingFormProps) {
  const handleChange = (field: keyof BillingFormData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="mt-9">
      <h2 className="font-medium text-[#8B4513] text-xl sm:text-2xl mb-5.5">
        Billing Details
      </h2>

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 sm:p-8.5">
        {/* Name Fields */}
        <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
          <div className="w-full">
            <label htmlFor="firstName" className="block mb-2.5 text-gray-700 dark:text-gray-300">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              value={data.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              placeholder="John"
              className="rounded-md border border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 placeholder:text-gray-400 w-full py-2.5 px-5 outline-none duration-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20"
              required
            />
          </div>

          <div className="w-full">
            <label htmlFor="lastName" className="block mb-2.5 text-gray-700 dark:text-gray-300">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              value={data.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              placeholder="Doe"
              className="rounded-md border border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 placeholder:text-gray-400 w-full py-2.5 px-5 outline-none duration-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20"
              required
            />
          </div>
        </div>

        {/* Company */}
        <div className="mb-5">
          <label htmlFor="company" className="block mb-2.5 text-gray-700 dark:text-gray-300">
            Company Name (optional)
          </label>
          <input
            type="text"
            id="company"
            value={data.company || ''}
            onChange={(e) => handleChange('company', e.target.value)}
            className="rounded-md border border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 placeholder:text-gray-400 w-full py-2.5 px-5 outline-none duration-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20"
          />
        </div>

        {/* Country */}
        <div className="mb-5">
          <label htmlFor="country" className="block mb-2.5 text-gray-700 dark:text-gray-300">
            Country / Region <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="country"
              value={data.country}
              onChange={(e) => handleChange('country', e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-700 dark:border-gray-600 rounded-md border border-gray-300 text-gray-700 dark:text-gray-300 py-3 pl-5 pr-9 duration-200 appearance-none outline-none focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20"
              required
            >
              <option value="">Select a country</option>
              <option value="Colombia">Colombia</option>
              <option value="USA">United States</option>
              <option value="Mexico">Mexico</option>
              <option value="Spain">Spain</option>
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg className="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2.41469 5.03569L7.76749 10.2635L8.0015 10.492L8.23442 10.2623L13.5844 4.98735C13.6809 4.89086 13.8199 4.89087 13.9147 4.98569C14.0092 5.08024 14.0095 5.21864 13.9155 5.31345L8.16676 10.9622C8.06838 11.0606 8.02352 11.0667 8.00039 11.0667C7.94147 11.0667 7.89042 11.0522 7.82064 10.9991L2.08526 5.36345C1.99127 5.26865 1.99154 5.13024 2.08609 5.03569C2.18092 4.94086 2.31986 4.94086 2.41469 5.03569Z" />
              </svg>
            </span>
          </div>
        </div>

        {/* Address */}
        <div className="mb-5">
          <label htmlFor="address" className="block mb-2.5 text-gray-700 dark:text-gray-300">
            Street Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="address"
            value={data.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="House number and street name"
            className="rounded-md border border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 placeholder:text-gray-400 w-full py-2.5 px-5 outline-none duration-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20"
            required
          />

          <div className="mt-5">
            <input
              type="text"
              id="apartment"
              value={data.apartment || ''}
              onChange={(e) => handleChange('apartment', e.target.value)}
              placeholder="Apartment, suite, unit, etc. (optional)"
              className="rounded-md border border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 placeholder:text-gray-400 w-full py-2.5 px-5 outline-none duration-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20"
            />
          </div>
        </div>

        {/* City */}
        <div className="mb-5">
          <label htmlFor="city" className="block mb-2.5 text-gray-700 dark:text-gray-300">
            Town / City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="city"
            value={data.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className="rounded-md border border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 placeholder:text-gray-400 w-full py-2.5 px-5 outline-none duration-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20"
            required
          />
        </div>

        {/* State */}
        <div className="mb-5">
          <label htmlFor="state" className="block mb-2.5 text-gray-700 dark:text-gray-300">
            State / Province
          </label>
          <input
            type="text"
            id="state"
            value={data.state}
            onChange={(e) => handleChange('state', e.target.value)}
            className="rounded-md border border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 placeholder:text-gray-400 w-full py-2.5 px-5 outline-none duration-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20"
          />
        </div>

        {/* Phone */}
        <div className="mb-5">
          <label htmlFor="phone" className="block mb-2.5 text-gray-700 dark:text-gray-300">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            value={data.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="rounded-md border border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 placeholder:text-gray-400 w-full py-2.5 px-5 outline-none duration-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-5">
          <label htmlFor="email" className="block mb-2.5 text-gray-700 dark:text-gray-300">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="rounded-md border border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 placeholder:text-gray-400 w-full py-2.5 px-5 outline-none duration-200 focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20"
            required
          />
        </div>
      </div>
    </div>
  );
}
