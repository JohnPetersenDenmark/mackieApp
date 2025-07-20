// TimePeriodSelector.tsx



import { format } from "date-fns";

import { da } from "date-fns/locale";

import './charts.css';

import {
    LineChart, PieChart, Pie, BarChart, Bar, Cell, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { scaleLinear } from "d3-scale";
import { interpolateHsl } from "d3-interpolate";

interface ShowLineChartProps {
    dataToShow: any;
}

const ShowLineChart: React.FC<ShowLineChartProps> = ({ dataToShow }) => {

    return (        
        
              <ResponsiveContainer style={{ marginTop: '0px', marginLeft: '0px' }} width="100%" height={600}>
        <LineChart
            data={dataToShow}
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
    );
};

export default ShowLineChart;
