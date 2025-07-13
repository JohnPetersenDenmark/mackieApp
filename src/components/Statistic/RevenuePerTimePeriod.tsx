import React, { useEffect, useState } from 'react';
import { Order } from '../../types/Order';
import { parseDanishDateTime } from '../../types/MiscFunctions';
import { toZonedTime } from "date-fns-tz";
import { da } from "date-fns/locale";
import { parseISO, format, subDays, isAfter } from "date-fns";
import {
    LineChart, PieChart, Pie, Cell, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";


import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { AxiosClientGet, AxiosClientPost } from '../../types/AxiosClient';

const COLORS = [
    "#0088FE", // blue
    "#00C49F", // teal
    "#FFBB28", // yellow
    "#FF8042", // orange
    "#AA00FF", // purple
    "#FF4444", // red
    "#00BFFF", // light blue
];

interface RevenueTimePeriodModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// const Login: React.FC<LoginModalProps> = ({ isOpen,  onClose }) => {
// const RevenuePerTimePeriod: React.FC<RevenueTimePeriodModalProps> = ({ isOpen, onClose }) => {
const RevenuePerTimePeriod: React.FC = () => {


    const [data, setData] = useState<any[] | undefined>([]);

    useEffect(() => {
        //    if (!isOpen) return;

        const fetchData = async () => {
            try {
                const ordersResponse = await AxiosClientGet('/Home/orderlist', true);
                // const transformed = transformOrdersLast30Days(ordersResponse);

                const DANISH_TZ = "Europe/Copenhagen";
                const utcNow = new Date();
                const utcCutoffDate = subDays(utcNow, 7);
                const dkCutoff = toZonedTime(utcCutoffDate, DANISH_TZ);

                const transformed = groupRevenuePerDay(ordersResponse, dkCutoff)
                setData(transformed)
            } catch (err: any) {

            }
        }

        fetchData();
        // }, [isOpen]);
    }, []);


    function groupRevenuePerDay(orders: Order[], cutoffDate: Date) {


        const revenueByDay: Record<string, number> = {};

        orders.forEach(order => {
            const date = toZonedTime(new Date(order.createddatetime), "Europe/Copenhagen");
            if (!date || !isAfter(date, cutoffDate)) return;

            const dayLabel = format(date, "d. MMM", { locale: da });

            if (!revenueByDay[dayLabel]) {
                revenueByDay[dayLabel] = 0;
            }

            revenueByDay[dayLabel] += order.totalPrice;
        });

        // Convert to array for recharts
        return Object.entries(revenueByDay).map(([orderDate, Revenue]) => ({
            orderDate,
            Revenue,
        }));
    }




    const handleSubmit = async () => {
        const userData = {

        };
        try {

            const response = await AxiosClientPost('/Login/login', userData, false);
            localStorage.setItem('authToken', JSON.stringify(response));

            //  onLoggedIn(true);
            //     onClose();
        } catch (error) {

            console.error(error);
        } finally {

        }
    };

    // if (!isOpen) return null;

    return (
        <>
            <ResponsiveContainer style= {{marginLeft: '700px' }} width="50%" height={400}>
                <LineChart 
                data={data} 
                margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="orderDate" />
                     
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Revenue" stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>

            <ResponsiveContainer style= {{marginTop: '200px' }} width="100%" height={400}>
                <PieChart  margin={{ top: 40, right: 20, bottom: 20, left: 20 }}>
                    <Pie
                        data={data}
                        dataKey="Revenue"   // numeric field
                        nameKey="orderDate"    // label field
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        fill="#8884d8"
                        label
                    >
                        {data ? data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        )) : ''}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>

        </>
    )
};

export default RevenuePerTimePeriod;
