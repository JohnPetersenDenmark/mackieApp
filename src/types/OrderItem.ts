import { Pizza } from '../types/Pizza';

export interface OrderItem {
  orderid: number,
  productid: number,
  productname: string,
  productdescription: string
  quantity: number;
  selected: boolean;
  unitprice: number,
  unitdiscountpercentage: number,
  discountedunitprice: number,
  producttype: number;
}