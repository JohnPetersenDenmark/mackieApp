
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Order } from '../types/Order';




interface CheckOrderModalProps {
  isOpen: boolean;
  onOrderFetched: (order: Order) => void;
  onClose: () => void;
}

const CheckMyOrder: React.FC<CheckOrderModalProps> = ({ isOpen, onOrderFetched , onClose}) => {

  const [submitting, setSubmitting] = useState(false);

  const [email, setEmail] = useState<string>('');
  const [emailTouched, setEmailTouched] = useState(false);

  const [customerOrderNumber, setCustomerOrderNumber] = useState<string>('');
  const [orderNumberTouched, setCustomerOrderNumberTouched] = useState(false);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);

  const isCustomerOrderNumberValid = customerOrderNumber.length > 0;

  const isFormValid = isEmailValid && isCustomerOrderNumberValid;

  useEffect(() => {
    if (!isOpen) return;

    setCustomerOrderNumber('');
    setCustomerOrderNumberTouched(false);

    setEmail('');
    setEmailTouched(false);

    setSubmitting(false);
  }, [isOpen]);

  // Submit handler
  const handleSubmit = async () => {
    setEmailTouched(true);
    setCustomerOrderNumberTouched(true);

    if (!isFormValid) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    const orderData = {
      orderId: customerOrderNumber.trim(),
      email,

    };

    try {
      const response = await axios.post('http://192.168.8.105:5000/Home/getorderbyid', orderData);

      var curOrder: Order = response.data;
      //  setSubmitSuccess('Ordren er fundet');
      onOrderFetched(response.data);

    } catch (error) {
      setSubmitError('Kunne ikke sende bestillingen. Prøv igen senere.');
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
        <h2 style={{ backgroundColor: '#8d4a5b', padding: '2rem', color: 'white',  borderRadius: '8px' }} >Se din bestilling hos Mackies Pizza Truck</h2>

        {/* Email input */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email"><strong>Email:</strong></label><br />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setEmailTouched(true)}
            placeholder="Indtast din email"
            style={{
              width: '100%',
              padding: '0.5rem',
              marginTop: '0.25rem',
              borderColor: !isEmailValid && emailTouched ? 'red' : undefined,
              borderWidth: '1.5px',
              borderStyle: 'solid',
              borderRadius: '4px',
            }}
            disabled={submitting}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="orderNumber"><strong>Ordrenummer:</strong></label><br />
          <input
            id="orderNumber"
            type="text"
            value={customerOrderNumber}
            onChange={(e) => setCustomerOrderNumber(e.target.value)}
            onBlur={() => setCustomerOrderNumberTouched(true)}
            placeholder="Indtast ordrenummer"
            style={{
              width: '100%',
              padding: '0.5rem',
              marginTop: '0.25rem',
              borderColor: !isCustomerOrderNumberValid && orderNumberTouched ? 'red' : undefined,
              borderWidth: '1.5px',
              borderStyle: 'solid',
              borderRadius: '4px',
            }}
            disabled={submitting}
          />
          {!isCustomerOrderNumberValid && orderNumberTouched && (
            <p style={{ color: 'red', marginTop: '0.25rem' }}>Ordrenummer skal angives</p>
          )}
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
          > Hent</button>
        
        
        <button
          onClick={onClose}
          disabled={submitting}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor:  !submitting ? '#8d4a5b' : 'grey',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: !submitting ? 'pointer' : 'not-allowed',
            marginRight: '0.5rem',
          }}
        > Annuler</button>

      </div>
    </div>
  );
}

export default CheckMyOrder;