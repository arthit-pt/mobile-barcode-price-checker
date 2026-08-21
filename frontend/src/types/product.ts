export interface Product {
  id: number;
  barcode: string;
  name: string;
  price: number;
  unit: string;
  imageUrl: string | null;
  status: boolean;
}

export interface PriceHistory {
  price: number;
  effectiveFrom: string;
  effectiveTo: string | null;
}

export interface CreateProductRequest {
  barcode: string;
  name: string;
  unit: string;
  imageUrl?: string;
  price: number;
}

export interface UpdateProductRequest {
  name: string;
  unit: string;
  imageUrl?: string;
  status: boolean;
}

export interface UpdatePriceRequest {
  price: number;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  errors?: Record<string, string>;
}
