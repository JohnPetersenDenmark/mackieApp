import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Order } from '../../types/Order';
import TestRealTimeUpdate from '../TestRealTimeUpdate';

interface AdminOrdersProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isEditOrderModalOpen, setsEditOrderModalOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');

  const webApiBaseUrl = process.env.REACT_APP_BASE_API_URL;

  useEffect(() => {
    const url: string = webApiBaseUrl + '/Home/orderlist';

    axios
      .get<Order[]>(url)
 
      .then((response) => {
        const sortedOrders1 = response.data.map(order => ({

        }));

        const sortedOrders = response.data.sort((a, b) => {    
          const timeDiffInMilliSeconds = new Date(b.modifieddatetime).getTime() - new Date(a.modifieddatetime).getTime();
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
  }, []);

  const filteredOrders = orders.filter(order => {
    const orderIdMatches = order.customerorderCode.toString().includes(searchQuery);
    const customerNameMatches = order.customerName?.toLowerCase().includes(searchQuery.toLowerCase());
    const truckLocationMatches = order.phone?.toLowerCase().includes(searchQuery.toLowerCase());
    const orderLineMatches = order.orderlines?.some(line =>
      line.productname.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return orderIdMatches || customerNameMatches || orderLineMatches || truckLocationMatches;
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

  function formatDateToDanish(date: Date) {
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getFullYear()} ${date
        .getHours()
        .toString()
        .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
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
          const url = webApiBaseUrl + '/Admin/removecation/' + order.id;
          await axios.delete(url);
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



  return (   
    <div>
    <TestRealTimeUpdate />
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

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ marginBottom: '30px', textAlign: 'left' }}>
                  Bestillingsnummer: {curOrder.customerorderCode}
                </div>
              </div>
              <div>
                {/* <div>{curOrder.customerName}</div> */}
                <div>{highlightText(curOrder.customerName, searchQuery)}</div>
              </div>
              <div>
                <div>{curOrder.phone}</div>
              </div>
              <div>
                <div>{curOrder.email}</div>
              </div>


              {/* <div> */}
              <div>{'Oprettet: ' + formatDateToDanish(new Date(curOrder.createddatetime))}</div>
              <div>{'Ændret: ' + formatDateToDanish(new Date(curOrder.modifieddatetime))}</div>
              {/* </div> */}


              <div>
                <button
                  onClick={() => handleEditOrder(curOrder)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#8d4a5b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Rediger
                </button>
              </div>
              <div>
                <button
                  onClick={() => handleDeleteOrder(curOrder)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#8d4a5b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Slet
                </button>
              </div>
            </div>
            <div>
              {curOrder.comment.trim().length > 0 ?
                <div style={{
                  display: 'flex',
                  textAlign: 'left',
                  alignItems: 'center',
                  height: 60,
                  backgroundColor: '#17db4e',
                  paddingLeft: 20,
                  marginBottom: '30px'
                }}>
                  {curOrder.comment}
                </div>
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
                    gridTemplateColumns: '1fr 1fr 1fr 1fr',
                    alignItems: 'center',
                  }}
                >
                  <div>{curOrderLine.quantity} stk.</div>
                  <div>{highlightText(curOrderLine.productname, searchQuery) }</div>
                  <div>{curOrderLine.unitprice.toFixed(2).replace('.', ',')}</div>
                  <div>
                    {(curOrderLine.unitprice * curOrderLine.quantity)
                      .toFixed(2)
                      .replace('.', ',')}
                  </div>
                </div>
              ))}

              {/* Display all subtotals */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr ',
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

                <div>Ordrebeløb: {subtotal.toFixed(2).replace('.', ',')}</div>
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
