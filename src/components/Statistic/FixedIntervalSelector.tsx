// TimePeriodSelector.tsx

import React, { useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { endOfMonth, endOfYear, startOfMonth, startOfYear } from 'date-fns';
import { formatInTimeZone } from "date-fns-tz";

/* import './TimePeriodSelector.css';
import './QuarterSelector.css'
 */
interface TimePeriodSelectorProps {
    onStartDateChange: (date: Date | null) => void;
    onEndDateChange: (date: Date | null) => void;
}

const FixedIntervalSelector: React.FC<TimePeriodSelectorProps> = ({ onStartDateChange, onEndDateChange }) => {

    const [selectedInterval, setSelectedInterval] = useState(new Date().getFullYear().toString());


    //  const isMobile = window.innerWidth < 600;

    /*  const selectableIntervals: string[] = [];
 
     selectableIntervals[0] = 'Dette måned';
     selectableIntervals[1] = 'Løbende måned';
 
     selectableIntervals[2] = 'Dette år';
     selectableIntervals[3] = 'Løbende år'; */

    /*  const setYears = () => {
         for (var i = 0; i < 5; i++) {
             let currentYear = new Date().getFullYear() - i;
             selectableIntervals.push(currentYear.toString())
         }
     }; */



    const handleIntervalChange = (interval: string) => {

        /*  let startDateStr = startDates[Number(quarter)] + "-" + year;
         let endDateStr = endDates[Number(quarter)] + "-" + year;
 
         let startDateDate = parse(startDateStr, "dd-MM-yyyy", new Date());
         let endDateDate = parse(endDateStr, "dd-MM-yyyy", new Date());
 
         onStartDateChange(startDateDate);
         onEndDateChange(endDateDate); */

        if (interval === '0') {

            const today = new Date();

            // skip the time part
            const localDateOnlyToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

            const firstDayInThisMonth = startOfMonth(localDateOnlyToday);
            const lastDayInThisMonth = endOfMonth(localDateOnlyToday);

            onStartDateChange(firstDayInThisMonth)
            onEndDateChange (lastDayInThisMonth)
        }

        if (interval === '1') {

            const today = new Date();

            // skip the time part
            const localDateOnlyToday = new Date(today.getFullYear(), today.getMonth() , today.getDate());

            const sameDateLastMonth = new Date(today.getFullYear(), today.getMonth() -1, today.getDate());;

            onStartDateChange(sameDateLastMonth)
            onEndDateChange (localDateOnlyToday)
        }

          if (interval === '2') {

            const today = new Date();

            // skip the time part
            const localDateOnlyToday = new Date(today.getFullYear(), today.getMonth() , today.getDate());

               const firstDayThisYear = startOfYear(localDateOnlyToday);
                const lastDayThisYear = endOfYear(localDateOnlyToday);

            const sameDateLastMonth = new Date(today.getFullYear(), today.getMonth() -1, today.getDate());;

            onStartDateChange(firstDayThisYear)
            onEndDateChange (lastDayThisYear)
        }

          if (interval === '3') {

            const today = new Date();

            // skip the time part
            const localDateOnlyToday = new Date(today.getFullYear(), today.getMonth() , today.getDate());

             

            const sameDateOneYearBack = new Date(today.getFullYear() -1, today.getMonth() , today.getDate());;

            onStartDateChange(sameDateOneYearBack)
            onEndDateChange (localDateOnlyToday)
        }

        setSelectedInterval(interval)
    };

    const calculateEnddateInCurrentMonth = (interval: string) => {
        let today = new Date;

    };


    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>

                <div className="select-wrapper">
                    <select value={selectedInterval} onChange={(e) => handleIntervalChange(e.target.value)}
                        style={{ color: '#8d4a5b', backgroundColor: '#ffffff' }}
                    >
                        <option value="0">Dette måned</option>
                        <option value="1">Løbende måned</option>
                        <option value="2">Dette år</option>
                        <option value="3">Løbende år</option>
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

export default FixedIntervalSelector;
