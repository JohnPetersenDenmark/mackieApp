import { OrderItem } from '../types/OrderItem';

export interface Order {
    id : number,
 customerName: string,
  customerorderCode: string,
      phone : string
      email : string
      locationId: string,
     // subscribeToNewsletter : boolean,
      comment: string
      orderlines: OrderItem[],        
      totalPrice: number
}