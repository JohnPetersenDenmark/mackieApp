import React, { useEffect, useState } from 'react';
import { Order } from '../../types/Order';
import { toZonedTime } from "date-fns-tz";
import { da } from "date-fns/locale";
import { parseISO, format, subDays, isAfter } from "date-fns";
import TimePeriodSelector from "./TimePeriodSelector"
import QuarterSelector from "./QuarterSelector"
import ShowLineChart from "./ShowLineChart"
import ShowPieChart from "./ShowPieChart"
import ShowBarChart from "./ShowBarChart"
import ShowPizzasForSelectedDate from "./ShowPizzasForSelectedDate"
import ShowBarChartRevenuePerPizza from "./ShowBarChartRevenuePerPizza"

import ShowOrdersIncludingSelectedPizza from "./ShowOrdersIncludingSelectedPizza"



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
    const [groupedPizzasPerPizza, setGroupedPizzasPerPizza] = useState<any[] | undefined>([]);

    const [groupedPizzas, setGroupedPizzas] = useState<any[] | undefined>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);



    const [selectedPizzaName, setSelectedPizzaName] = useState<string | null>(null);

    const [ordersIncludingSelectedPizza, setOrdersIncludingSelectedPizza] = useState<Order[]>([]);

    useEffect(() => {

        colors = createAnalogousColorScale("#8d4a5b", "#eedfe3", 10);
        //  colors = createAnalogousColorScale("#ffffff", "#000000", 7);

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

    function groupRevenuePerPizza(orders: Order[]) {

        interface PizzaRevenue {
            pizzaId: string
            quantity: number;
            totalPrice: number;
            displayLabel: string;
            onOrders: Order[];
        }
        const revenueByPizza: Record<string, PizzaRevenue> = {};


        orders.forEach(order => {
            order.orderlines.forEach(orderLine => {

                const pizzaIdKey = orderLine.productid.toString();


                if (!revenueByPizza[pizzaIdKey]) {
                    revenueByPizza[pizzaIdKey] = {
                        pizzaId: pizzaIdKey,
                        totalPrice: orderLine.unitprice * orderLine.quantity,
                        quantity: orderLine.quantity,
                        displayLabel: orderLine.productname.trim(),
                        onOrders: []
                    }
                    revenueByPizza[pizzaIdKey].onOrders.push(order);

                }
                else {
                    revenueByPizza[pizzaIdKey].quantity += orderLine.quantity;
                    revenueByPizza[pizzaIdKey].totalPrice += orderLine.unitprice * orderLine.quantity;
                    revenueByPizza[pizzaIdKey].displayLabel = orderLine.productname.trim();
                    revenueByPizza[pizzaIdKey].onOrders.push(order);
                }
            });


        });

        const revenues = Object.entries(revenueByPizza).map(([pizzaId, pizzaRevenue]) => ({
            pizzaId,
            order: pizzaRevenue.onOrders,
            label: pizzaRevenue.displayLabel,
            quantity: pizzaRevenue.quantity,
            Revenue: pizzaRevenue.totalPrice,
        }));

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

            let groupPerPizza = groupRevenuePerPizza(response);
            setGroupedPizzasPerPizza(groupPerPizza)

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
                    />

                    <FixedIntervalSelector onStartDateChange={setStartDate}
                        onEndDateChange={setEndDate} />

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

                <ShowLineChart dataToShow={data} />

                <ShowPieChart dataToShow={data} colors={colors} />

                <ShowBarChart dataToShow={data} colors={colors} handleBarClick={handleBarClick} />



                {/*   </div>

            <div className="chart-wrapper">     */}

                {selectedDate && (
                    <ShowPizzasForSelectedDate groupedPizzas={groupedPizzas} selectedDate={selectedDate} handlePizzaClick={handlePizzaClick} />
                )}



                {ordersIncludingSelectedPizza && (
                    <ShowOrdersIncludingSelectedPizza ordersIncludingSelectedPizza={ordersIncludingSelectedPizza} selectedPizzaName={selectedPizzaName} />
                )}

<br /><br />
                <ShowBarChartRevenuePerPizza dataToShow={groupedPizzasPerPizza} colors={colors} handleBarClick={handleBarClick} />

                <button onClick={() => setSelectedDate(null)}>Luk</button>
            </div>
        </>
    )
};

export default RevenuePerTimePeriod;
