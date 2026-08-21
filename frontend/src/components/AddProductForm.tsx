'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import { apiClient } from '@/lib/api';

interface AddProductFormProps {
  barcode: string;
  onSuccess: (product: Product) => void;
  onCancel: () => void;
}

export default function AddProductForm({ barcode, onSuccess, onCancel }: AddProductFormProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const product = await apiClient.createProductPublic({
        barcode,
        name: name.trim(),
        unit: 'ชิ้น',
        price: parseFloat(price),
      });
      onSuccess(product);
    } catch (err: any) {
      if (err?.errors) {
        const messages = Object.values(err.errors).join(', ');
        setError(messages);
      } else {
        setError(err?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-1">เพิ่มสินค้าใหม่</h2>
      <p className="text-sm text-gray-500 mb-4">กรอกข้อมูลสินค้าสำหรับ Barcode นี้</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Barcode (read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Barcode</label>
          <input
            type="text"
            value={barcode}
            disabled
            className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-600 font-mono"
          />
        </div>

        {/* Product Name */}
        <div>
          <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 mb-1">
            ชื่อสินค้า *
          </label>
          <input
            id="product-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="เช่น น้ำดื่ม Crystal 600ml"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            required
            disabled={isLoading}
          />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="product-price" className="block text-sm font-medium text-gray-700 mb-1">
            ราคา (บาท) *
          </label>
          <input
            id="product-price"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-lg"
            required
            disabled={isLoading}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <button
            type="submit"
            disabled={isLoading || !name.trim() || !price}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl shadow transition-all duration-200 text-lg"
          >
            {isLoading ? 'กำลังบันทึก...' : 'บันทึกสินค้า'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-xl border border-gray-200 transition-colors"
          >
            ยกเลิก
          </button>
        </div>
      </form>
    </div>
  );
}
