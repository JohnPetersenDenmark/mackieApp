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

import CustomInputTruckLocation from "./CustomInputTruckLocation"; // adjust path as needed
import { AxiosClientGet, AxiosClientPost } from '../../types/AxiosClient';



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


  useEffect(() => {
    const fetchData = async () => {
      try {
        const locationsResponse: any = await AxiosClientGet('/Home/locationlist', true);

        setSaleLocations(locationsResponse);

      } catch (err) {
        console.error(err);
      } finally {

      }
    }
    fetchData();

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

    try {
      const response = await AxiosClientPost('/Admin/addorupdatetruckcalendarlocation', placeData, true);
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
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(141, 74, 91, 0.9)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '1rem',
        boxSizing: 'border-box',
        marginLeft: '0',
      }}
    >
      <div
        className="modal-content"
        style={{
          backgroundColor: '#c7a6ac',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          width: '100%',
          maxWidth: '500px',
          boxSizing: 'border-box',
        }}
      >
        <h2
          style={{
            backgroundColor: '#8d4a5b',
            padding: '1rem',
            color: 'white',
            borderRadius: '0.5rem',
            textAlign: 'center',
            marginBottom: '1rem',
          }}
        >
          Aftale
        </h2>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="startDateTimePicker" style={{ fontWeight: 'bold' }}>Start:</label><br />
          <DatePicker
            id="startDateTimePicker"
            selected={startDateTime}
            onChange={handleStartDateChange}
            showTimeSelect
            timeCaption="Tid"
            timeIntervals={60}
            dateFormat="dd-MM-yyyy HH:mm"
            timeFormat="HH:mm"
            locale={da}
            placeholderText="Vælg startdato og tid"
            customInput={<CustomInputTruckLocation />}
           /*  calendarClassName="large-datepicker"
            className="custom-datepicker-input" */
            withPortal
          />
          {/* Inline <style> to inject calendar styles */}
          <style>{`
    .custom-datepicker-input {
      width: 100%;
      font-size: 18px;
      padding: 12px;
      height: 50px;
      box-sizing: border-box;
    }

    .large-datepicker {
      transform: scale(1.3);
      transform-origin: top left;
      font-size: 18px;
    }

    .large-datepicker .react-datepicker__day {
      padding: 0.75rem;
    }

    /* Overlay background behind popup */
    .react-datepicker__portal {
      background-color: #8d4a5b;
      z-index: 9999;
    }

    .react-datepicker-popper {
      z-index: 10000;
    }

    @media (max-width: 600px) {
      .large-datepicker {
        transform: scale(1); 
        font-size: 16px;
        width: 95vw;
        max-width: 100vw;
      }

      .large-datepicker .react-datepicker__day {
        padding: 0.5rem;
      }

      .custom-datepicker-input {
        font-size: 16px;
        height: 46px;
      }
    }
  `}</style>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="endDateTimePicker" style={{ fontWeight: 'bold' }}>Slut:</label><br />
          <DatePicker
            id="endDateTimePicker"
            selected={endDateTime}
            onChange={handleEndDateChange}
            showTimeSelect
            timeCaption="Tid"
            timeIntervals={60}
            dateFormat="dd-MM-yyyy HH:mm"
            timeFormat="HH:mm"
            locale={da}
            placeholderText="Vælg slutdato og tid"
            minDate={startDateTime || undefined}
            maxDate={startDateTime || undefined}
            customInput={<CustomInputTruckLocation />}
           /*  calendarClassName="large-datepicker"
            className="custom-datepicker-input" */
            withPortal
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="selectSaleLocation" style={{ fontWeight: 'bold' }}>Vælg stadeplads:</label><br />
          <select
            id="selectSaleLocation"
            value={selectedSaleLocationId ?? ''}
            onChange={(e) => setSelectedSaleLocationId(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              borderRadius: '0.25rem',
              border: '1px solid #ccc',
            }}
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

        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between' }}>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || submitting}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: isFormValid && !submitting ? '#8d4a5b' : 'grey',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: isFormValid && !submitting ? 'pointer' : 'not-allowed',
            }}
          >
            Ok
          </button>
          <button
            onClick={onClose}
            disabled={submitting}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: !submitting ? '#8d4a5b' : 'grey',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: !submitting ? 'pointer' : 'not-allowed',
            }}
          >
            Annuler
          </button>
        </div>
      </div>

      {/* Responsive CSS */}
      <style>{`
      @media (min-width: 768px) {
        .modal-content {
          padding: 2rem;
        }
      }
    `}</style>
    </div>
  );

};


export default AdminCalendarCreateEdit