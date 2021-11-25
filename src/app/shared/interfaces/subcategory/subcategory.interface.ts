import {ICategoryResponse} from "../category/category.interface";

export interface ISubCategory {
  id: number | string;
  category: ICategoryResponse;
  name: string;
  path: string;
}
