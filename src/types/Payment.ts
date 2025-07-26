export interface Payment {
    id: number;
    orderid: string;
    flatratepaymentsuccess: boolean;
    flatrateinvoicenumber: string;
    flatratepaymentid: string;
    flatratecustomernumber: string;

    flatratestatusorerror: string;
    flatratesubscription: string;
    flatratepaymentmethod: string;

}