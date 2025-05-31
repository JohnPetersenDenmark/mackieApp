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
  existingOrder: Order | null;
}

const OrderModal: React.FC<OrderModalProps> = ({ existingOrder, isOpen, onClose, pizzas: pizzaList, toppings: toppingList, locations }) => {
  const [allOrderItems, setAllOrderItems] = useState<OrderItem[]>([]);

  const [orderItemsTopping, setOrderItemsTopping] = useState<OrderItem[]>([]);
  const [orderItemsPizza, setOrderItemsPizza] = useState<OrderItem[]>([]);

  const [orderId, setOrderId] = useState<number>(0);

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
  const [submittedOrderSuccessfully, setSubmittedOrderSuccessfully] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const orderItemsPizza: OrderItem[] = pizzaList.map(pizza => ({
      quantity: 1,
      productid: pizza.id,
      producttype: pizza.producttype,
      productname: pizza.name,
      productdescription: pizza.description,
      unitdiscountpercentage: pizza.discountpercentage,
      discountedunitprice: pizza.discountprice,
      unitprice: pizza.price,
      orderid: 0,
      selected: false,
    }));

    if (existingOrder !== null) {
      existingOrder.orderlines.forEach(orderLine => {
        if (orderLine.producttype == 0)  // pizzas
        {
          const orderItem = orderItemsPizza.find(orderItem => orderItem.productid === orderLine.productid);
          if (orderItem) {
            orderItem.quantity = orderLine.quantity;
            orderItem.unitprice = orderLine.unitprice;
            orderItem.discountedunitprice = orderLine.discountedunitprice;
            orderItem.orderid = orderLine.orderid;
           // orderItem.productdescription = orderLine.productdescription;
           // orderItem.productname = orderLine.productname;
            orderItem.selected = true;
            orderItem.unitdiscountpercentage = orderLine.unitdiscountpercentage;
          }
        }
      });
    }

    setOrderItemsPizza(orderItemsPizza);

    const orderItemsTopping: OrderItem[] = toppingList.map(topping => ({
      quantity: 1,
      productid: topping.id,
      producttype: topping.producttype,
      productdescription: topping.description,
      productname: topping.name,
      unitdiscountpercentage: 0,
      discountedunitprice: 0,
      unitprice: topping.price,
      orderid: 0,
      selected: false,
    }));

     if (existingOrder !== null) {
      existingOrder.orderlines.forEach(orderLine => {
        if (orderLine.producttype == 1)  // toppings
        {
          const orderItem = orderItemsTopping.find(orderItem => orderItem.productid === orderLine.productid);
          if (orderItem) {
            orderItem.quantity = orderLine.quantity;
            orderItem.unitprice = orderLine.unitprice;
            orderItem.discountedunitprice = orderLine.discountedunitprice;
            orderItem.orderid = orderLine.orderid;
           // orderItem.productdescription = orderLine.productdescription;
           // orderItem.productname = orderLine.productname;
            orderItem.selected = true;
            orderItem.unitdiscountpercentage = orderLine.unitdiscountpercentage;
          }
        }
      });
    }

    setOrderItemsTopping(orderItemsTopping);

    const orderItems = [...orderItemsPizza, ...orderItemsTopping]
    setAllOrderItems(orderItems);


    if (existingOrder !== null) {
      setSelectedLocationId(existingOrder.locationId);
      setCustomerName(existingOrder.customerName);
      setPhone(existingOrder.phone);
      setEmail(existingOrder.email);
      setComment(existingOrder.comment)
      setSubmitError(null);
      setOrderId(existingOrder.id)
      setSubmitSuccess(null);
      setSubmittedOrderSuccessfully(false)
      setSubmitting(false);
      setSubscribeToNewsletter(false);

    }

    else {
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
      setSubmittedOrderSuccessfully(false)
      setSubmitting(false);
      setSubscribeToNewsletter(false);
    }
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
      .reduce((sum, item) => sum + item.unitprice * item.quantity, 0)
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

    const orderData: Order = {
      id: orderId,
      customerName: customerName.trim(),
      customerorderCode: "",
      phone,
      email,
      locationId: selectedLocationId,
      // subscribeToNewsletter,
      comment: comment.trim(),
      orderlines: allOrderItems
        .filter(p => p.selected),
      /*   .map(p => ({
          pizzaid: p.pizzaid,
          quantity: p.quantity,
        })), */
      totalPrice: parseFloat(getTotal()),
    };

    try {
      let response;
      if (existingOrder === null) {
        response = await axios.post('http://192.168.8.105:5000/Home/createorder', orderData);
      }
      else{
          response = await axios.post('http://192.168.8.105:5000/Home/updateorder', orderData);
      }

      setSubmitSuccess('Bestilling sendt! Tak for din ordre.');
      setSubmittedOrderSuccessfully(true);
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
        backgroundColor: '#8d4a5b',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div style={{ backgroundColor: '#c7a6ac', padding: '2rem', borderRadius: '8px', minWidth: '500px' }}>

        <div style={{ backgroundColor: '#8d4a5b', color: 'white', height: '80px' }}>
          <p style={{ fontSize: '50px', paddingTop: '10px', paddingLeft: '10px' }}>Bestil frisklavet pizza og bag-selv</p>
        </div>


        {/* Location selector */}
        <div style={{ marginBottom: '1rem', marginTop: '20px' }}>
          <label htmlFor="locationSelect"><strong>Vælg afhentningssted:</strong></label><br />
          <select
            id="locationSelect"
            value={selectedLocationId}
            onChange={(e) => setSelectedLocationId(e.target.value)}
            onBlur={() => setLocationTouched(true)}
            style={{
              backgroundColor: '#c7a6ac',
              fontSize: '20px',
              width: '100%',
              padding: '0.5rem',
              marginTop: '0.25rem',
              borderColor: !isLocationValid && locationTouched ? 'red' : '#22191b',
              border: '1.5px',
              borderStyle: 'solid',
              borderRadius: '4px'
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
              fontSize: '20px',
              backgroundColor: '#c7a6ac',
              width: '100%',
              padding: '0.5rem',
              marginTop: '0.25rem',
              borderColor: !isNameValid && nameTouched ? 'red' : '#22191b',
              border: '1.5px solid',
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
              backgroundColor: '#c7a6ac',
              fontSize: '20px',
              width: '100%',
              padding: '0.5rem',
              marginTop: '0.25rem',
              borderColor: !isPhoneValid && phoneTouched ? 'red' : undefined,
              border: '1.5px solid #22191b',
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
              backgroundColor: '#c7a6ac',
              fontSize: '20px',
              width: '100%',
              padding: '0.5rem',
              marginTop: '0.25rem',
              borderColor: !isEmailValid && emailTouched ? 'red' : undefined,
              border: '1.5px solid #22191b',
              borderRadius: '4px',
            }}
            disabled={submitting || (existingOrder !== null)}
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
            <div style={{ marginBottom: '1rem', marginTop: '3rem', fontSize: '25px' }}>
              Vælg pizza
            </div>

            {orderItemsPizza.map((item, index) => (
              <div
                key={item.productid}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                  fontSize: '20px'
                }}
              >
                {/* 1) Checkbox (native size + scaled) */}
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => toggleSelection(index)}
                  disabled={submitting}
                  style={{
                    accentColor: '#8d4a5b',
                    marginRight: '0.5rem',
                    transform: 'scale(1.5)',
                    transformOrigin: 'center center',
                    alignSelf: 'center'
                  }}
                />

                {/* 2) Product info — fixed width */}
                <div
                  style={{
                    flex: '0 0 500px',    // no grow, no shrink, basis = 300px
                    overflow: 'hidden',   // if text too long, hide it
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <strong>{item.productname}</strong>{' '}
                  (Pris før rabat {item.discountedunitprice.toFixed(2)} kr)
                </div>

                {/* 3) Quantity & line total — only when selected, fixed width */}
                {item.selected && (
                  <div
                    style={{
                      display: 'flex',
                      flex: '0 0 200px',  // no grow, no shrink, basis = 150px
                      alignItems: 'center',
                      marginLeft: '1rem'
                    }}
                  >
                    <input
                      type='text'
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(index, parseInt(e.target.value) || 1)
                      }
                      disabled={submitting}
                      style={{
                        width: '50px',
                        height: '25px',
                        fontSize: '15px',
                        marginRight: '0.5rem'
                      }}
                    />
                    <span>
                      {(item.unitprice * item.quantity).toFixed(2)} kr
                    </span>
                  </div>
                )}
              </div>
            ))}

            <div>
              {/* Topping selection */}
              <div style={{ marginBottom: '1rem', marginTop: '3rem', fontSize: '25px' }}>
                Vælg tilbehør
              </div>
              {orderItemsTopping.map((item, index) => (
                <div
                  key={item.productid}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '0.5rem',
                    fontSize: '20px'
                  }}
                >
                  {/* 1) Checkbox (native size + scaled) */}
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => toggleSelection(index + orderItemsPizza.length)}
                    disabled={submitting}
                    style={{
                      accentColor: '#8d4a5b',
                      marginRight: '0.5rem',
                      transform: 'scale(1.5)',
                      transformOrigin: 'center center',
                      alignSelf: 'center'
                    }}
                  />

                  {/* 2) Product info — fixed width */}
                  <div
                    style={{
                      flex: '0 0 500px',    // no grow, no shrink, basis = 300px
                      overflow: 'hidden',   // if text too long, hide it
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <strong>{item.productname}</strong>{' '}
                    (Pris før rabat {item.discountedunitprice.toFixed(2)} kr)
                  </div>

                  {/* 3) Quantity & line total — only when selected, fixed width */}
                  {item.selected && (
                    <div
                      style={{
                        display: 'flex',
                        flex: '0 0 200px',  // no grow, no shrink, basis = 150px
                        alignItems: 'center',
                        marginLeft: '1rem'
                      }}
                    >
                      <input
                        type='text'
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(index + orderItemsPizza.length, parseInt(e.target.value) || 1)
                        }
                        disabled={submitting}
                        style={{
                          width: '50px',
                          height: '25px',
                          fontSize: '15px',
                          marginRight: '0.5rem'
                        }}
                      />
                      <span>
                        {(item.unitprice * item.quantity).toFixed(2)} kr
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '20px' }}>
                <input
                  type="checkbox"
                  checked={subscribeToNewsletter}
                  onChange={() => setSubscribeToNewsletter(!subscribeToNewsletter)}
                  disabled={submitting}
                  style={{ marginRight: '0.5rem', transform: 'scale(1.5)', transformOrigin: 'top left' }}
                />
                Jeg vil gerne modtage nyhedsbrev fra Mackies Pizza Truck
              </label>
            </div>

            {/* Comment input added here */}
            <div style={{ marginTop: '1rem', marginBottom: '3rem' }}>
              <label htmlFor="comment" style={{ fontSize: '20px' }} ><strong>Kommentar til bestillingen:</strong></label><br />
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Skriv eventuelle ønsker eller bemærkninger her..."
                spellCheck='false'
                rows={3}
                style={{
                  backgroundColor: '#c7a6ac',
                  width: '100%',
                  padding: '0.5rem',
                  marginTop: '0.25rem',
                  borderRadius: '4px',
                  border: '1.5px solid #22191b',
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
                disabled={!isFormValid || submitting || submittedOrderSuccessfully}
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: isFormValid && !submitting && !submittedOrderSuccessfully ? '#8d4a5b' : 'grey',
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
                  backgroundColor: '#8d4a5b',
                  color: 'white',

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
