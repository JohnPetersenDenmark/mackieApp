import React, { useEffect, useState } from 'react';
import axios from 'axios';  // Make sure axios is installed and imported
import { Pizza } from '../types/Pizza';
import { OrderItem } from '../types/OrderItem';
import { Topping } from '../types/Topping';
import { Order } from '../types/Order';
import { Payment } from "../types/Payment";
import { TruckLocation } from '../types/TruckLocation';
import config from '../config';
import "./OrderModal.css";
import ClipLoader from 'react-spinners/ClipLoader';
import { AxiosClientGet, AxiosClientPost } from '../types/AxiosClient';
//import FrisbiiCheckoutButton from './FrisbiiCheckoutButton';

import FlatpayCheckout from './FlatpayCheckout';



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

  const [createdOrderData, setCreatedOrderData] = useState<any | null>(null);

  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<TruckLocation | null>(null);
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
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submittedOrderSuccessfully, setSubmittedOrderSuccessfully] = useState(false);

  const [goToPayment, setGoToPayment] = useState(false);
  const [paymentPerformed, setPaymentPerformed] = useState(false);
  const [reload, setReload] = useState(0);

  const [enteredQuantity, setEnteredQuantity] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    const orderItemsPizza: OrderItem[] = pizzaList.map(pizza => ({
      quantity: 1,
      productid: pizza.id,
      producttype: pizza.producttype,
      pizzanumber: pizza.pizzanumber,
      productname: pizza.name,
      productdescription: pizza.description,
      unitdiscountpercentage: pizza.discountpercentage,
      discountedunitprice: pizza.discountprice,
      unitprice: pizza.price,
      orderid: 0,
      selected: false
    }

    ));

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
      pizzanumber: '',
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

    let tmpIndex = 0;
    orderItems.forEach(element => {
      enteredQuantity[tmpIndex] = element.quantity.toString();
      tmpIndex++;
    });


    setAllOrderItems(orderItems);


    if (existingOrder !== null) {
      setSelectedLocationId(existingOrder.locationId.toString());
      setCustomerName(existingOrder.customerName);
      setPhone(existingOrder.phone);
      setEmail(existingOrder.email);
      setComment(existingOrder.comment)
      setSubmitError(null);
      setPaymentError(null);
      setPaymentPerformed(false)
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
        setPaymentError(null);
         setPaymentPerformed(false)
      setSubmitSuccess(null);
      setSubmittedOrderSuccessfully(false)
      setSubmitting(false);
      setSubscribeToNewsletter(false);
    }
  }, [isOpen, pizzaList, toppingList]);



  const handleLocationChanged = (locationId: string) => {

    setSelectedLocationId(locationId);

    let location = locations.find(tmpLocation => tmpLocation.id === Number(locationId));
    if (location) {
      setSelectedLocation(location);
    }
  };



  const updateQuantity = (index: number, quantity: string) => {

    if (quantity === '') {
      enteredQuantity[index] = '';
      const updated = [...allOrderItems];
      updated[index].quantity = 0;
      setAllOrderItems(updated);
      return
      return;
      // quantityAsNumber = 0;
    }

    let quantityAsNumber = Number(quantity);

    if (!isNaN(quantityAsNumber)) {
      enteredQuantity[index] = quantity;
      const updated = [...allOrderItems];
      updated[index].quantity = quantityAsNumber;
      setAllOrderItems(updated);
      return
    }


  };

  const handleGoToPayment = () => {

    const CustomerOrderCodeAsString = Math.floor(1000 + Math.random() * 9000).toString();

    const orderData: any = {
      id: CustomerOrderCodeAsString,
      customerName: customerName.trim(),
      customerId: email,
      phone: phone,
      email: email,
      totalPrice: parseFloat(getTotal()),
    };

    setCreatedOrderData(orderData)
    setGoToPayment(true);
    setReload(prev => prev + 1);

  };

  const handleCloseCheckout = () => {
    setGoToPayment(false);
  };


  const handlePaymentStatus = async (payment: Payment) => {

    if (payment.flatratepaymentsuccess) {
      try {

        let orderSucces = await SubmitOrder();

        if (orderSucces) {
          const response = AxiosClientPost('/Home/createorderpayment', payment, false);
        }

      } catch (error) {

        setSubmitError('Kunne ikke sende betalingsinfo. Prøv igen senere.');
        console.error(error);
      }
    }
    else {
        setPaymentError(payment.flatratestatusorerror )
    }

    setPaymentPerformed(true)
  };



  const handleCloseThisWindow = () => {
    setCreatedOrderData(null);
    setSubmittedOrderSuccessfully(false);
    onClose();
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
  const isOneOrderlineEntered = allOrderItems.some(orderLine => orderLine.selected && orderLine.quantity > 0);
  const isAnyOrderlineEnteredWithZeroQuantity = allOrderItems.some(orderLine => orderLine.selected && orderLine.quantity == 0);

  const isFormValid = isNameValid && isLocationValid && isPhoneValid && isEmailValid && isOneOrderlineEntered && !isAnyOrderlineEnteredWithZeroQuantity;



  // Submit order
  const SubmitOrder = async () => {
    setLocationTouched(true);
    setNameTouched(true);
    setPhoneTouched(true);
    setEmailTouched(true);


    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    // setGoToPayment(false);

    let orderSuccess = false;

    let LocationIdAsNumber = Number(selectedLocationId);
    if (isNaN(LocationIdAsNumber)) {
      LocationIdAsNumber = 0;
    }

    const orderData: Order = {
      id: existingOrder ? existingOrder.id : 0,
      customerName: customerName.trim(),
      customerorderCode: existingOrder ? existingOrder.customerorderCode : createdOrderData.id,
      phone: phone,
      email: email,
      locationId: LocationIdAsNumber,
      createddatetime: new Date().toISOString(),
      modifieddatetime: new Date().toISOString(),
      payeddatetime: new Date().toISOString(),
      locationname: 'aaaa',
      locationstartdatetime: '',
      locationenddatetime: '',
      locationbeautifiedstartdatetime: 'aaa',
      locationbeautifiedTimeInterval: 'aaaa',
      totalPrice: parseFloat(getTotal()),

      // subscribeToNewsletter,
      comment: comment.trim(),
      orderlines: allOrderItems
        .filter(p => p.selected),
    };

    try {
      let response: any;
      if (existingOrder === null) {
        response = await AxiosClientPost('/Home/createorder', orderData, false);
      }
      else {
        response = await AxiosClientPost('/Home/updateorder', orderData, false);
      }

      setSubmitSuccess('Betalingen er godkendt og bestillingen er sendt! Tak for din ordre.');
      setSubmittedOrderSuccessfully(true);
      orderSuccess = true;

    } catch (error) {
      setSubmitError('Kunne ikke sende bestillingen. Prøv igen senere.');
      console.error(error);
    } finally {
      setSubmitting(false);
    }

    return orderSuccess;
  };



  if (!isOpen) return null;

  return (


    <div className="modal-overlay">
      <div className="modal-content">

        <h2 className="heading">Bestil frisklavet pizza og bag-selv</h2>
        {/* Location */}
        <label htmlFor="locationSelect" className="label">Vælg afhentningssted:</label>
        <select
          id="locationSelect"
          value={selectedLocationId}
          onChange={(e) => handleLocationChanged(e.target.value)}
          onBlur={() => setLocationTouched(true)}
          className="select"
          disabled={submitting}
        >
          <option value="" disabled>-- Vælg et sted --</option>
          {locations.map(loc => (
            <option key={loc.id} value={loc.id}>
              {loc.locationname} ({loc.startdatetime.split(' ')[0]}) {loc.startdatetime.slice(-5)}–{loc.enddatetime.slice(-5)}
            </option>
          ))}
        </select>


        {/* Customer name */}
        <label htmlFor="customerName" className="label">Dit navn:</label>
        <input
          id="customerName"
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          onBlur={() => setNameTouched(true)}
          placeholder="Indtast dit navn"
          className="input"
          disabled={submitting}
        />
        {!isNameValid && nameTouched && (
          <p style={{ color: 'red', marginTop: '0.25rem' }}>Navn må ikke være tomt.</p>
        )}


        {/* Phone */}

        <label htmlFor="phone" className="label">Telefonnummer:</label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={() => setPhoneTouched(true)}
          placeholder="+451234567890 eller 12345678"
          className="input"
          maxLength={12}
          disabled={submitting}
        />
        {!isPhoneValid && phoneTouched && (
          <p style={{ color: 'red', marginTop: '0.25rem' }}>
            Telefonnummer skal være enten 8 cifre eller '+' efterfulgt af 10 cifre.
          </p>
        )}


        {/* Email */}
        <label htmlFor="email" className="label">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setEmailTouched(true)}
          placeholder="Indtast din email"
          className="input"
          disabled={submitting || (existingOrder !== null)}
        />
        {!isEmailValid && emailTouched && (
          <p style={{ color: 'red', marginTop: '0.25rem' }}>Indtast venligst en gyldig emailadresse.</p>
        )}

        <hr />
        {/* Pizza list */}
        {orderItemsPizza.map((item, index) => (
          <div key={item.productid} className="pizza-item-container">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={item.selected}
                onChange={() => toggleSelection(index)}
                disabled={submitting}
              />
              <span>
                <strong>{item.pizzanumber + ' ' + item.productname}</strong>{' '}
                (Pris før rabat {item.discountedunitprice.toFixed(2).replaceAll('.', ',')} kr)
              </span>
            </label>

            {item.selected && (
              <div className="quantity-container">
                <input
                  className="quantity-input"
                  type="number"
                  value={enteredQuantity[index]}
                  onChange={(e) => updateQuantity(index, e.target.value)}
                  disabled={submitting}
                />
                <span>
                  {(item.unitprice * item.quantity).toFixed(2).replaceAll('.', ',')} kr
                </span>
              </div>
            )}
          </div>
        ))}

        {/* Topping list */}
        {orderItemsTopping.map((item, index) => (
          <div key={item.productid} className="pizza-item-container">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={item.selected}
                onChange={() => toggleSelection(index + orderItemsPizza.length)}
                disabled={submitting}
              />
              <span>
                <strong>{item.productname}</strong>{' '}
                (Pris før rabat {item.discountedunitprice.toFixed(2).replaceAll('.', ',')} kr)
              </span>
            </label>

            {item.selected && (
              <div className="quantity-container">
                <input
                  className="quantity-input"
                  type="number"
                  value={enteredQuantity[index + orderItemsPizza.length]}
                  onChange={(e) => updateQuantity(index + orderItemsPizza.length, e.target.value)}
                  disabled={submitting}
                />
                <span>
                  {(item.unitprice * item.quantity).toFixed(2).replaceAll('.', ',')} kr
                </span>
              </div>
            )}
          </div>
        ))}



        {/* Comment */}
        {/*   <label htmlFor="comment" className="label">Kommentarer til bestillingen:</label>
        <textarea id="comment" className="textarea" ... /> */}

        <label htmlFor="comment" className="label">Kommentarer til bestillingen:</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Skriv eventuelle ønsker eller bemærkninger her..."
          spellCheck='false'
          rows={3}
          className="textarea"
          disabled={submitting}
        />

        Afhentning:  {selectedLocation?.locationname} d. {selectedLocation?.locationbeautifiedstartdatetime} mellem {selectedLocation?.locationbeautifiedTimeInterval}
        <hr />
        <p><strong>Total: {getTotal()} kr</strong></p>

        {submitError && <p style={{ color: 'red' }}>{submitError}</p>}
        {submitSuccess && <p style={{ color: 'green' }}>{submitSuccess}</p>}

        {paymentError && <p style={{ color: 'red' }}>{paymentError}</p>}
        

        {/* Buttons */}


        {/* Insert Button Send bestilling below */}


        <button
          onClick={handleCloseThisWindow}
          disabled={submitting || goToPayment}
          className="close-btn"
        >
          Luk
        </button>


        <button
          onClick={handleGoToPayment}
          disabled={!isFormValid || paymentPerformed || goToPayment}
          className="close-btn"
        >
          Betaling
        </button>

        {goToPayment ? <FlatpayCheckout createdOrderData={createdOrderData} onPaymentStatus={handlePaymentStatus} onClose={handleCloseCheckout} /> : ''}

      </div>
    </div >

  );


};

export default OrderModal;
