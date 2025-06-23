import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TruckLocation } from '../../types/TruckLocation';
import { SaleLocation } from '../../types/SaleLocation';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import { parse } from "date-fns";
import config from '../../config';
import CustomInput from "./CustomInput"; // adjust path as needed



interface TruckLocationModalProps {
    isOpen: boolean;
    truckLocationToEdit: TruckLocation | null;
    onClose: () => void;
}

const AdminCalendarCreateEdit: React.FC<TruckLocationModalProps> = ({ isOpen, onClose, truckLocationToEdit }) => {

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [startDateTime, setSelectedStartDate] = useState<Date | null>(null);

    const [saleLocations, setSaleLocations] = useState<SaleLocation[]>([]);

    const [selectedSaleLocationId, setSelectedSaleLocationId] = useState<number | null>(null);

    const [endDateTime, setSelectedEndDate] = useState<Date | null>(null);

    // const [placeName, setPlaceName] = useState<string>('');
    //const [placeNameTouched, setPlaceNameTouched] = useState(false);

    //const isPlaceNameValid = placeName.length > 0;
    const isStartDateTimeValid = startDateTime ? true : false;
    const isEndDateTimeValid = endDateTime ? true : false;
    const isSaleLocationIdValid = selectedSaleLocationId ? true : false;


    const isFormValid = isStartDateTimeValid && isEndDateTimeValid && isSaleLocationIdValid



    /* useEffect(() => {
        if (!isOpen) return;

        

        axios.get<SaleLocation[]>(url)
            .then(response => {
                setSaleLocations(response.data);
                //  setLoading(false);
            })
            .catch(err => {
                //  setError('Failed to load locations');
                // setLoading(false);
                console.error(err);
            });

        if (truckLocationToEdit !== null) {
            setSelectedSaleLocationId(truckLocationToEdit.locationid);

          

            const parsedStartDateTime = parse(truckLocationToEdit.startdatetime, "dd-MM-yyyy HH:mm", new Date(), { locale: da });
            setSelectedStartDate(parsedStartDateTime);
            const parsedEndDateTime = parse(truckLocationToEdit.enddatetime, "dd-MM-yyyy HH:mm", new Date(), { locale: da });
            setSelectedEndDate(parsedEndDateTime)

        }
        else {
            setSelectedSaleLocationId(null);
            setSelectedStartDate(null);
            setSelectedEndDate(null)
        }



    }, [isOpen, selectedSaleLocationId]); */

    useEffect(() => {
        const url = config.API_BASE_URL + '/Home/locationlist';
        axios
            .get<SaleLocation[]>(url)
            .then(response => {
                setSaleLocations(response.data);
                /* if (truckLocationToEdit && saleLocations.length > 0) {
                    setSelectedSaleLocationId(truckLocationToEdit.locationid);
                } */
            })
            .catch(err => {
                console.error(err);
            });
    }, []); // Only fetch once on mount

    // 2️⃣ Set selected sale location after data is loaded:
    useEffect(() => {
        if (truckLocationToEdit && saleLocations.length > 0) {
            setSelectedSaleLocationId(truckLocationToEdit.locationid);

            const parsedStartDateTime = parse(
                truckLocationToEdit.startdatetime,
                "dd-MM-yyyy HH:mm",
                new Date(),
                { locale: da }
            );
            setSelectedStartDate(parsedStartDateTime);

            const parsedEndDateTime = parse(
                truckLocationToEdit.enddatetime,
                "dd-MM-yyyy HH:mm",
                new Date(),
                { locale: da }
            );
            setSelectedEndDate(parsedEndDateTime);
        } else {
            setSelectedSaleLocationId(null);
            setSelectedStartDate(null);
            setSelectedEndDate(null);
        }
    }, [truckLocationToEdit, saleLocations]); // Wait until both are ready



    const handleStartDateChange = (date: any) => {


        if (date && endDateTime && endDateTime <= date) {
            const adjustedEndTime = new Date(date.getTime() + 60 * 60 * 1000);
            setSelectedEndDate(adjustedEndTime);
        }
        setSelectedStartDate(date);

    };

    const handleEndDateChange = (date: any) => {
        if (startDateTime && date && date <= startDateTime) {
            alert("Sluttidspunktet skal være efter starttidspunktet!");
            return;
        }
        setSelectedEndDate(date);
    };


    const handleSubmit = async () => {

        const formattedStartDateTime = startDateTime
            ? format(startDateTime, "dd-MM-yyyy HH:mm", { locale: da })
            : ""; // or some fallback string

        const formattedEndDateTime = endDateTime
            ? format(endDateTime, "dd-MM-yyyy HH:mm", { locale: da })
            : ""; // or some fallback string

        const placeData = {
            id: truckLocationToEdit !== null ? truckLocationToEdit.id : 0,
            locationid: selectedSaleLocationId,
            locationname: "hhh",
            startdatetime: formattedStartDateTime,
            enddatetime: formattedEndDateTime

        }


        const url = config.API_BASE_URL + '/Admin/addorupdatetruckcalendarlocation'
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
                <h2 style={{ backgroundColor: '#8d4a5b', padding: '2rem', color: 'white', borderRadius: '8px' }} >Aftale</h2>


                <div>
                    <label htmlFor="startDateTimePicker"><strong>Start:</strong></label><br />
                    <DatePicker
                        id='startDateTimePicker'
                        selected={startDateTime}
                        onChange={handleStartDateChange}
                        showTimeSelect
                        timeCaption="Tid"
                        timeIntervals={60}
                        dateFormat="dd-MM-yyyy HH:mm"
                        timeFormat="HH:mm"
                        locale={da}
                        placeholderText="Vælg startdato og tid"
                        customInput={<CustomInput />}
                    />
                </div>
                <div>
                    <label htmlFor="endDateTimePicker"><strong>Slut:</strong></label><br />
                    <DatePicker
                        id='endDateTimePicker'
                        selected={endDateTime}
                        onChange={handleEndDateChange}
                        timeCaption="Tid"
                        showTimeSelect
                        timeIntervals={60}
                        dateFormat="dd-MM-yyyy HH:mm"
                        timeFormat="HH:mm"
                        locale={da}
                        placeholderText="Vælg slutdato og tid"
                        // Restrict end date to the same day as start
                        minDate={startDateTime ? startDateTime : undefined}
                        maxDate={startDateTime ? startDateTime : undefined}
                        // Restrict time to after start time on same day
                     /*    minTime={
                            startDateTime
                                ? startDateTime
                                : undefined
                        }
                        maxTime={startDateTime ? new Date(startDateTime.setHours(23, 59, 59, 999)) : undefined} */
                        customInput={<CustomInput />}
                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="selectSaleLocation"><strong>Vælg stadeplads:</strong></label><br />
                    <div style={{ height: 20 }}>
                        <select
                            style={{
                                width: '100%',          // Make it fill the container
                                height: '40px',         // Increase the height
                                fontSize: '16px',       // Make text bigger
                                padding: '0.5rem',      // Add some padding
                                borderRadius: '4px'     // Optional: rounded corners
                            }}
                            id='selectSaleLocation'
                            value={selectedSaleLocationId ?? ""}
                            onChange={(e) => setSelectedSaleLocationId(Number(e.target.value))}
                        >
                            <option value="" disabled>
                                Vælg en lokation
                            </option>
                            {saleLocations.map((saleLocation) => (
                                <option key={saleLocation.id} value={saleLocation.id}>
                                    {saleLocation.locationname}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!isFormValid}
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