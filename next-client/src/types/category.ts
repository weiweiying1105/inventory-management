import { Product } from "./product";

export interface ICategory {
  id: number;
  categoryName: string;
  count: number;
  products: Product[];
}