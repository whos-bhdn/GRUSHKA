import {ICategoryResponse} from "../category/category.interface";
import { ISubCategory } from "../subcategory/subcategory.interface";

export interface IProductResponse {
  category: ICategoryResponse;
  subcategory: ISubCategory;
  id: string;
  name: string;
  path: string;
  imagePath: string;
  description: string;
  price: number;
  count: number;
}

export interface IProductRequest {
  category: ICategoryResponse;
  subcategory: ISubCategory;
  name: string;
  path: string;
  imagePath: string;
  description: string;
  price: number;
  count: number;
}

