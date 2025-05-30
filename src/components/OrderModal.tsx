import React, { useEffect, useState } from 'react';
import axios from 'axios';  // Make sure axios is installed and imported
import { Pizza } from '../types/Pizza';
import { OrderItem } from '../types/OrderItem';
import { Topping } from '../types/Topping';
import { Order } from '../types/Order';
import { TruckLocation } from '../types/TruckLocation';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  pizzas: Pizza[];
  toppings: Topping[];
  locations: TruckLocation[];
}

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, pizzas: pizzaList, toppings : toppingList , locations }) => {
  const [allOrderItems, setAllOrderItems] = useState<OrderItem[]>([]);

  const [orderItemsTopping, setOrderItemsTopping] = useState<OrderItem[]>([]);
  const [orderItemsPizza, setOrderItemsPizza] = useState<OrderItem[]>([]);


  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [locationTouched, setLocationTouched] = useState(false);

  const [customerName, setCustomerName] = useState<string>('');
  const [nameTouched, setNameTouched] = useState(false);

  const [phone, setPhone] = useState<string>('');
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [subscribeToNewsletter, setSubscribeToNewsletter] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [emailTouched, setEmailTouched] = useState(false);

  const [comment, setComment] = useState<string>('');  // <-- Added comment state

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const orderItemsPizza : OrderItem[]  = pizzaList.map(pizza => ({
      product : pizza,
      quantity: 1,
      unitdiscountpercentage : pizza.discountpercentage,
      discountedunitprice : pizza.discountprice,
      selected: false,
    }));
    setOrderItemsPizza(orderItemsPizza);

     const orderItemsTopping : OrderItem[] = toppingList.map(topping => ({
      product : topping,
      quantity: 1,
        unitdiscountpercentage : 0,
      discountedunitprice : 0,
      selected: false,
    }));
    setOrderItemsTopping(orderItemsTopping);

    const orderItems = [...orderItemsPizza, ...orderItemsTopping]
    setAllOrderItems(orderItems);

    setSelectedLocationId(''); 
    setLocationTouched(false);
    setCustomerName('');
    setNameTouched(false);
    setPhone('');
    setPhoneTouched(false);
    setEmail('');
    setEmailTouched(false);
    setComment('');  // Reset comment on open
    setSubmitError(null);
    setSubmitSuccess(null);
    setSubmitting(false);
    setSubscribeToNewsletter(false);
  }, [isOpen, pizzaList, toppingList]);

  const updateQuantity = (index: number, quantity: number) => {
    const updated = [...allOrderItems];
    updated[index].quantity = quantity;
    setAllOrderItems(updated);
  };

  const toggleSelection = (index: number) => {
    const updated = [...allOrderItems];
    updated[index].selected = !updated[index].selected;
    setAllOrderItems(updated);
  };

  const getTotal = () => {
    return allOrderItems
      .filter(p => p.selected)
      .reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      .toFixed(2);
  };

  // Validation
  const isNameValid = customerName.trim().length > 0;
  const isLocationValid = selectedLocationId !== '';
  const phoneRegex = /^(\d{8}|\+\d{10})$/;
  const isPhoneValid = phoneRegex.test(phone);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);

  const isFormValid = isNameValid && isLocationValid && isPhoneValid && isEmailValid && allOrderItems.some(p => p.selected);

  // Submit handler
  const handleSubmit = async () => {
    setLocationTouched(true);
    setNameTouched(true);
    setPhoneTouched(true);
    setEmailTouched(true);

    if (!isFormValid) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    const orderData : Order = {
      customerName: customerName.trim(),
      customerOrderNumber : "",
      phone,
      email,
      locationId: selectedLocationId,
      subscribeToNewsletter,
      comment: comment.trim(),  // <-- Include comment in submission
      items: allOrderItems
        .filter(p => p.selected) ,
      /*   .map(p => ({
          pizzaid: p.pizzaid,
          quantity: p.quantity,
        })), */
      totalPrice: parseFloat(getTotal()),
    };

    try {
      // Replace this URL with your actual API endpoint
      const response = await axios.post('http://192.168.8.105:5000/Home/createorder', orderData);

      setSubmitSuccess('Bestilling sendt! Tak for din ordre.');
      // Optionally reset form or close modal after success:
      // onClose();
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
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', minWidth: '500px' }}>
        <h2>Bestil frisklavet pizza og bag-selv</h2>

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
            disabled={submitting}
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
            disabled={submitting}
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
            disabled={submitting}
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
            disabled={submitting}
          />
          {!isEmailValid && emailTouched && (
            <p style={{ color: 'red', marginTop: '0.25rem' }}>Indtast venligst en gyldig emailadresse.</p>
          )}
        </div>

        {/* Pizza selection */}
        {orderItemsPizza.length === 0 ? (
          <p>Ingen pizzaer tilgængelige...</p>
        ) : (
          <>
          Vælg pizza
            {orderItemsPizza.map((item, index) => (
              <div key={item.product.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => toggleSelection(index)}
                  style={{ marginRight: '0.5rem' }}
                  disabled={submitting}
                />
                <div style={{ flex: 1 }}>
                  <strong>{item.product.name}</strong> - {item.product.description} ({item.product.price.toFixed(2)} kr)
                </div>
                {item.selected && (
                  <>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1)}
                      style={{ width: '50px', marginLeft: '1rem' }}
                      disabled={submitting}
                    />
                    <span style={{ marginLeft: '1rem' }}>
                      {(item.product.price * item.quantity).toFixed(2)} kr
                    </span>
                  </>
                )}
              </div>
            ))}
            <div>
               {/* Topping selection */}
               Vælg tilbehør
               {orderItemsTopping.map((item, index) => (
              <div key={item.product.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => toggleSelection(index + orderItemsPizza.length )}
                  style={{ marginRight: '0.5rem' }}
                  disabled={submitting}
                />
                <div style={{ flex: 1 }}>
                  <strong>{item.product.name}</strong> - {item.product.description} ({item.product.price.toFixed(2)} kr)
                </div>
                {item.selected && (
                  <>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(index + orderItemsPizza.length , parseInt(e.target.value) || 1)}
                      style={{ width: '50px', marginLeft: '1rem' }}
                      disabled={submitting}
                    />
                    <span style={{ marginLeft: '1rem' }}>
                      {(item.product.price * item.quantity).toFixed(2)} kr
                    </span>
                  </>
                )}
              </div>
                 ))}
            </div>

            <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                <input
                  type="checkbox"
                  checked={subscribeToNewsletter}
                  onChange={() => setSubscribeToNewsletter(!subscribeToNewsletter)}
                  disabled={submitting}
                  style={{ marginRight: '0.5rem' }}
                />
                Jeg vil gerne modtage nyhedsbrev fra Mackies Pizza Truck
              </label>
            </div>

            {/* Comment input added here */}
            <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
              <label htmlFor="comment"><strong>Kommentar til bestillingen:</strong></label><br />
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Skriv eventuelle ønsker eller bemærkninger her..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  marginTop: '0.25rem',
                  borderRadius: '4px',
                  border: '1.5px solid #ccc',
                  resize: 'vertical',
                }}
                disabled={submitting}
              />
            </div>

            <hr />
            <p><strong>Total: {getTotal()} kr</strong></p>

            {submitError && <p style={{ color: 'red' }}>{submitError}</p>}
            {submitSuccess && <p style={{ color: 'green' }}>{submitSuccess}</p>}

            <div style={{ textAlign: 'right' }}>
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
              >
                {submitting ? 'Sender...' : 'Send Bestilling'}
              </button>
              <button
                onClick={onClose}
                disabled={submitting}
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#ccc',
                  color: 'black',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: submitting ? 'not-allowed' : 'pointer',
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
