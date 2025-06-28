import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { SaleLocation } from '../../types/SaleLocation';

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
    const url = config.API_BASE_URL + '/Home/locationlist';

    axios
      .get<SaleLocation[]>(url)
      .then((response) => {
        setLocations(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load locations');
        setLoading(false);
        console.error(err);
      });
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
          const url = config.API_BASE_URL + '/Admin/removelocation/' + location.id;
          await axios.delete(url);
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
    setIsCreateEditLocationModalOpen(true);
  };

  const handleCloseCreateEditPlaceModal = () => {
    setIsCreateEditLocationModalOpen(false);
  };

  return (
    <div
      style={{
        padding: '10px',
        width: '100%',
        boxSizing: 'border-box',
        background: 'cornsilk',
        minHeight: '100vh'
      }}
    >
      <AdminPlaceCreateEdit
        isOpen={isCreateEditLocationModalOpen}
        onClose={handleCloseCreateEditPlaceModal}
        locationToEdit={locationToEdit}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
          padding: '1rem',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            fontSize: '2rem',
            color: '#8d4a5b',
            fontWeight: 700,
            marginBottom: '1rem',
          }}
        >
          Stadepladser
        </div>

        {locations.map((location) => (
          <div
            key={location.id}
            style={{
              border: '1px solid #ccc',
              padding: '1rem',
              borderRadius: '8px',
              background: '#f9f9f9',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '0.5rem',
            }}
          >
            <div>Stade id.: {location.id}</div>
            <div>{location.locationname}</div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <img
                src="/images/edit-icon.png"
                alt="Edit"
                onClick={() => handleEdit(location)}
                style={{ cursor: 'pointer', width: '28px', height: '28px' }}
              />
              <img
                src="/images/delete-icon.png"
                alt="Delete"
                onClick={() => handleDelete(location)}
                style={{ cursor: 'pointer', width: '28px', height: '28px' }}
              />
            </div>
          </div>
        ))}

        {/* New location box */}
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

      {/* Inline responsive CSS */}
      <style>{`
        @media (max-width: 600px) {
          div[style*='grid'] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminPlaces;
