import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Order } from '../../types/Order';
import TestRealTimeUpdate from '../TestRealTimeUpdate';
import config from '../../config';

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
    const orderLineMatches = order.orderlines?.some(line =>
      line.productname?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return orderIdMatches || customerNameMatches || orderLineMatches;
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
    if (order !== null) {
      const updateOrder = async () => {
        try {
          setSubmitting(true);
          const url = config.API_BASE_URL + '/Home/orderremovecomment';
          await axios.post(url, { id: order.id }, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
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

  // Responsive styles
  const styles = {
    container: {
      border: '1px solid grey',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '20px',
      color: '#22191b',
      fontWeight: 200,
      textAlign: 'center' as const,
      maxWidth: 1200,
      margin: '0 auto',
    },
    headerGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '1rem',
      padding: '0 10px',
    },
    searchInput: {
      width: '100%',
      padding: '0.5rem',
      fontSize: '1.2rem',
      borderWidth: '1.0px',
      borderStyle: 'solid',
      borderRadius: '4px',
      boxSizing: 'border-box' as const,
    },
    title: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#22191b',
      textAlign: 'left' as const,
    },
    orderCard: {
      border: '1px solid #ccc',
      padding: '10px',
      marginBottom: '30px',
      borderRadius: '6px',
    },
    orderHeader: {
      marginBottom: '15px',
      padding: '10px',
      textAlign: 'left' as const,
      fontSize: '22px',
      backgroundColor: '#8d4a5b',
      color: 'white',
      borderRadius: '4px',
      wordBreak: 'break-word' as const,
    },
    ordersGridHeader: {
      display: 'grid',
      gridTemplateColumns: 'repeat(1, 1fr)',
      fontWeight: 700,
      fontSize: '14px',
      marginBottom: '8px',
      padding: '0 5px',
      textAlign: 'left' as const,
    },
    ordersGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      alignItems: 'center',
      fontSize: '14px',
      padding: '0 5px',
      wordBreak: 'break-word' as const,
      gap: '4px',
    },
    icon: {
      cursor: 'pointer',
      width: 24,
      height: 24,
      display: 'inline-block',
    },
    commentBox: {
      marginTop: '15px',
      marginBottom: '15px',
      backgroundColor: '#17db4e',
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      alignItems: 'center',
      padding: '5px 10px',
      borderRadius: '4px',
      wordBreak: 'break-word' as const,
    },
    commentIcon: {
      cursor: 'pointer',
      width: 24,
      height: 24,
      marginRight: '10px',
    },
    orderlineGrid: {
      border: '1px solid #ccc',
      padding: '10px',
      marginBottom: '10px',
       fontSize: '16px',
      textAlign: 'left' as const,
      display: 'grid',
     // gridTemplateColumns: 'auto 1fr auto auto',
        gridTemplateColumns: '1fr',
      alignItems: 'center',
      gap: '8px',
      borderRadius: '4px',
    },
    subtotalGrid: {
      display: 'grid',
      gridTemplateColumns: 'auto auto 1fr auto',
      alignItems: 'center',
      textAlign: 'left' as const,
      fontWeight: 'bold',
      fontSize: '16px',
      marginTop: '20px',
      gap: '10px',
    },
    mark: {
      backgroundColor: 'yellow',
    }
  };

  // Responsive grid columns and styles with media queries
  const mediaQueries = `
    @media (max-width: 768px) {
      .ordersGridHeader {
        display: none;
      }
      .ordersGrid {
        grid-template-columns: 1fr;
        gap: 12px;
      }
      .orderlineGrid {
        grid-template-columns: 1fr 1fr;
        gap: 6px;
      }
      .subtotalGrid {
        grid-template-columns: 1fr 1fr;
        font-size: 14px;
      }
      input[type="text"] {
        font-size: 1rem !important;
      }
    }
  `;

  return (
  <>
    <style>{mediaQueries}</style>
    <div style={{ ...styles.container, width: '100vw', overflowX: 'hidden' }}>
      <TestRealTimeUpdate doNotify={handleNewOrderArrived} />
      <div style={styles.headerGrid}>
        <input
          type="text"
          placeholder="Søg"
          style={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div style={styles.title}>Bestillinger</div>
      </div>

      {/* Inner wrapper to constrain max width and add side padding */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 10px', textAlign: 'left' }}>
        {loading && <div>Loading orders...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}

        {displayedOrders.map((curOrder) => {
          const subtotal = curOrder.orderlines.reduce(
            (sum, line) => sum + line.unitprice * line.quantity,
            0
          );

          const subtotalPizzas = curOrder.orderlines
            .filter((line) => line.producttype === 0)
            .reduce((sum, line) => sum + line.quantity, 0);

          const subtotalToppings = curOrder.orderlines
            .filter((line) => line.producttype === 1)
            .reduce((sum, line) => sum + line.quantity, 0);

          return (
            <div key={curOrder.id} style={styles.orderCard}>
              <div style={styles.orderHeader}>
                {curOrder.locationbeautifiedstartdatetime} - {curOrder.locationname}
              </div>

              <div className="ordersGridHeader" style={styles.ordersGridHeader}>
                <div>Best nr.:  {curOrder.customerorderCode}</div>
                <div>Kunde: {highlightText(curOrder.customerName, searchQuery)}</div>
                <div>Telefon: {curOrder.phone}</div>
                <div>Email: {curOrder.email}</div>
                <div>Oprettet: {formatDateToDanish(new Date(curOrder.createddatetime + "Z"))}</div>
                <div>Ændret: {formatDateToDanish(new Date(curOrder.modifieddatetime + "Z"))}</div>
                <div>{curOrder.payeddatetime ? "Betalt: " + formatDateToDanish(new Date(curOrder.payeddatetime + "Z")) : ''}</div>
                <div> <img
                    src="/images/edit-icon.png"
                    alt="Edit"
                    onClick={() => handleEditOrder(curOrder)}
                    style={styles.icon}
                  /></div>
                <div> <img
                    src="/images/delete-icon.png"
                    alt="Delete"
                    onClick={() => handleDeleteOrder(curOrder)}
                    style={styles.icon}
                  /></div>
              </div>

              {/* <div className="ordersGrid" style={styles.ordersGrid}>
                <div>{curOrder.customerorderCode}</div>
                <div>{highlightText(curOrder.customerName, searchQuery)}</div>
                <div>{curOrder.phone}</div>
                <div>{curOrder.email}</div>
                <div>{formatDateToDanish(new Date(curOrder.createddatetime + "Z"))}</div>
                <div>{formatDateToDanish(new Date(curOrder.modifieddatetime + "Z"))}</div>
                <div>{curOrder.payeddatetime ? formatDateToDanish(new Date(curOrder.payeddatetime + "Z")) : ''}</div>
                <div>
                  <img
                    src="/images/edit-icon.png"
                    alt="Edit"
                    onClick={() => handleEditOrder(curOrder)}
                    style={styles.icon}
                  />
                </div>
                <div>
                  <img
                    src="/images/delete-icon.png"
                    alt="Delete"
                    onClick={() => handleDeleteOrder(curOrder)}
                    style={styles.icon}
                  />
                </div>
              </div> */}

              {curOrder.comment.trim().length > 0 && (
                <div style={styles.commentBox}>
                  <img
                    src="/images/delete-icon.png"
                    alt="Remove Comment"
                    onClick={() => handleRemoveComment(curOrder)}
                    style={styles.commentIcon}
                  />
                  <div>{curOrder.comment}</div>
                </div>
              )}

              <div>
                {curOrder.orderlines.map((curOrderLine, lineIndex) => (
                  <div key={lineIndex} style={styles.orderlineGrid}>
                    <div>{curOrderLine.quantity} stk.</div>
                    <div>
                      {curOrderLine.pizzanumber} {highlightText(curOrderLine.productname, searchQuery)}                   
                    </div>
                    <div style={{ textAlign: 'right' }}>{curOrderLine.unitprice.toFixed(2).replace('.', ',')} kr.</div>
                    <div style={{ textAlign: 'right' }}>
                      {(curOrderLine.unitprice * curOrderLine.quantity)
                        .toFixed(2)
                        .replace('.', ',')} kr.
                    </div>
                  </div>
                ))}

                <div style={styles.subtotalGrid}>
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
  </>
);

};

export default AdminOrders;
