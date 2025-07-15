import React, { useEffect, useState } from 'react';
import { Order } from '../../types/Order';
import { toZonedTime } from "date-fns-tz";
import { da } from "date-fns/locale";
import { parseISO, format, subDays, isAfter } from "date-fns";

import TimePeriodSelector from "./TimePeriodSelector"

import ClipLoader from 'react-spinners/ClipLoader';
import {
    LineChart, PieChart, Pie, BarChart, Bar, Cell, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { scaleLinear } from "d3-scale";
import { interpolateHsl } from "d3-interpolate";
import './charts.css';

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



    /* function groupRevenuePerDay(orders: Order[]) {

        interface OrderRevenue {
            totalPrice: number,
            totalPriceStringForLabel: string,
        }

        const revenueByDay: Record<string, OrderRevenue> = {};

        orders.forEach(order => {
            const date = toZonedTime(new Date(order.createddatetime), "Europe/Copenhagen");
            //if (!date || !isAfter(date, cutoffDate)) return;

            const dayLabel = format(date, "d. MMM", { locale: da });

            if (!revenueByDay[dayLabel]) {
                let tmpOrderRevenue: OrderRevenue = {
                    totalPrice: 0,
                    totalPriceStringForLabel: ''
                }
                revenueByDay[dayLabel] = tmpOrderRevenue;
            }

            revenueByDay[dayLabel].totalPrice += order.totalPrice;
            revenueByDay[dayLabel].totalPriceStringForLabel += order.totalPrice.toFixed(2).replaceAll('.', ',');
        });

        // Convert to array for recharts
        let revenues = Object.entries(revenueByDay).map(([orderDate, revenue]) => ({
            orderDate,
            Revenue: revenue.totalPrice,
            totalPriceStringForLabel: revenue.totalPriceStringForLabel,
        }));

        const sortedOrders = revenues.sort(
            (a, b) =>
                new Date(a.orderDate).getTime() -
                new Date(b.orderDate).getTime()
        );

        return sortedOrders;
    } */

    function groupRevenuePerDay(orders: Order[]) {
        interface OrderRevenue {
            totalPrice: number;
            displayLabel: string;
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
                };
            }

            // 🔁 Loop over orderLines to calculate revenue
            order.orderlines.forEach(orderLine => {
                const lineTotal = orderLine.unitprice * orderLine.quantity;
                revenueByDay[dateKey].totalPrice += lineTotal;
            });
        });

        const revenues = Object.entries(revenueByDay).map(([orderDate, revenue]) => ({
            orderDate,
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

    const handleBarClick = (data: any, orders: Order[], setSelectedDate: (date: string | null) => void, setSelectedOrders: (orders: Order[]) => void) => {
        //  const isoDate = data?.activePayload?.[0]?.payload?.orderDate;

        const isoDate = data?.payload?.orderDate;

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

    const handleSubmit = async () => {
        const dateRange = {
            startdate: startDate ? format(startDate, 'dd-MM-yyyy') : '',
            enddate: endDate ? format(endDate, 'dd-MM-yyyy') : ''
        };
        try {

            const response = await AxiosClientPost('/Home/orderlistbydateinterval', dateRange, true);
            setOrders(response)
            let groupedOrders = groupRevenuePerDay(response);
            setData(groupedOrders);
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
                </div> <div style={{ marginTop: '50px' }}>
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
                            onClick={(data) => handleBarClick(data, orders, setSelectedDate, setSelectedOrders)}
                        >
                            {data?.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Bar>

                    </BarChart>
                </ResponsiveContainer>
                {selectedDate && (
                    <div style={{ marginTop: '2rem' }}>
                        <h3>Detaljer for {format(new Date(selectedDate), "EEE d. MMM", { locale: da })}</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Pizza</th>
                                    <th>Antal</th>
                                    <th>Pris</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groupedPizzas ?groupedPizzas.map(pizza => (
                                    <tr key={pizza.name}>
                                        <td>{pizza.name}</td>
                                        <td>{pizza.quantity}</td>
                                        <td>{pizza.unitprice.toFixed(2).replace('.', ',')} kr.</td>
                                        <td>{pizza.total.toFixed(2).replace('.', ',')} kr.</td>
                                    </tr>
                                )) : ''}
                            </tbody>
                        </table>
                        <button onClick={() => setSelectedDate(null)}>Luk</button>
                    </div>
                )}
            </div>
        </>
    )
};

export default RevenuePerTimePeriod;
