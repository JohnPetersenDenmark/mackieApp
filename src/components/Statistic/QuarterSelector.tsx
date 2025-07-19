// TimePeriodSelector.tsx

import React, {  useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { parse } from 'date-fns';
import './TimePeriodSelector.css';
import './QuarterSelector.css'

interface TimePeriodSelectorProps {
    onStartDateChange: (date: Date | null) => void;
    onEndDateChange: (date: Date | null) => void;
}

const QuarterSelector: React.FC<TimePeriodSelectorProps> = ({ onStartDateChange, onEndDateChange }) => {

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [quarter, setQuarter] = useState<string>("0");

  //  const isMobile = window.innerWidth < 600;

    const selectableYears: string[] = [];

    const setYears = () => {
        for (var i = 0; i < 5; i++) {
            let currentYear = new Date().getFullYear() - i;
            selectableYears.push(currentYear.toString())
        }
    };

    setYears();

    const startDates: string[] = [
        '01-01',
        '01-04',
        '01-07',
        '01-10',
    ]

    const endDates = [
        '31-03',
        '30-06',
        '30-09',
        '31-12',
    ]

    const handleYearChange = (year: string) => {

        let startDateStr = startDates[Number(quarter)] + "-" + year;
        let endDateStr = endDates[Number(quarter)] + "-" + year;

        let startDateDate = parse(startDateStr, "dd-MM-yyyy", new Date());
        let endDateDate = parse(endDateStr, "dd-MM-yyyy", new Date());

        onStartDateChange(startDateDate);
        onEndDateChange(endDateDate);

        setSelectedYear(year)
    };

    const handleQuarterChange = (selectedQuarter: string) => {
        let startDateStr = startDates[Number(selectedQuarter)] + "-" + selectedYear;
        let endDateStr = endDates[Number(selectedQuarter)] + "-" + selectedYear;

        let startDateDate = parse(startDateStr, "dd-MM-yyyy", new Date());
        let endDateDate = parse(endDateStr, "dd-MM-yyyy", new Date());

        onStartDateChange(startDateDate);
        onEndDateChange(endDateDate);

        setQuarter(selectedQuarter)
    };

    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>

                <div className="select-wrapper">
                    <select value={selectedYear} onChange={(e) => handleYearChange(e.target.value)}
                    style={{ color : '#8d4a5b' , backgroundColor : '#ffffff'}}
                    >
                        {selectableYears.map((tmpYear) => (
                            <option value={tmpYear}>{tmpYear}</option>
                        ))};
                    </select>
                    <svg
                        className="select-icon"
                        viewBox="0 0 32 32"
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="16" cy="16" r="14" />
                        <path d="M10 14l6 6 6-6" />
                    </svg>
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>

                <div className="select-wrapper">
                    <select value={quarter} onChange={(e) => handleQuarterChange(e.target.value)}
                         style={{ color : '#8d4a5b' , backgroundColor : '#ffffff'}}
                        >
                        <option value="0">Q1</option>
                        <option value="1">Q2</option>
                        <option value="2">Q3</option>
                        <option value="3">Q4</option>
                    </select>
                    <svg
                        className="select-icon"
                        viewBox="0 0 32 32"
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="16" cy="16" r="14" />
                        <path d="M10 14l6 6 6-6" />
                    </svg>
                </div>
            </div>
        </>
    );
};

export default QuarterSelector;
