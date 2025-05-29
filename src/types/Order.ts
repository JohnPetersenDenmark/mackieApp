import { OrderItem } from '../types/OrderItem';

export interface Order {
 customerName: string,
  customerOrderNumber: string,
      phone : string
      email : string
      locationId: string,
      subscribeToNewsletter : boolean,
      comment: string
      items: OrderItem[],        
      totalPrice: number
}