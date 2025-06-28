import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import { useNavigate } from 'react-router-dom';
import { SaleLocation } from '../../types/SaleLocation';
import config from '../../config';

interface LocationModalProps {
    isOpen: boolean;
    locationToEdit: SaleLocation | null;
    onClose: () => void;
}

const AdminPlaceCreateEdit: React.FC<LocationModalProps> = ({ isOpen, onClose, locationToEdit }) => {

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const [placeName, setPlaceName] = useState<string>('');
    const [placeNameTouched, setPlaceNameTouched] = useState(false);

    const isPlaceNameValid = placeName.length > 0;
    const isFormValid = isPlaceNameValid

    //const navigate = useNavigate();

    useEffect(() => {
        if (!isOpen) return;

        if (locationToEdit !== null) {
            setPlaceName(locationToEdit.locationname);
        }
        else {
            setPlaceName('');
        }

        setPlaceNameTouched(false);


        setSubmitting(false);

    }, [isOpen]);

    const handleSubmit = async () => {

        const placeData = {
            id: locationToEdit !== null ? locationToEdit.id : 0,
            locationname: placeName.trim(),
        }

        
        const url = config.API_BASE_URL + '/Admin/addorupdatelocation'
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
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // optional backdrop
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '1rem', // allow some breathing space on small screens
    }}
  >
    <div
      style={{
        backgroundColor: '#c7a6ac',
        padding: '1.5rem',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '500px', // stays smaller on desktop
      }}
    >
      <h2
        style={{
          backgroundColor: '#8d4a5b',
          padding: '1rem',
          color: 'white',
          borderRadius: '8px',
          fontSize: '1.25rem',
          textAlign: 'center',
          margin: 0,
          marginBottom: '1rem',
        }}
      >
        Pladsnavn
      </h2>

      <div style={{ marginBottom: '1rem' }}>
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
            borderColor:
              !isPlaceNameValid && placeNameTouched ? 'red' : undefined,
            borderWidth: '1.5px',
            borderStyle: 'solid',
            borderRadius: '4px',
            boxSizing: 'border-box',
          }}
          disabled={submitting}
        />
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          onClick={handleSubmit}
          disabled={!isFormValid || submitting}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor:
              isFormValid && !submitting ? '#8d4a5b' : 'grey',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor:
              isFormValid && !submitting ? 'pointer' : 'not-allowed',
            marginRight: '0.5rem',
          }}
        >
          Ok
        </button>

        <button
          onClick={onClose}
          disabled={submitting}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: !submitting ? '#8d4a5b' : 'grey',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: !submitting ? 'pointer' : 'not-allowed',
          }}
        >
          Annuler
        </button>
      </div>
    </div>
  </div>
);

};

export default AdminPlaceCreateEdit;