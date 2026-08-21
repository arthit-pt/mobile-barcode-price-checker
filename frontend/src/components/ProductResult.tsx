'use client';

import { Product } from '@/types/product';

interface ProductResultProps {
  product: Product;
  onScanAgain: () => void;
}

export default function ProductResult({ product, onScanAgain }: ProductResultProps) {
  return (
    <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Product Image */}
      {product.imageUrl && (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="max-h-full max-w-full object-contain p-4"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Product Info */}
      <div className="p-6 space-y-4">
        {/* Product Name */}
        <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>

        {/* Price - Large and prominent */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-sm text-green-700 font-medium">ราคา</p>
          <p className="text-4xl font-bold text-green-700">
            ฿{product.price.toFixed(2)}
            <span className="text-lg font-normal text-green-600 ml-2">/ {product.unit}</span>
          </p>
        </div>

        {/* Barcode */}
        <div className="flex items-center gap-2 text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          <span className="font-mono text-sm">{product.barcode}</span>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${product.status ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className={`text-sm font-medium ${product.status ? 'text-green-700' : 'text-red-700'}`}>
            {product.status ? 'มีสินค้า' : 'สินค้าหมด'}
          </span>
        </div>
      </div>

      {/* Scan Again Button */}
      <div className="px-6 pb-6">
        <button
          onClick={onScanAgain}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-6 rounded-xl shadow transition-all duration-200 flex items-center justify-center gap-2 text-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          สแกนสินค้าใหม่
        </button>
      </div>
    </div>
  );
}
