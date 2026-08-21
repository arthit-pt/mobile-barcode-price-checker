'use client';

import { useState } from 'react';

interface ManualBarcodeInputProps {
  onSearch: (barcode: string) => void;
  isLoading: boolean;
}

export default function ManualBarcodeInput({ onSearch, isLoading }: ManualBarcodeInputProps) {
  const [barcode, setBarcode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (barcode.trim()) {
      onSearch(barcode.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3">
        <label htmlFor="barcode-input" className="text-sm font-medium text-gray-700">
          กรอก Barcode
        </label>
        <div className="flex gap-2">
          <input
            id="barcode-input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="เช่น 8851959131048"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            maxLength={20}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!barcode.trim() || isLoading}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            ) : (
              'ค้นหา'
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
