import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Order } from '../../types/Order';
import TestRealTimeUpdate from '../TestRealTimeUpdate';
import config from '../../config';

interface AdminOrdersProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [newOrderArrived, setNewOrderArrived] = useState(false);

  const [reload, setReload] = useState(0);

  const [isEditOrderModalOpen, setsEditOrderModalOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');



  let NewOrder: Order | null;

  useEffect(() => {
    const url: string = config.API_BASE_URL + '/Home/orderlist';

    axios
      .get<Order[]>(url)

      .then((response) => {
        const sortedOrders = response.data.sort((a, b) => {
          const timeDiffInMilliSeconds = new Date(b.modifieddatetime + "Z").getTime() - new Date(a.modifieddatetime + "Z").getTime();
          return timeDiffInMilliSeconds;
        });
        setOrders(sortedOrders);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load orders');
        setLoading(false);
        console.error(err);
      });
  }, [newOrderArrived, reload]);

  const handleNewOrderArrived = (data: Order) => {
    setNewOrderArrived(true);
    if (data !== null && data !== undefined) {
      NewOrder = data;
    }
    else {
      NewOrder = null;
    }

  };

  const filteredOrders = orders.filter(order => {
    const orderIdMatches = order.customerorderCode.toString().includes(searchQuery);
    const customerNameMatches = order.customerName?.toLowerCase().includes(searchQuery.toLowerCase());
    //const truckLocationMatches = order.phone?.toLowerCase().includes(searchQuery.toLowerCase());
    const orderLineMatches = order.orderlines?.some(line =>
      line.productname?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return orderIdMatches || customerNameMatches || orderLineMatches // || truckLocationMatches;
  });

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? <mark key={i}>{part}</mark> : part
    );
  };

  const displayedOrders = searchQuery.trim() === '' ? orders : filteredOrders;

  function formatDateToDanish(date: Date): string {
    /* return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getFullYear()} ${date
        .getHours()
        .toString()
        .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`; */

    /*  const danishFormatted = date.toLocaleString("da-DK", {
       timeZone: "Europe/Copenhagen",
       dateStyle: "medium",
       timeStyle: "short"
     }); */

    const options: Intl.DateTimeFormatOptions = {
      timeZone: "Europe/Copenhagen",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    const parts = new Intl.DateTimeFormat("da-DK", options).formatToParts(date);

    const get = (type: string) => parts.find(p => p.type === type)?.value ?? "";

    return `${get("day")}-${get("month")}-${get("year")} ${get("hour")}:${get("minute")}`;

    // return danishFormatted;
  }

  const handleEditOrder = (order: Order) => {
    setOrderToEdit(order);
    setsEditOrderModalOpen(true);
  };

  const handleDeleteOrder = (order: Order) => {
    if (order !== null) {
      const deleteOrder = async () => {
        try {
          setSubmitting(true);
          const url = config.API_BASE_URL + '/Admin/removeorder/' + order.id;
          await axios.delete(url);
          setReload(prev => prev + 1);

        } catch (error) {
          setError('Failed to delete order');
          console.error(error);

        } finally {
          setSubmitting(false);
        }
      };

      deleteOrder();
    }
  };

  const handleRemoveComment = (order: Order) => {

    const orderData = order.id;
    if (order !== null) {
      const updateOrder = async () => {
        try {
          setSubmitting(true);
          // const url = config.API_BASE_URL + '/Home/orderremovecomment/?id=' + order.id;
          const url = config.API_BASE_URL + '/Home/orderremovecomment';


          await axios.post(url, {
            id: order.id
          }, {
            headers: {
              'Content-Type': 'application/json'
            },
            withCredentials: true // only if your server sets cookies
          });


          setReload(prev => prev + 1);

        } catch (error) {
          setError('Failed to update order');
          console.error(error);

        } finally {
          setSubmitting(false);
        }
      };

      updateOrder();
    }
  };



  return (
    <div>
      <TestRealTimeUpdate doNotify={handleNewOrderArrived} />
      <div
        style={{
          border: '1px solid grey',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '20px',
          color: '#22191b',
          fontWeight: 200,
          textAlign: 'center',
        }}
      >
        <div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
              alignItems: 'center',
            }}
          >
            <div style={{ textAlign: 'center', fontSize: '36px' }}>
              <input
                type="text"
                placeholder="Søg"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  marginTop: '0.25rem',
                  marginBottom: '1rem',
                  borderWidth: '1.0px',
                  borderStyle: 'solid',
                  borderRadius: '4px',
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 border rounded"
              />
            </div>
            <div style={{ textAlign: 'center', fontSize: '36px' }}>
              Bestillinger
            </div>
          </div>
        </div>


        {displayedOrders.map((curOrder, index) => {
          // Calculate total price subtotal for order
          const subtotal = curOrder.orderlines.reduce(
            (sum, line) => sum + line.unitprice * line.quantity,
            0
          );

          // Calculate quantity subtotal for producttype 0  Pizza
          const subtotalPizzas = curOrder.orderlines
            .filter((line) => line.producttype === 0)
            .reduce((sum, line) => sum + line.quantity, 0);

          // Calculate quantity subtotal for producttype 1  Topping
          const subtotalToppings = curOrder.orderlines
            .filter((line) => line.producttype === 1)
            .reduce((sum, line) => sum + line.quantity, 0);

          return (
            <div
              key={curOrder.id}
              style={{
                border: '1px solid #ccc',
                padding: '10px',
                marginBottom: '30px',
              }}
            >
              <div
                style={{
                  marginBottom: '30px',
                  padding: 10,
                  textAlign: 'left',
                  fontSize: '25px',
                  backgroundColor: '#8d4a5b',
                  color: 'white',
                }}
              >
                {curOrder.locationbeautifiedstartdatetime} - {curOrder.locationname}
              </div>
              {NewOrder == null ? <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
                  alignItems: 'center',
                  marginLeft: '0px',
                  fontWeight: 700
                }}
              ></div> : <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
                  alignItems: 'center',
                  marginLeft: '0px',
                  fontWeight: 700
                }}
              ></div>}
              <div
                style={{
                  display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
                  alignItems: 'center',
                  marginLeft: '0px',
                  fontWeight: 700
                }}
              >
                <div>
                  Best nr.:
                </div>
                <div>
                  Kunde
                </div>
                <div>
                  Telefon
                </div>
                <div>
                  Email
                </div>
                <div>
                  Oprettet:
                </div>
                <div>
                  Ændret:
                </div>
                 <div>
                  Betalt:
                </div>
              </div>

              <div
                style={{
                  marginTop: '30px',
                  marginBottom: '30px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
                  alignItems: 'left',
                }}
              >
                <div>
                  {curOrder.customerorderCode}
                </div>
                <div>
                  {highlightText(curOrder.customerName, searchQuery)}
                </div>
                <div>
                  {curOrder.phone}
                </div>
                <div>
                  {curOrder.email}
                </div>


                {/* <div> */}
                <div>{formatDateToDanish(new Date(curOrder.createddatetime + "Z"))}</div>
                <div>{formatDateToDanish(new Date(curOrder.modifieddatetime + "Z"))}</div>
                <div>{curOrder.payeddatetime ? formatDateToDanish(new Date(curOrder.payeddatetime + "Z")) : ''}</div>

                <div>
                  <img
                    src="/images/edit-icon.png"
                    alt="Ny"
                    onClick={() => handleEditOrder(curOrder)}
                    style={{ cursor: 'pointer', width: '24px', height: '24px' }}
                  />

                </div>
                <div>

                  <img
                    src="/images/delete-icon.png"
                    alt="Ny"
                    onClick={() => handleDeleteOrder(curOrder)}
                    style={{ cursor: 'pointer', width: '24px', height: '24px' }}
                  />

                </div>
              </div>
              <div style={{
                marginTop: '30px',
                marginBottom: '30px',
                backgroundColor: '#17db4e',
                display: 'grid',
                gridTemplateColumns: '1fr 6fr',
                alignItems: 'left',
              }}>
                {curOrder.comment.trim().length > 0 ?
                  <>
                    <div style={{
                      display: 'flex',
                      textAlign: 'left',
                      alignItems: 'center',
                      height: 60,

                      paddingLeft: 20,
                      marginBottom: '30px'
                    }}>
                      <img
                        src="/images/delete-icon.png"
                        alt="Ny"
                        onClick={() => handleRemoveComment(curOrder)}
                        style={{ cursor: 'pointer', width: '24px', height: '24px' }}
                      />
                    </div>
                    <div style={{
                      display: 'flex',
                      textAlign: 'left',
                      alignItems: 'center',
                      height: 60,

                      paddingLeft: 20,
                      marginBottom: '30px'
                    }}>
                      {curOrder.comment}
                    </div>

                  </>
                  : ''}
              </div>

              <div style={{ textAlign: 'left' }}>
                {curOrder.orderlines.map((curOrderLine, lineIndex) => (
                  <div
                    key={lineIndex}
                    style={{
                      border: '1px solid #ccc',
                      padding: '10px',
                      marginBottom: '10px',
                      textAlign: 'left',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 3fr 1fr',
                      alignItems: 'center',
                    }}
                  >
                    <div>{curOrderLine.quantity} stk.</div>
                    <div>
                      {curOrderLine.pizzanumber} {highlightText(curOrderLine.productname, searchQuery)}
                    </div>
                    <div style={{ textAlign: 'right' }}>{curOrderLine.unitprice.toFixed(2).replace('.', ',') + ' kr.'}</div>
                    <div style={{ textAlign: 'right' }}>
                      {(curOrderLine.unitprice * curOrderLine.quantity)
                        .toFixed(2)
                        .replace('.', ',') + ' kr.'}
                    </div>
                  </div>
                ))}

                {/* Display all subtotals */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 3fr 1fr',
                    alignItems: 'center',
                    textAlign: 'left',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    marginTop: '30px',
                  }}
                >
                  <div>Antal pizzaer: {subtotalPizzas}</div>
                  <div>Antal tilbehør: {subtotalToppings}</div>
                  <div></div>

                  <div style={{ textAlign: 'right' }}>Ialt: {subtotal.toFixed(2).replace('.', ',')}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

};

export default AdminOrders;
