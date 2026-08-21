import { Product, PriceHistory, CreateProductRequest, UpdateProductRequest, UpdatePriceRequest } from '@/types/product';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        status: response.status,
        error: 'UNKNOWN_ERROR',
        message: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
      }));
      throw error;
    }

    // Handle empty responses
    const text = await response.text();
    if (!text) return {} as T;
    return JSON.parse(text);
  }

  // Public API
  async getProductByBarcode(barcode: string): Promise<Product> {
    return this.request<Product>(`/api/products/barcode/${barcode}`);
  }

  // Admin API
  async getAllProducts(credentials: string): Promise<Product[]> {
    return this.request<Product[]>('/api/products', {
      headers: {
        'Authorization': `Basic ${credentials}`,
      },
    });
  }

  async createProduct(data: CreateProductRequest, credentials: string): Promise<Product> {
    return this.request<Product>('/api/products', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
      },
      body: JSON.stringify(data),
    });
  }

  async updateProduct(id: number, data: UpdateProductRequest, credentials: string): Promise<Product> {
    return this.request<Product>(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Basic ${credentials}`,
      },
      body: JSON.stringify(data),
    });
  }

  async updatePrice(productId: number, data: UpdatePriceRequest, credentials: string): Promise<void> {
    await this.request<void>(`/api/products/${productId}/prices`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
      },
      body: JSON.stringify(data),
    });
  }

  async getPriceHistory(productId: number, credentials: string): Promise<PriceHistory[]> {
    return this.request<PriceHistory[]>(`/api/products/${productId}/prices`, {
      headers: {
        'Authorization': `Basic ${credentials}`,
      },
    });
  }
}

export const apiClient = new ApiClient(API_BASE);
