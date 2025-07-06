// types/product.ts

export interface Image {
  id: number;
  url: string;
  name: string;
}

export interface SpecValue {
  id?: number;
  specGroupId?: number;
  value: string;
}

export interface SpecGroup {
  id?: number;
  name: string;
  values: SpecValue[];
}

export interface Sku {
  id?: number;
  unit: string;
  retailPrice: number;
  wholesalePrice: number;
  memberPrice: number;
  weight: number;
  dimensions: string;
  stock: number;
  code: string;
  isDefault: boolean;
  specValues: { specGroupId: number; value: string; }[];
}

export interface Product {
  productId: number;
  name: string;
  categoryId: number;
  storageMethod: string;
  description: string;
  images: string[];
  thumb: string;
  tags: string[];
  rating: number;
  isPopular: boolean;
  isHot: boolean;
  isNew: boolean;
  isRecommend: boolean;
  specGroups: SpecGroup[];
  skus: Sku[];
}

export interface NewProduct extends Omit<Product, 'productId'> { }