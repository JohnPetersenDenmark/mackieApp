import { format } from "date-fns";

import { da } from "date-fns/locale";
import './charts.css';

import {
    LineChart, PieChart, Pie, BarChart, Bar, Cell, Line, XAxis, YAxis, CartesianGrid, Tooltip, TooltipProps, Legend, ResponsiveContainer
} from "recharts";




interface ShowBarChartProps {
    dataToShow: any;
    colors: string[];
    handleBarClick: (chartData: any) => void;
}

const ShowBarChartRevenuePerPizza: React.FC<ShowBarChartProps> = ({ dataToShow, colors, handleBarClick }) => {

    const CustomTooltip = ({ active, payload, label }: any) => {
         

        if (active && payload && payload.length > 0) {

            let value = payload[0].value;
            value = value.toFixed(2).replace('.', ',') + ' kr. '
            const quantity = payload[0].payload.quantity;

            return (<div>
                Omsætning:  {value}
                Antal: {quantity}
            </div>);
        }

        return (<></>);
    };


    return (
        <ResponsiveContainer style={{ marginTop: '0px', marginLeft: '0px' }} width="100%" height={500}>
            <BarChart
                data={dataToShow}
                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="label"
                    angle={-30}
                    tick={{ fontSize: 18 }} // X-axis label size
                    textAnchor="end"

                />

                <YAxis
                    tick={{ fontSize: 18 }} // X-axis label size
                    tickFormatter={(value: number) =>
                        value.toFixed(2).replace('.', ',')
                    }
                />

                <Tooltip content={<CustomTooltip />}/>

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

export default ShowBarChartRevenuePerPizza;
