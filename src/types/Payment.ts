export interface Payment {
    id: number;
    orderid: number;
    flatratepaymentsuccess: boolean;
    flatrateinvoicenumber: string;
    flatratepaymentid: string;
    flatratecustomernumber: string;

    flatratestatusorerror: string;
    flatratesubscription: string;
    flatratepaymentmethod: string;

}