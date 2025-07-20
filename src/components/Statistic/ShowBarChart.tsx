import { format } from "date-fns";

import { da } from "date-fns/locale";
import './charts.css';

import {
    LineChart, PieChart, Pie, BarChart, Bar, Cell, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";


interface ShowBarChartProps {
    dataToShow: any;
    colors: string[];
     handleBarClick: (chartData: any ) => void;
}

const ShowBarChart: React.FC<ShowBarChartProps> = ({ dataToShow, colors , handleBarClick}) => {

    return (
        <ResponsiveContainer style={{ marginTop: '0px', marginLeft: '0px' }} width="100%" height={500}>
            <BarChart
                data={dataToShow}
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
                    {dataToShow?.map((entry: any, index: any) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                </Bar>

            </BarChart>
        </ResponsiveContainer>

    );
};

export default ShowBarChart;
