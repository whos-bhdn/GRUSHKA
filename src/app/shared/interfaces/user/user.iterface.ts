import {IOrderResponse} from "../order/order.interface";

export interface User {
  address: string;
  email: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  orders: Array<IOrderResponse>;
  role: string
}
