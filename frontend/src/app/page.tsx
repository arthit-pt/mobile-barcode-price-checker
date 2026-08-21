'use client';

import { useState } from 'react';
import BarcodeScanner from '@/components/BarcodeScanner';
import ManualBarcodeInput from '@/components/ManualBarcodeInput';
import ProductResult from '@/components/ProductResult';
import { Product, ApiError } from '@/types/product';
import { apiClient } from '@/lib/api';

type ViewState = 'scan' | 'result' | 'not-found' | 'error';

export default function HomePage() {
  const [viewState, setViewState] = useState<ViewState>('scan');
  const [product, setProduct] = useState<Product | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchedBarcode, setSearchedBarcode] = useState('');

  const searchProduct = async (barcode: string) => {
    setIsLoading(true);
    setErrorMessage('');
    setSearchedBarcode(barcode);

    try {
      const result = await apiClient.getProductByBarcode(barcode);
      setProduct(result);
      setViewState('result');
    } catch (err: any) {
      if (err?.error === 'PRODUCT_NOT_FOUND') {
        setViewState('not-found');
      } else if (err?.error === 'INVALID_BARCODE') {
        setErrorMessage(err.message || 'Barcode ไม่ถูกต้อง');
        setViewState('error');
      } else {
        setErrorMessage('ไม่สามารถเชื่อมต่อระบบได้ กรุณาลองใหม่อีกครั้ง');
        setViewState('error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanAgain = () => {
    setViewState('scan');
    setProduct(null);
    setErrorMessage('');
    setSearchedBarcode('');
  };

  return (
    <main className="min-h-screen max-w-md mx-auto px-4 py-6">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">ตรวจสอบราคาสินค้า</h1>
        <p className="text-sm text-gray-500 mt-1">สแกน Barcode หรือกรอกรหัสเพื่อดูราคา</p>
      </header>

      {/* Scan View */}
      {viewState === 'scan' && (
        <div className="space-y-6">
          {/* Camera Scanner */}
          <BarcodeScanner
            onScan={searchProduct}
            onError={(error) => setErrorMessage(error)}
          />

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400">หรือ</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Manual Input */}
          <ManualBarcodeInput onSearch={searchProduct} isLoading={isLoading} />

          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{errorMessage}</p>
            </div>
          )}
        </div>
      )}

      {/* Product Result View */}
      {viewState === 'result' && product && (
        <ProductResult product={product} onScanAgain={handleScanAgain} />
      )}

      {/* Not Found View */}
      {viewState === 'not-found' && (
        <div className="text-center space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-800">ไม่พบสินค้าที่ตรงกับ Barcode นี้</p>
            <p className="text-sm text-gray-500 mt-2 font-mono">{searchedBarcode}</p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleScanAgain}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-6 rounded-xl shadow transition-all duration-200"
            >
              สแกนใหม่
            </button>
            <button
              onClick={handleScanAgain}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-xl border border-gray-200 transition-colors"
            >
              กรอก Barcode ใหม่
            </button>
          </div>
        </div>
      )}

      {/* Error View */}
      {viewState === 'error' && (
        <div className="text-center space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-800">{errorMessage}</p>
          </div>

          <button
            onClick={handleScanAgain}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-6 rounded-xl shadow transition-all duration-200"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      )}
    </main>
  );
}
