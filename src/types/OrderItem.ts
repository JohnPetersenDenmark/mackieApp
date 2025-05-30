import { Pizza } from '../types/Pizza';

export interface OrderItem {
   product: any;
  quantity: number;
  selected: boolean;
  unitdiscountpercentage : number,
  discountedunitprice : number
}