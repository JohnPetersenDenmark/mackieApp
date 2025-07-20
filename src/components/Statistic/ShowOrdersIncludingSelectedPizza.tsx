import { format } from "date-fns";

import { da } from "date-fns/locale";
import './charts.css';



interface ShowOrdersProps {
    ordersIncludingSelectedPizza: any[] | undefined;
  selectedPizzaName : string | null;
}

const ShowOrdersIncludingSelectedPizza: React.FC<ShowOrdersProps> = ({ ordersIncludingSelectedPizza , selectedPizzaName }) => {


function formatDateToDanish(date: Date): string {
        const options: Intl.DateTimeFormatOptions = {
            timeZone: "Europe/Copenhagen",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        };

        const parts = new Intl.DateTimeFormat("da-DK", options).formatToParts(date);
        const get = (type: string) => parts.find(p => p.type === type)?.value ?? "";

        return `${get("day")}-${get("month")}-${get("year")} ${get("hour")}:${get("minute")}`;
    }

    return (         
                    <>
                        {ordersIncludingSelectedPizza ? ordersIncludingSelectedPizza.map(order => (
                            <>
                                <div className="order-wrapper">
                                    <div style={{ fontSize: '20px', textAlign: 'center', marginTop: '20px' }}>
                                        Bestillingsnummer: {order.customerorderCode}
                                    </div>

                                    <div className="ordersGridHeader" >


                                        <div>Kunde: {order.customerName}</div>
                                        <div>Telefon: {order.phone}</div>
                                        <div>Email: {order.email}</div>
                                        <div>Oprettet: {formatDateToDanish(new Date(order.createddatetime + "Z"))}</div>
                                        <div>Ændret: {formatDateToDanish(new Date(order.modifieddatetime + "Z"))}</div>
                                        <div>{order.payeddatetime ? "Betalt: " + formatDateToDanish(new Date(order.payeddatetime + "Z")) : ''}</div>

                                    </div>

                                    <div>
                                        {order.orderlines.map((curOrderLine : any, lineIndex : any) => (

                                            <div className={curOrderLine.productname.trim() === selectedPizzaName ? 'orderlineGridHeader-pizzaselected' : 'orderlineGridHeader'} >
                                                <div className="orderline">{curOrderLine.productname}</div>
                                                <div className="orderline">{curOrderLine.quantity} stk.</div>
                                                <div className="orderline">
                                                    {curOrderLine.pizzanumber}
                                                </div>

                                                <div className="orderline" style={{ textAlign: 'right' }}>{curOrderLine.unitprice.toFixed(2).replace('.', ',')} kr.</div>
                                                <div className="orderline" style={{ textAlign: 'right' }}>
                                                    {(curOrderLine.unitprice * curOrderLine.quantity)
                                                        .toFixed(2)
                                                        .replace('.', ',')} kr.
                                                </div>
                                            </div>
                                        ))}

                                    </div>
                                </div>
                            </>
                        ))
                            : ''}

                    </>
            )                    
}

export default ShowOrdersIncludingSelectedPizza;
