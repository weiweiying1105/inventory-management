export interface Product extends NewProduct {
  productId: string;
}
export interface NewProduct {
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
  image: string;
}