'use client';

import React from 'react';
import { PaymentMethodType } from '@/types';

interface PaymentMethodSelectorProps {
  selected: PaymentMethodType;
  onChange: (method: PaymentMethodType) => void;
}

export default function PaymentMethodSelector({ selected, onChange }: PaymentMethodSelectorProps) {
  const methods: { id: PaymentMethodType; label: string; icon: string }[] = [
    { id: 'transfer', label: 'Bank Transfer', icon: '🏦' },
    { id: 'cash_on_delivery', label: 'Cash on Delivery', icon: '💵' },
    { id: 'card', label: 'Credit / Debit Card', icon: '💳' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-7.5">
      <div className="border-b border-gray-300 dark:border-gray-600 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-[#8B4513] dark:text-[#D2691E]">Payment Method</h3>
      </div>

      <div className="p-4 sm:p-8.5">
        <div className="flex flex-col gap-3">
          {methods.map((method) => (
            <label
              key={method.id}
              htmlFor={method.id}
              className="flex cursor-pointer select-none items-center gap-4"
            >
              <div className="relative">
                <input
                  type="radio"
                  name="paymentMethod"
                  id={method.id}
                  className="sr-only"
                  checked={selected === method.id}
                  onChange={() => onChange(method.id)}
                />
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-full ${
                    selected === method.id
                      ? 'border-4 border-[#8B4513]'
                      : 'border border-gray-400'
                  }`}
                ></div>
              </div>

              <div
                className={`rounded-md border py-3.5 px-5 ease-out duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-transparent min-w-[240px] ${
                  selected === method.id
                    ? 'border-transparent bg-gray-100 dark:bg-gray-700'
                    : 'border-gray-300 dark:border-gray-600 shadow-sm'
                }`}
              >
                <div className="flex items-center">
                  <div className="pr-2.5 text-2xl">{method.icon}</div>
                  <div className="border-l border-gray-300 dark:border-gray-600 pl-2.5">
                    <p className="text-gray-800 dark:text-gray-200">{method.label}</p>
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
