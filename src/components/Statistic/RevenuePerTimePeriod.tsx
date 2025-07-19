import React, { useEffect, useState } from 'react';
import { Order } from '../../types/Order';
import { toZonedTime } from "date-fns-tz";
import { da } from "date-fns/locale";
import { parseISO, format, subDays, isAfter } from "date-fns";
import TimePeriodSelector from "./TimePeriodSelector"
import QuarterSelector from "./QuarterSelector"
import FixedIntervalSelector from "./FixedIntervalSelector"


import ClipLoader from 'react-spinners/ClipLoader';
import {
    LineChart, PieChart, Pie, BarChart, Bar, Cell, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { scaleLinear } from "d3-scale";
import { interpolateHsl } from "d3-interpolate";
import './charts.css';
import './RevenuePerTimePeriod.css'

import { AxiosClientGet, AxiosClientPost } from '../../types/AxiosClient';


let colors: string[] = [];

interface RevenueTimePeriodModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RevenuePerTimePeriod: React.FC = () => {

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [data, setData] = useState<any[] | undefined>([]);
    const [groupedPizzas, setGroupedPizzas] = useState<any[] | undefined>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);



    const [selectedPizzaName, setSelectedPizzaName] = useState<string | null>(null);

    const [ordersIncludingSelectedPizza, setOrdersIncludingSelectedPizza] = useState<Order[]>([]);

    useEffect(() => {

        colors = createAnalogousColorScale("#8d4a5b", "#ffffff", 7);

    }, []);


    const createAnalogousColorScale = (baseColor: string, endColor: string, count: number): string[] => {
        const scale = scaleLinear<string>()
            .domain([0, 1])
            .range([baseColor, endColor])
            .interpolate(interpolateHsl);

        return Array.from({ length: count }, (_, i) => scale(i / (count - 1)));
    };


    function groupRevenuePerDay(orders: Order[]) {

        interface OrderRevenue {
            totalPrice: number;
            displayLabel: string;
            onOrders: Order[];
        }

        const revenueByDay: Record<string, OrderRevenue> = {};

        orders.forEach(order => {
            const zonedDate = toZonedTime(new Date(order.createddatetime), "Europe/Copenhagen");
            const dateKey = format(zonedDate, "yyyy-MM-dd"); // for sorting
            const label = format(zonedDate, "EEE d. MMM", { locale: da }); // for display

            if (!revenueByDay[dateKey]) {
                revenueByDay[dateKey] = {
                    totalPrice: 0,
                    displayLabel: label,
                    onOrders: []
                };
            }

            // 🔁 Loop over orderLines to calculate revenue
            order.orderlines.forEach(orderLine => {
                const lineTotal = orderLine.unitprice * orderLine.quantity;
                revenueByDay[dateKey].totalPrice += lineTotal;
            });

            revenueByDay[dateKey].onOrders.push(order);
        });

        const revenues = Object.entries(revenueByDay).map(([orderDate, revenue]) => ({
            orderDate,
            order: revenue.onOrders,
            label: revenue.displayLabel,
            Revenue: revenue.totalPrice,
        }));

        revenues.sort((a, b) =>
            new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime()
        );

        return revenues;
    }

    function groupPizzasByNameWithTotals(orders: Order[]) {
        type PizzaTotals = {
            quantity: number;
            unitprice: number;
            total: number;
        };

        const pizzaMap: Record<string, PizzaTotals> = {};

        orders.forEach(order => {
            order.orderlines.forEach(line => {
                const name = line.productname;
                const qty = line.quantity;
                const price = line.unitprice;

                if (!pizzaMap[name]) {
                    pizzaMap[name] = {
                        quantity: 0,
                        unitprice: price,
                        total: 0
                    };
                }

                pizzaMap[name].quantity += qty;
                pizzaMap[name].total += qty * price;
            });
        });

        return Object.entries(pizzaMap).map(([name, data]) => ({
            name,
            quantity: data.quantity,
            unitprice: data.unitprice,
            total: data.total,
        }));
    }


    const handleBarClick = (charbarData: any) => {

        const isoDate = charbarData?.payload?.orderDate;

        if (isoDate) {
            const matchingOrders = orders.filter(order => {
                const orderDate = format(
                    toZonedTime(new Date(order.createddatetime), "Europe/Copenhagen"),
                    "yyyy-MM-dd"
                );
                return orderDate === isoDate;
            });

            setSelectedDate(isoDate);
            setSelectedOrders(matchingOrders);
            const groupedPizzasArray = groupPizzasByNameWithTotals(selectedOrders)
            setGroupedPizzas(groupedPizzasArray);


        }
    };

    const handlePizzaClick = (pizzaName: string) => {

        pizzaName = pizzaName.trim();
        setSelectedPizzaName(pizzaName);

        let ordersWithSelectedPizza: Order[] = [];
        selectedOrders.forEach(order => {
            const zonedDate = toZonedTime(new Date(order.createddatetime), "Europe/Copenhagen");
            const dateKey = format(zonedDate, "yyyy-MM-dd"); // for sorting
            const label = format(zonedDate, "EEE d. MMM", { locale: da }); // for display

            order.orderlines.forEach(orderLine => {
                if (orderLine.productname.trim() === pizzaName) {
                    ordersWithSelectedPizza.push(order);
                }
            });


        });
        setOrdersIncludingSelectedPizza(ordersWithSelectedPizza);
    }

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

    const handleSubmit = async () => {
        const dateRange = {
            startdate: startDate ? format(startDate, 'dd-MM-yyyy') : '',
            enddate: endDate ? format(endDate, 'dd-MM-yyyy') : ''
        };
        try {
            setLoadingOrders(true)
            const response = await AxiosClientPost('/Home/orderlistbydateinterval', dateRange, true);
            setOrders(response)
            let groupedOrders = groupRevenuePerDay(response);
            setData(groupedOrders);
            setLoadingOrders(false)
        } catch (error) {

            console.error(error);
        } finally {

        }
    };

    return (
        <>
            <div className="chart-wrapper">
                <div style={{ marginTop: '30px' }}>
                    Omsætning

                    <QuarterSelector                      
                        onStartDateChange={setStartDate}
                        onEndDateChange={setEndDate}                       
                    / >
                   
                   <FixedIntervalSelector  onStartDateChange={setStartDate}
                        onEndDateChange={setEndDate}      />

                </div>
                <div style={{ marginTop: '50px' }}>
                    <TimePeriodSelector
                        startDate={startDate}
                        endDate={endDate}
                        onStartDateChange={setStartDate}
                        onEndDateChange={setEndDate}
                        onSubmit={handleSubmit}
                        submitting={loadingOrders}
                    />
                    {loadingOrders ? <div><ClipLoader size={50} color="#8d4a5b" /></div> : ''}
                </div>
            </div>
            <div className="chart-wrapper">
                <ResponsiveContainer style={{ marginLeft: '0px', marginBottom: '0px' }} width="100%" height={400}>
                    <LineChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="orderDate"
                            tick={{ fontSize: 16 }} // X-axis label size
                            tickFormatter={(dateStr) =>
                                format(new Date(dateStr), "EEE d. MMM", { locale: da })
                            }

                        />
                        <YAxis
                            tick={{ fontSize: 16 }}
                            tickFormatter={(value: number) =>
                                value.toFixed(2).replace('.', ',')
                            }
                        />
                        <Tooltip
                            formatter={(value: number, name: string) => [
                                value.toFixed(2).replace('.', ',') + ' kr.',
                                'Omsætning' // 👈 your custom label instead of "Revenue"
                            ]}
                        />
                        {/* <Legend /> */}
                        <Line type="monotone" dataKey="Revenue" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
                {/* </div>

            <div className="chart-wrapper"> */}
                <ResponsiveContainer style={{ marginTop: '0px', marginLeft: '0px' }} width="100%" height={600}>
                    <PieChart margin={{ top: 40, right: 20, bottom: 20, left: 20 }}>
                        <Pie
                            data={data}
                            dataKey="Revenue"   // numeric field
                            nameKey="orderDate"    // label field
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            fill="#8884d8"
                            label={({ name, percent, x, y }) => (
                                <text
                                    x={x}
                                    y={y}
                                    fill="#333"
                                    fontSize={14}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                >
                                    {`${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                                </text>
                            )}
                        >
                            {data ? data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            )) : ''}
                        </Pie>
                        <Tooltip
                            formatter={(value: number, name: string) => [
                                value.toFixed(2).replace('.', ',') + ' kr.',
                                'Omsætning' // 👈 replaces default "Revenue"
                            ]}
                        />
                        {/* <Legend /> */}
                    </PieChart>
                </ResponsiveContainer>
                {/*   </div>

            <div className="chart-wrapper">     */}
                <ResponsiveContainer style={{ marginTop: '0px', marginLeft: '0px' }} width="100%" height={500}>
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="orderDate"
                            angle={-30}
                            tick={{ fontSize: 18 }} // X-axis label size
                            textAnchor="end"
                            tickFormatter={(dateStr) =>
                                format(new Date(dateStr), "EEE d. MMM", { locale: da })
                            }
                        />

                        <YAxis
                            tick={{ fontSize: 18 }} // X-axis label size
                            tickFormatter={(value: number) =>
                                value.toFixed(2).replace('.', ',')
                            }
                        />

                        <Tooltip
                            formatter={(value: number, name: string) => [
                                value.toFixed(2).replace('.', ',') + ' kr.',
                                'Omsætning' // 👈 your custom label instead of "Revenue"
                            ]}
                        />
                        {/* <Legend /> */}
                        <Bar dataKey="Revenue" fill="#8884d8"
                            // onClick={(data) => handleBarClick(data, orders, setSelectedDate, setSelectedOrders)}
                            onClick={(chartDdata) => handleBarClick(chartDdata)}
                        >
                            {data?.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Bar>

                    </BarChart>
                </ResponsiveContainer>
                {selectedDate && (
                    <>
                        <div style={{ marginTop: '2rem', color: '#000000', fontSize: '20px', textAlign: 'left' }}>
                            <h3>Detaljer for {format(new Date(selectedDate), "EEE d. MMM", { locale: da })}</h3>

                        </div>
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
                    </>
                )}



                {ordersIncludingSelectedPizza && (
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
                                        {order.orderlines.map((curOrderLine, lineIndex) => (

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
                )}



                <button onClick={() => setSelectedDate(null)}>Luk</button>
            </div>
        </>
    )
};

export default RevenuePerTimePeriod;
