import { format } from "date-fns";

import { da } from "date-fns/locale";
import './charts.css';



interface ShowLineChartProps {
    groupedPizzas: any[] | undefined;
    selectedDate: string;
    handlePizzaClick: (pizzaName: string) => void;
}

const ShowPizzasForSelectedDate: React.FC<ShowLineChartProps> = ({ groupedPizzas, selectedDate, handlePizzaClick }) => {

    return (

        <div style={{ marginTop: '2rem', color: '#000000', fontSize: '20px', textAlign: 'left' }}>
            <h3>Detaljer for {format(new Date(selectedDate), "EEE d. MMM", { locale: da })}</h3>


            <div className="pizza-header-row">
                <div style={{ flex: 1 }}>Pizza</div>
                <div style={{ flex: 1, textAlign: 'right' }}>Antal</div>
                <div style={{ flex: 1, textAlign: 'right' }}>Pris</div>
                <div style={{ flex: 1, textAlign: 'right' }}>Total</div>
            </div>

            {groupedPizzas ? groupedPizzas.map(pizza => (
                <div style={{ fontSize: '20px' }} className="pizza-row" >
                    <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => handlePizzaClick(pizza.name)} >
                        {pizza.name}
                    </div>
                    <div style={{ flex: 1, textAlign: 'right' }}>{pizza.quantity}</div>
                    <div style={{ flex: 1, textAlign: 'right' }}>{pizza.unitprice.toFixed(2).replace('.', ',')} kr.</div>
                    <div style={{ flex: 1, textAlign: 'right' }}>{pizza.total.toFixed(2).replace('.', ',')} kr.</div>
                </div>

            )) : ''}

        </div>

    )
}

export default ShowPizzasForSelectedDate;
