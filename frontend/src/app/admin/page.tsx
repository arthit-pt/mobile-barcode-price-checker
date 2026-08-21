'use client';

import { useState, useEffect } from 'react';
import { Product, PriceHistory, CreateProductRequest, UpdateProductRequest } from '@/types/product';
import { apiClient } from '@/lib/api';

type AdminView = 'login' | 'products' | 'create' | 'edit' | 'price-history';

export default function AdminPage() {
  const [view, setView] = useState<AdminView>('login');
  const [credentials, setCredentials] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    barcode: '',
    name: '',
    unit: '',
    imageUrl: '',
    price: '',
    status: true,
  });
  const [newPrice, setNewPrice] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const creds = btoa(`${username}:${password}`);

    try {
      await apiClient.getAllProducts(creds);
      setCredentials(creds);
      setView('products');
      loadProducts(creds);
    } catch (err: any) {
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  const loadProducts = async (creds?: string) => {
    setIsLoading(true);
    try {
      const data = await apiClient.getAllProducts(creds || credentials);
      setProducts(data);
    } catch (err) {
      setError('ไม่สามารถโหลดข้อมูลสินค้าได้');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const request: CreateProductRequest = {
        barcode: formData.barcode,
        name: formData.name,
        unit: formData.unit,
        imageUrl: formData.imageUrl || undefined,
        price: parseFloat(formData.price),
      };
      await apiClient.createProduct(request, credentials);
      setSuccess('เพิ่มสินค้าสำเร็จ');
      resetForm();
      setView('products');
      loadProducts();
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาด');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setError('');
    setIsLoading(true);

    try {
      const request: UpdateProductRequest = {
        name: formData.name,
        unit: formData.unit,
        imageUrl: formData.imageUrl || undefined,
        status: formData.status,
      };
      await apiClient.updateProduct(selectedProduct.id, request, credentials);
      setSuccess('แก้ไขสินค้าสำเร็จ');
      setView('products');
      loadProducts();
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาด');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setError('');
    setIsLoading(true);

    try {
      await apiClient.updatePrice(selectedProduct.id, { price: parseFloat(newPrice) }, credentials);
      setSuccess('เปลี่ยนราคาสำเร็จ');
      setNewPrice('');
      loadProducts();
      loadPriceHistory(selectedProduct.id);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาด');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPriceHistory = async (productId: number) => {
    try {
      const data = await apiClient.getPriceHistory(productId, credentials);
      setPriceHistory(data);
    } catch (err) {
      setError('ไม่สามารถโหลดประวัติราคาได้');
    }
  };

  const openEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      barcode: product.barcode,
      name: product.name,
      unit: product.unit,
      imageUrl: product.imageUrl || '',
      price: product.price.toString(),
      status: product.status,
    });
    setView('edit');
  };

  const openPriceHistory = (product: Product) => {
    setSelectedProduct(product);
    loadPriceHistory(product.id);
    setView('price-history');
  };

  const openCreate = () => {
    resetForm();
    setView('create');
  };

  const resetForm = () => {
    setFormData({
      barcode: '',
      name: '',
      unit: '',
      imageUrl: '',
      price: '',
      status: true,
    });
  };

  // Clear messages after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Login View
  if (view === 'login') {
    return (
      <main className="min-h-screen max-w-md mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">Admin Login</h1>
        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              required
            />
          </div>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            เข้าสู่ระบบ
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">จัดการสินค้า</h1>
        <div className="flex gap-2">
          {view !== 'products' && (
            <button
              onClick={() => { setView('products'); setError(''); }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg transition-colors"
            >
              กลับ
            </button>
          )}
          {view === 'products' && (
            <button
              onClick={openCreate}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              + เพิ่มสินค้า
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm">{success}</p>
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Products List */}
      {view === 'products' && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">กำลังโหลด...</div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center text-gray-500">ยังไม่มีสินค้า</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {products.map((product) => (
                <div key={product.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500 font-mono">{product.barcode}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-lg font-bold text-green-700">฿{product.price.toFixed(2)}</span>
                        <span className="text-sm text-gray-500">/ {product.unit}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${product.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {product.status ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(product)}
                        className="px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 border border-primary-200 rounded-lg transition-colors"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => openPriceHistory(product)}
                        className="px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 border border-purple-200 rounded-lg transition-colors"
                      >
                        ราคา
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Product */}
      {view === 'create' && (
        <form onSubmit={handleCreateProduct} className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">เพิ่มสินค้าใหม่</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Barcode *</label>
            <input
              type="text"
              inputMode="numeric"
              value={formData.barcode}
              onChange={(e) => setFormData({ ...formData, barcode: e.target.value.replace(/[^0-9]/g, '') })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              required
              minLength={8}
              maxLength={20}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อสินค้า *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">หน่วย *</label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              placeholder="เช่น ขวด, ซอง, กล่อง"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL รูปภาพ</label>
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              placeholder="/images/product.jpg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ราคา (บาท) *</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {isLoading ? 'กำลังบันทึก...' : 'บันทึกสินค้า'}
          </button>
        </form>
      )}

      {/* Edit Product */}
      {view === 'edit' && selectedProduct && (
        <form onSubmit={handleUpdateProduct} className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">แก้ไขสินค้า</h2>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Barcode</p>
            <p className="font-mono">{selectedProduct.barcode}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อสินค้า *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">หน่วย *</label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL รูปภาพ</label>
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">สถานะ:</label>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, status: !formData.status })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.status ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.status ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className="text-sm text-gray-600">{formData.status ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}</span>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {isLoading ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
          </button>
        </form>
      )}

      {/* Price History */}
      {view === 'price-history' && selectedProduct && (
        <div className="space-y-4">
          {/* Update Price Form */}
          <form onSubmit={handleUpdatePrice} className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">เปลี่ยนราคา: {selectedProduct.name}</h2>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">ราคาปัจจุบัน</p>
              <p className="text-2xl font-bold text-green-700">฿{selectedProduct.price.toFixed(2)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ราคาใหม่ (บาท) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !newPrice}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {isLoading ? 'กำลังบันทึก...' : 'เปลี่ยนราคา'}
            </button>
          </form>

          {/* Price History List */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">ประวัติราคา</h3>
            {priceHistory.length === 0 ? (
              <p className="text-gray-500">ยังไม่มีประวัติราคา</p>
            ) : (
              <div className="space-y-2">
                {priceHistory.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg ${index === 0 ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}
                  >
                    <div>
                      <p className={`font-bold ${index === 0 ? 'text-green-700' : 'text-gray-700'}`}>
                        ฿{item.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(item.effectiveFrom).toLocaleDateString('th-TH')}
                        {item.effectiveTo && ` - ${new Date(item.effectiveTo).toLocaleDateString('th-TH')}`}
                      </p>
                    </div>
                    {index === 0 && (
                      <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
                        ปัจจุบัน
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
