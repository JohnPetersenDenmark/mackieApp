// TimePeriodSelector.tsx



import { format } from "date-fns";

import { da } from "date-fns/locale";

import './charts.css';

import {
    LineChart, PieChart, Pie, BarChart, Bar, Cell, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { scaleLinear } from "d3-scale";
import { interpolateHsl } from "d3-interpolate";

interface ShowPieChartProps {
    dataToShow: any;
    colors : string[]
}

const ShowPieChart: React.FC<ShowPieChartProps> = ({ dataToShow , colors }) => {

    return (
        <ResponsiveContainer style={{ marginTop: '0px', marginLeft: '0px' }} width="100%" height={600}>
            <PieChart margin={{ top: 40, right: 20, bottom: 20, left: 20 }}>
                <Pie
                    data={dataToShow}
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
                    {dataToShow ? dataToShow.map((entry : any, index : any) => (
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

    );
};

export default ShowPieChart;
