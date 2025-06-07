import { OrderItem } from '../types/OrderItem';

export interface Order {
    id: number,
    customerName: string,
    customerorderCode: string,
    phone: string
    email: string
    locationId: Number,
    locationname: string,
    locationstartdatetime: string,
    locationenddatetime: string,
    locationbeautifiedstartdatetime: string,
    locationbeautifiedTimeInterval: string,
    createddatetime: string   ,
    modifieddatetime: string ,
    comment: string
    orderlines: OrderItem[],
    totalPrice: number
}