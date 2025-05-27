import React, { useEffect, useState } from 'react';
import { Pizza } from '../types/Pizza';
import { OrderItem } from '../types/OrderItem';
import { TruckLocation } from '../types/TruckLocation';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  pizzas: Pizza[];
  locations: TruckLocation[];
}

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, pizzas: pizzaList, locations }) => {
  const [pizzas, setPizzas] = useState<OrderItem[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [locationTouched, setLocationTouched] = useState(false);

  const [customerName, setCustomerName] = useState<string>('');
  const [nameTouched, setNameTouched] = useState(false);

  const [phone, setPhone] = useState<string>('');
  const [phoneTouched, setPhoneTouched] = useState(false);

  const [email, setEmail] = useState<string>('');
  const [emailTouched, setEmailTouched] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const orderItems = pizzaList.map(pizza => ({
      pizza,
      quantity: 1,
      selected: false,
    }));

    setPizzas(orderItems);
    setSelectedLocationId('');
    setLocationTouched(false);
    setCustomerName('');
    setNameTouched(false);
    setPhone('');
    setPhoneTouched(false);
    setEmail('');
    setEmailTouched(false);
  }, [isOpen, pizzaList]);

  const updateQuantity = (index: number, quantity: number) => {
    const updated = [...pizzas];
    updated[index].quantity = quantity;
    setPizzas(updated);
  };

  const toggleSelection = (index: number) => {
    const updated = [...pizzas];
    updated[index].selected = !updated[index].selected;
    setPizzas(updated);
  };

  const getTotal = () => {
    return pizzas
      .filter(p => p.selected)
      .reduce((sum, item) => sum + item.pizza.price * item.quantity, 0)
      .toFixed(2);
  };

  // Validation
  const isNameValid = customerName.trim().length > 0;
  const isLocationValid = selectedLocationId !== '';
  const phoneRegex = /^(\d{8}|\+\d{10})$/;
  const isPhoneValid = phoneRegex.test(phone);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);

  const isFormValid = isNameValid && isLocationValid && isPhoneValid && isEmailValid;

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', minWidth: '500px' }}>
        <h2>Lav din bestilling</h2>

        {/* Location selector */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="locationSelect"><strong>Vælg afhentningssted:</strong></label><br />
          <select
            id="locationSelect"
            value={selectedLocationId}
            onChange={(e) => setSelectedLocationId(e.target.value)}
            onBlur={() => setLocationTouched(true)}
            style={{
              width: '100%',
              padding: '0.5rem',
              marginTop: '0.25rem',
              borderColor: !isLocationValid && locationTouched ? 'red' : undefined,
              borderWidth: '1.5px',
              borderStyle: 'solid',
              borderRadius: '4px',
            }}
          >
            <option value="" disabled>-- Vælg et sted --</option>
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>
                {loc.locationname} ({loc.startdatetime.split(' ')[0]}) {loc.startdatetime.slice(-5)}–{loc.enddatetime.slice(-5)}
              </option>
            ))}
          </select>
          {!isLocationValid && locationTouched && (
            <p style={{ color: 'red', marginTop: '0.25rem' }}>Du skal vælge et afhentningssted.</p>
          )}
        </div>

        {/* Customer name input */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="customerName"><strong>Dit navn:</strong></label><br />
          <input
            id="customerName"
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            onBlur={() => setNameTouched(true)}
            placeholder="Indtast dit navn"
            style={{
              width: '100%',
              padding: '0.5rem',
              marginTop: '0.25rem',
              borderColor: !isNameValid && nameTouched ? 'red' : undefined,
              borderWidth: '1.5px',
              borderStyle: 'solid',
              borderRadius: '4px',
            }}
          />
          {!isNameValid && nameTouched && (
            <p style={{ color: 'red', marginTop: '0.25rem' }}>Navn må ikke være tomt.</p>
          )}
        </div>

        {/* Phone number input */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="phone"><strong>Telefonnummer:</strong></label><br />
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onBlur={() => setPhoneTouched(true)}
            placeholder="+451234567890 eller 12345678"
            style={{
              width: '100%',
              padding: '0.5rem',
              marginTop: '0.25rem',
              borderColor: !isPhoneValid && phoneTouched ? 'red' : undefined,
              borderWidth: '1.5px',
              borderStyle: 'solid',
              borderRadius: '4px',
            }}
            maxLength={12}
          />
          {!isPhoneValid && phoneTouched && (
            <p style={{ color: 'red', marginTop: '0.25rem' }}>
              Telefonnummer skal være enten 8 cifre eller '+' efterfulgt af 10 cifre.
            </p>
          )}
        </div>

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
          />
          {!isEmailValid && emailTouched && (
            <p style={{ color: 'red', marginTop: '0.25rem' }}>Indtast venligst en gyldig emailadresse.</p>
          )}
        </div>

        {pizzas.length === 0 ? (
          <p>Ingen pizzaer tilgængelige...</p>
        ) : (
          <>
            {pizzas.map((item, index) => (
              <div key={item.pizza.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => toggleSelection(index)}
                  style={{ marginRight: '0.5rem' }}
                />
                <div style={{ flex: 1 }}>
                  <strong>{item.pizza.name}</strong> - {item.pizza.description} ({item.pizza.price.toFixed(2)} kr)
                </div>
                {item.selected && (
                  <>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1)}
                      style={{ width: '50px', marginLeft: '1rem' }}
                    />
                    <span style={{ marginLeft: '1rem' }}>
                      {(item.pizza.price * item.quantity).toFixed(2)} kr
                    </span>
                  </>
                )}
              </div>
            ))}

            <hr />
            <p><strong>Total: {getTotal()} kr</strong></p>
            <div style={{ textAlign: 'right' }}>
              <button
                onClick={onClose}
                disabled={!isFormValid}
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: isFormValid ? '#8d4a5b' : 'grey',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isFormValid ? 'pointer' : 'not-allowed',
                }}
              >
                Luk
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderModal;
