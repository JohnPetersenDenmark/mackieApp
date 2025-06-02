import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TruckLocation } from '../../types/TruckLocation';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import CustomInput from "./CustomInput"; // adjust path as needed



interface TruckLocationModalProps {
    isOpen: boolean;
    truckLocationToEdit: TruckLocation | null;
    onClose: () => void;
}

const AdminCalendarCreateEdit: React.FC<TruckLocationModalProps> = ({ isOpen, onClose, truckLocationToEdit }) => {

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const [placeName, setPlaceName] = useState<string>('');
    const [placeNameTouched, setPlaceNameTouched] = useState(false);

    const isPlaceNameValid = placeName.length > 0;
    const isDateValid = selectedDate ? true : false;

    const isFormValid = isPlaceNameValid && isDateValid



    const handleDateChange = (date: any) => {
        setSelectedDate(date);

    };

    useEffect(() => {
        if (!isOpen) return;

        if (truckLocationToEdit !== null) {
            setPlaceName(truckLocationToEdit.locationname);
        }
        else {
            setPlaceName('');
        }

        setPlaceNameTouched(false);


        setSubmitting(false);

    }, [isOpen]);

    const handleSubmit = async () => {

        const formattedDate = selectedDate
            ? format(selectedDate, "dd-MM-yyyy HH:mm", { locale: da })
            : ""; // or some fallback string

        const placeData = {
            id: truckLocationToEdit !== null ? truckLocationToEdit.id : 0,
            locationname: placeName.trim(),
        }

        const webApiBaseUrl = process.env.REACT_APP__BASE_API_URL;
        const url = webApiBaseUrl + '/Admin/atelocation'
        try {
            const response = await axios.post(url, placeData);
            onClose();
        } catch (error) {
            setSubmitError('Fejl');
            console.error(error);
        } finally {
            setSubmitting(false);
        }

    };


    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: '#8d4a5b',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
            }}
        >

            <div style={{ backgroundColor: '#c7a6ac', padding: '2rem', borderRadius: '8px', minWidth: '500px' }}>
                <h2 style={{ backgroundColor: '#8d4a5b', padding: '2rem', color: 'white', borderRadius: '8px' }} >Ny aftale</h2>


                <div>
                    <label htmlFor="date-picker">Select a date:</label>
                    <DatePicker
                        id="date-picker"
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="dd-MM-yyyy"
                        placeholderText="MM-DD-YYYY"
                        locale={da}
                        showPopperArrow={true}
                        customInput={<CustomInput />}
                        
                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="email"><strong>Stadeplads:</strong></label><br />
                    <input
                        id="placename"
                        type="text"
                        value={placeName}
                        onChange={(e) => setPlaceName(e.target.value)}
                        onBlur={() => setPlaceNameTouched(true)}
                        placeholder="Indtast pladsnavn"
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            marginTop: '0.25rem',
                            borderColor: !isPlaceNameValid && placeNameTouched ? 'red' : undefined,
                            borderWidth: '1.5px',
                            borderStyle: 'solid',
                            borderRadius: '4px',
                        }}
                        disabled={submitting}
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!isFormValid || submitting}
                    style={{
                        marginTop: '1rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: isFormValid && !submitting ? '#8d4a5b' : 'grey',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isFormValid && !submitting ? 'pointer' : 'not-allowed',
                        marginRight: '0.5rem',
                    }}
                > Ok</button>


                <button
                    onClick={onClose}
                    disabled={submitting}
                    style={{
                        marginTop: '1rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: !submitting ? '#8d4a5b' : 'grey',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: !submitting ? 'pointer' : 'not-allowed',
                        marginRight: '0.5rem',
                    }}
                > Annuler</button>

            </div>
        </div>
    )
};


export default AdminCalendarCreateEdit