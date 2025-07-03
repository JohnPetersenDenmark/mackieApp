import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { SaleLocation } from '../../types/SaleLocation';
import { AxiosClientGet, AxiosClientPost, AxiosClientDelete } from '../../types/AxiosClient';

import AdminPlaceCreateEdit from './AdminPlaceCreateEdit';
import config from '../../config';

const AdminPlaces: React.FC = () => {
  const [locations, setLocations] = useState<SaleLocation[]>([]);
  const [isCreateEditLocationModalOpen, setIsCreateEditLocationModalOpen] = useState(false);
  const [locationToEdit, setLocationToEdit] = useState<SaleLocation | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const fetchData = async () => {

      try {
        const locationsResponse: any = await AxiosClientGet('/Home/locationlist', true);

        setLocations(locationsResponse);
        setLoading(false);

      } catch (err) {
        setError('Failed to load locations');
        setLoading(false);
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();


  }, [isCreateEditLocationModalOpen, submitting]);

  const handleEdit = (location: SaleLocation) => {
    setLocationToEdit(location);
    setIsCreateEditLocationModalOpen(true);
  };

  const handleDelete = (location: SaleLocation) => {
    if (location) {
      const deleteLocation = async () => {
        try {
          setSubmitting(true);

          await AxiosClientDelete('/Admin/removelocation/' + location.id, true)


        } catch (error) {
          setError('Fejl');
          console.error(error);
        } finally {
          setSubmitting(false);
        }
      };
      deleteLocation();
    }
  };

  const handleNewLocation = () => {
    setLocationToEdit(null);
    setIsCreateEditLocationModalOpen(true);
  };

  const handleCloseCreateEditPlaceModal = () => {
    setIsCreateEditLocationModalOpen(false);
  };


  return (
    <div
      className="location-frame"
      style={{
        border: '1px solid grey',
        borderRadius: '5px',       
        fontSize: '20px',
        color: '#22191b',
        fontWeight: 200,

        margin: 'auto',
      }}
    >
      <AdminPlaceCreateEdit
        isOpen={isCreateEditLocationModalOpen}
        onClose={handleCloseCreateEditPlaceModal}
        locationToEdit={locationToEdit}
      />

       <div style={{ fontSize: '2rem',
      fontWeight: 600,
     color: '#22191b',
      margin: '20px',
      textAlign: 'center' as const,}}>Stadepladser</div>

      <div style={{ margin: 'auto', padding: '1rem' }}>
        {locations.map((location) => (
          <div key={location.id} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', border: '1px solid grey', borderRadius: '5px', background: '#ffffff', }}>
            <div style={{ flex: '1', padding: '0.5rem' }}>{location.id}</div>
            <div style={{ flex: '2', padding: '0.5rem' }}>{location.locationname}</div>
            <div style={{ flex: '3', padding: '0.5rem' }}>
              <img
                src="/images/edit-icon.png"
                alt="Edit"
                onClick={() => handleEdit(location)}
                style={{ cursor: 'pointer', width: '28px', height: '28px' }}
              />
            </div>

            <div style={{ flex: '4', padding: '0.5rem' }}>
              <img
                src="/images/delete-icon.png"
                alt="Delete"
                onClick={() => handleDelete(location)}
                style={{ cursor: 'pointer', width: '28px', height: '28px' }}
              />
            </div>

          </div>
        ))}
      </div>
      <style>
        {`
          @media (max-width: 768px) {    
          .location-frame {
                      background-color: #8d4a5b;
      }
    }
  `}
      </style>
      <div
        style={{
          border: '1px dashed #ccc',
          padding: '1rem',
          borderRadius: '8px',
          background: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        onClick={handleNewLocation}
      >
        <img
          src="/images/new-icon.png"
          alt="Ny"
          style={{ width: '28px', height: '28px' }}
        />
      </div>
    </div>
  );




}

export default AdminPlaces;
