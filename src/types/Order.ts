import { OrderItem } from '../types/OrderItem';

export interface Order {
    id: number,
    customerName: string,
    customerorderCode: string,
    phone: string
    email: string
    locationId: Number,
    locationname : string,
    locatiostartdatetime : string,    
    locationenddatetime : string ,
     locationbeautifiedstartdatetime : string ,
     locationbeautifiedTimeInterval : string ,
      

    // subscribeToNewsletter : boolean,
    comment: string
    orderlines: OrderItem[],
    totalPrice: number
}