import { Pizza } from '../types/Pizza';

export interface OrderItem {
  pizza: Pizza;
  quantity: number;
  selected: boolean;
}