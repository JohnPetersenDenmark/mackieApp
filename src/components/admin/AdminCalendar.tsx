
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { TruckLocation } from '../../types/TruckLocation';
import config from '../../config';

import AdminCalendarCreateEdit from "./AdminCalendarCreateEdit"

interface AdminCalendarProps {
    isOpen: boolean;
    onClose: () => void;
}


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
  <div style={{ padding: '1rem', width: '100%' }}>
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
      <div style={{ textAlign: 'center', fontSize: '2.25rem', marginBottom: '1rem' }}>Kalender</div>

      <div style={{ marginBottom: '1rem' }}></div>

      {/* Flex container */}
      <div
        className="calendar-list"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {truckLocations.map((curLocation, index) => (
          <div
            key={index}
            className="calendar-card"
            style={{
              border: '1px solid #ccc',
              padding: '1rem',
              borderRadius: '0.5rem',
              background: '#f9f9f9',
              flex: '1 1 250px',
              minWidth: '250px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div>{curLocation.startdatetime}</div>
            <div>{curLocation.locationname}</div>
            <div>{curLocation.startdatetime}</div>
            <div>{curLocation.enddatetime}</div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <img
                src="/images/edit-icon.png"
                alt="Edit"
                onClick={() => handleEdit(curLocation)}
                style={{ cursor: 'pointer', width: '28px', height: '28px' }}
              />
              <img
                src="/images/delete-icon.png"
                alt="Delete"
                onClick={() => handleDelete(curLocation)}
                style={{ cursor: 'pointer', width: '28px', height: '28px' }}
              />
            </div>
          </div>
        ))}

        {/* "New" location */}
        <div
          className="calendar-card"
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