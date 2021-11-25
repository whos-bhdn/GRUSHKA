import { IProductResponse } from "../product/product.intarface";

export interface IOrderResponse {
  id: number | string;
  basket: Array<IProductResponse>;
  price: number;
  name: string;
  phoneNumber: string;
  address: string;
  selected: string;
  status: Array<string>;
  payment: string;
}
