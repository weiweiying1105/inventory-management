export interface Product extends NewProduct {
  productId: string;
}
interface Sku { }
export interface NewProduct {
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
  images: string[]; // 修改为数组以匹配 Prisma 模型
  description?: string;
  isHot?: boolean;
  isNew?: boolean;
  isPopular?: boolean;
  isRecommend?: boolean;
  storageMethod?: string;
  skus: Sku[];
  productId?: string
}
export interface Category {
  id?: number;
  categoryName: string
}