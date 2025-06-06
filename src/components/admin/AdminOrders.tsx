import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Order } from '../../types/Order';

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

  const webApiBaseUrl = process.env.REACT_APP_BASE_API_URL;

  useEffect(() => {
    const url: string = webApiBaseUrl + '/Home/orderlist';

    axios
      .get<Order[]>(url)
      .then((response) => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load orders');
        setLoading(false);
        console.error(err);
      });
  }, []);

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
      <div style={{ textAlign: 'center', fontSize: '36px' }}>
        Bestillinger
      </div>

      {orders.map((curOrder, index) => {
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
                gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ marginBottom: '30px', textAlign: 'left' }}>
                  Bestillingsnummer: {curOrder.customerorderCode}
                </div>
              </div>
              <div>
                <div>{curOrder.customerName}</div>
              </div>
              <div>
                <div>{curOrder.phone}</div>
              </div>
              <div>
                <div>{curOrder.email}</div>
              </div>
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
                      display : 'flex' ,
                      textAlign: 'left', 
                      alignItems : 'center', 
                      height : 60,  
                      backgroundColor: '#17db4e', 
                      paddingLeft : 20,
                      marginBottom: '30px'}}>
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
                  <div>{curOrderLine.productname}</div>
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
  );
};

export default AdminOrders;
