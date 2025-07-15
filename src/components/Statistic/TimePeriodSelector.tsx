// TimePeriodSelector.tsx

import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { da } from "date-fns/locale";
import CustomInput from "../admin/CustomInput"; // Adjust path as needed
import { addDays } from 'date-fns';
import './TimePeriodSelector.css';

interface TimePeriodSelectorProps {
    startDate: Date | null;
    endDate: Date | null;
    onStartDateChange: (date: Date | null) => void;
    onEndDateChange: (date: Date | null) => void;
    onSubmit: () => void;
    submitting: boolean;
}

const TimePeriodSelector: React.FC<TimePeriodSelectorProps> = ({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    onSubmit,
    submitting,
}) => {
    const isFormValid = !!startDate && !!endDate && endDate >= startDate;

    const isMobile = window.innerWidth < 600;

    const handleStartDateChange = (StartDate: Date | null) => {

        if (StartDate ? StartDate >= new Date : null) {
            alert("Startdatoen kan senest være dags dato");
            return;
        }

        if (StartDate && endDate && endDate <= StartDate) {
            const adjustedEndDate = new Date(StartDate.getTime() + 86400000); // +1 day
            onEndDateChange(adjustedEndDate);
        }
        onStartDateChange(StartDate);
    };

    const handleEndDateChange = (endDate: Date | null) => {
        /* if (startDate && endDate && endDate <= startDate) {
            alert("Slutdato skal være efter startdato!");
            return;
        } */

        if (endDate ? endDate > new Date : null) {
            alert("Slutdatoen kan senest være dags dato");
            return;
        }
        onEndDateChange(endDate);
    };

    return (
        <div>
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="startDatePicker" style={{ fontWeight: 'bold' }}>Start:</label><br />
                <DatePicker
                    id="startDatePicker"
                    selected={startDate}
                    onChange={handleStartDateChange}
                    dateFormat="dd-MM-yyyy"
                    locale={da}
                    placeholderText="Vælg startdato"
                     popperPlacement={isMobile ? "top" : "bottom-start"}
                    customInput={<CustomInput />}
                    // className="custom-datepicker-input"         // input field styling
                    calendarClassName="large-datepicker"        // calendar popup styling
                />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="endDatePicker" style={{ fontWeight: 'bold' }}>Slut:</label><br />
                <DatePicker
                    id="endDatePicker"
                    selected={endDate}
                    onChange={handleEndDateChange}
                    dateFormat="dd-MM-yyyy"
                    locale={da}
                    placeholderText="Vælg slutdato"
                    minDate={startDate || undefined}
                    popperPlacement={isMobile ? "top" : "bottom-start"}
                    customInput={<CustomInput />}
                    // className="custom-datepicker-input"         // input field styling
                    calendarClassName="large-datepicker"        // calendar popup styling
                />
            </div>

            <button
                onClick={onSubmit}
                disabled={!isFormValid || submitting}
                style={{
                    padding: '0.75rem',
                    backgroundColor: isFormValid && !submitting ? '#8d4a5b' : 'grey',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: isFormValid && !submitting ? 'pointer' : 'not-allowed',
                }}
            >
                OK
            </button>
        </div>
    );
};

export default TimePeriodSelector;
