
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { TruckLocation } from '../../types/TruckLocation';
import config from '../../config';

import AdminCalendarCreateEdit from "./AdminCalendarCreateEdit"

interface AdminCalendarProps {
  isOpen: boolean;
  onClose: () => void;
}

// test github

const AdminCalendar: React.FC = () => {
  const [truckLocations, setTruckLocations] = useState<TruckLocation[]>([]);
  const [isCreateEditCalendarModalOpen, setIsCreateEditCalendarModalOpen] = useState(false);
  const [truckLocationToEdit, setTruckLocationToEdit] = useState<TruckLocation | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  useEffect(() => {
    const url: string = config.API_BASE_URL + '/Home/truckcalendarlocationlist'

    axios.get<TruckLocation[]>(url)
      .then(response => {

        const sortedTruckcalendarlocations = response.data.sort((a, b) => {
          const timeDiffInMilliSeconds = parseDanishDateTime(a.startdatetime).getTime() - parseDanishDateTime(b.startdatetime).getTime();
          return timeDiffInMilliSeconds;
        });
        setTruckLocations(sortedTruckcalendarlocations);

        setTruckLocations(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load locations');
        setLoading(false);
        console.error(err);
      });

  }, [isCreateEditCalendarModalOpen, submitting]);

  function parseDanishDateTime(dateTimeStr: string): Date {
    // Split into date and time
    const [datePart, timePart] = dateTimeStr.split(' '); // "20-05-2025" and "14:30"
    const [day, month, year] = datePart.split('-').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);

    return new Date(year, month - 1, day, hours, minutes);
  }

  const handleEdit = (location: TruckLocation) => {
    setTruckLocationToEdit(location);
    setIsCreateEditCalendarModalOpen(true);
  };

  const handleDelete = (truckLocation: TruckLocation) => {
    if (truckLocation !== null) {
      const deleteTruckLocation = async () => {
        try {
          setSubmitting(true);
          const url = config.API_BASE_URL + '/Admin/removetrucklocation/' + truckLocation.id;
          await axios.delete(url);
        } catch (error) {
          setError('Fejl');
          console.error(error);
        } finally {
          setSubmitting(false);
        }
      };

      deleteTruckLocation();  // Call the inner async function
    }
  };

  const handleNewLocation = () => {
    setTruckLocationToEdit(null);
    setIsCreateEditCalendarModalOpen(true);
  };

  const handleCloseCreateEditPlaceModal = () => {
    setIsCreateEditCalendarModalOpen(false);
  };

  return (
    <div style={{ padding: '1rem', width: '100%', margin: 'auto' }}>
      <AdminCalendarCreateEdit
        isOpen={isCreateEditCalendarModalOpen}
        onClose={handleCloseCreateEditPlaceModal}
        truckLocationToEdit={truckLocationToEdit}
      />

      <div
        style={{
          border: '1px solid grey',
          padding: '1rem',
          borderRadius: '0.5rem',
          color: '#22191b',
          fontWeight: 200,
          width: '100%',
          boxSizing: 'border-box',

        }}
      >
        <div style={{ textAlign: 'center', fontSize: '2.25rem', margin: 'auto' }}>Kalender</div>




        {truckLocations.map((curLocation, index) => (
          <div
            key={index}
            className="calendar-card"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1rem',
              border: '1px solid grey',
              borderRadius: '5px',
              background: '#ffffff',
            }}
          >
            <div style={{ flex: '1', padding: '0.5rem' }}>{curLocation.locationname}</div>
            <div style={{ flex: '1', padding: '0.5rem' }}>{curLocation.startdatetime}</div>
            <div style={{ flex: '1', padding: '0.5rem' }}>{curLocation.enddatetime}</div>
            <div style={{ flex: '1', padding: '0.5rem' }}>
              <img src="/images/edit-icon.png" alt="Edit" onClick={() => handleEdit(curLocation)} style={{ cursor: 'pointer', width: '28px', height: '28px', marginRight: '0.5rem' }} />
              <img src="/images/delete-icon.png" alt="Delete" onClick={() => handleDelete(curLocation)} style={{ cursor: 'pointer', width: '28px', height: '28px' }} />
            </div>
          </div>
        ))}

        <style>
          {`
        @media (max-width: 768px) {
          .calendar-card div {
            flex: 1 1 100% !important;
          }
        }
      `}
        </style>

        {/* "New" location */}
        <div
      
          style={{
            border: '1px solid #ccc',
            padding: '1rem',
            borderRadius: '0.5rem',
            background: '#f9f9f9',
            flex: '1 1 250px',
            minWidth: '250px',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src="/images/new-icon.png"
            alt="New"
            onClick={handleNewLocation}
            style={{ cursor: 'pointer', width: '28px', height: '28px' }}
          />
        </div>

      </div>

      {/* Responsive CSS */}
      <style>{`
      @media (min-width: 1024px) {
        .calendar-card {
          flex: 1 1 100%;
        }
      }
    `}</style>
    </div>
  )

}


export default AdminCalendar;