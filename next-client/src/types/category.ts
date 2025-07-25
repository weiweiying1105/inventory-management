import { Product } from "./product";

export interface ICategory {
  id: number;
  categoryName: string;
  count?: number;
  products?: Product[];
  thumbnail?: string;
  description?: string;
  parentId?: number;
  subCategoryName?: string;
  children?: ICategory[];
}