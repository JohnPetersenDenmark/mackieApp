import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Order } from '../../types/Order';
import { OrderItem } from '../../types/OrderItem';
import TestRealTimeUpdate from '../TestRealTimeUpdate';
import config from '../../config';



const AdminPackingList: React.FC = () => {

  type PizzaGroup = {
    pizzaProductId: number;
    pizzaNumber: string;
    pizzaName: string;
    lines: OrderItem[];
    subtotalNumber: number; // e.g., total price
  };




  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');

  const [ordersWithComment, setOrdersWithComment] = useState<Order[]>([]);

  //const [orderCommentArray, setOrderCommentArray] = useState<string[]>([]);

  const [groupedOrderLinesNoComment, setGroupedOrderLinesNoComment] = useState<PizzaGroup[]>([]);

  //const [groupedOrderLinesWithComment, setGroupedOrderLinesWithComment] = useState<PizzaGroup[]>([]);


  useEffect(() => {
    const url: string = config.API_BASE_URL + '/Home/orderlist';

    axios
      .get<Order[]>(url)

      .then((response) => {

        const filteredByDate = filterOrderByDate(response.data);
        const filteredOrdersByNoComment = filteredByNoComment(filteredByDate);

        const orderLinesArray: OrderItem[] = [];
        filteredOrdersByNoComment.forEach(order => {
          order.orderlines.forEach(orderLine => {
            if (orderLine.producttype === 0)  // type 0 is pizza
            {
              orderLinesArray.push(orderLine)
            }

          });
        });

        const va = GroupOrderLinesByPizzaProductId(orderLinesArray);
        setGroupedOrderLinesNoComment(va);



        const filteredByHaveCommentArray = filteredByHaveComment(filteredByDate);
        setOrdersWithComment(filteredByHaveCommentArray);
        /*   const orderLinesArrayComment: OrderItem[] = [];
          let tmpOrderCommentArray: string[] = [];
  
          filteredByHaveCommentArray.forEach(order => {
            let index = 0;
            order.orderlines.forEach(orderLine => {
              if (orderLine.producttype === 0)  // type 0 is pizza
              {
                orderLinesArrayComment.push(orderLine)
                tmpOrderCommentArray.push(order.comment);
                index++;
              }
  
            });
          }); */

        //setOrderCommentArray(tmpOrderCommentArray);

        /*  const sortedLinesComment = [...orderLinesArrayComment].sort((a, b) => a.productid - b.productid);
         const va1 = GroupOrderLinesByPizzaProductId(sortedLinesComment); */
        // setGroupedOrderLinesWithComment(va1);

        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load orders');
        setLoading(false);
        console.error(err);
      });
  }, []);



  const filteredByNoComment = ((sorders: Order[]) => {

    let filteredOrdersByComment: Order[] = []
    sorders.forEach(order => {
      if (order.comment.trim() === '') {
        filteredOrdersByComment.push(order);
      }
    });
    return filteredOrdersByComment
  })

  const filteredByHaveComment = ((sorders: Order[]) => {

    let filteredOrdersByComment: Order[] = []
    sorders.forEach(order => {
      if (order.comment.trim() !== '') {
        filteredOrdersByComment.push(order);
      }
    });
    return filteredOrdersByComment
  })

  const filterOrderByDate = ((sorders: Order[]) => {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth(); // 0-based
    const day = now.getUTCDate();

    // Create start and end times in UTC
    const startTime = new Date(Date.UTC(year, month, day, 0, 10, 0));  // today 00:10:00 UTC
    const endTime = new Date(Date.UTC(year, month, day, 23, 59, 59));  // today 23:59:59 UTC

    let filteredOrdersByDate: Order[] = []

    sorders.forEach(order => {
      const created = parseDanishDateTime(order.locationstartdatetime); // assumes createdAt is ISO UTC string

      if (created >= startTime && created <= endTime) {
        filteredOrdersByDate.push(order);
      }
    });
    return filteredOrdersByDate
  });



  const GroupOrderLinesByPizzaProductId = ((sorderLines: OrderItem[]) => {
    const grouped: PizzaGroup[] = [];

    sorderLines.forEach(orderLine => {
      const group = grouped.find(tmpGroup => tmpGroup.pizzaProductId === orderLine.productid);
      const lineQuantity = orderLine.quantity;

      if (group) {
        group.lines.push(orderLine);
        group.subtotalNumber += lineQuantity;
      } else {
        grouped.push({
          pizzaProductId: orderLine.productid,
          pizzaName: orderLine.productname,
          pizzaNumber: orderLine.pizzanumber,
          lines: [orderLine],
          subtotalNumber: lineQuantity
        });
      }
    });
    return grouped;
  });

  function parseDanishDateTime(dateTimeStr: string): Date {
    // Split into date and time
    const [dateStr, timeStr] = dateTimeStr.split(' ');

    // Parse date part
    const [day, month, year] = dateStr.split('-').map(Number);

    // Parse time part
    const [hour, minute] = timeStr.split(':').map(Number);

    // JS Date months are 0-indexed
    return new Date(year, month - 1, day, hour, minute);
  }


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
        width: '100%',
        boxSizing: 'border-box',
        marginTop: 50,
         marginLeft: 0,
        overflowX: 'hidden',
      }}
    >
      <div style={{ margin: '20px 0', textAlign: 'left', fontSize: '30px', color : '#8d4a5b' , fontWeight: 700}}> Standard</div>

      <div style={{ margin: '20px 0', textAlign: 'left' }}>
        {groupedOrderLinesNoComment?.map((group, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid grey',
              borderRadius: '4px',
              padding: '10px 15px',
              marginBottom: '20px',
              fontWeight: 200,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: '1 1 30%', minWidth: '100px', textAlign: 'left' }}>
              {group.pizzaNumber}
            </div>
            <div style={{ flex: '2 1 20%', minWidth: '150px', textAlign: 'left' }}>
              {group.pizzaName}
            </div>
            <div style={{ flex: '3 1 50%', minWidth: '150px', textAlign: 'right' }}>
              {group.subtotalNumber}
            </div>
          </div>
        ))}
      </div>



      <div style={{ margin: '20px 0', textAlign: 'left', fontSize: '30px', color : '#8d4a5b' , fontWeight: 700 }}>Special</div>

      <div style={{ margin: '20px 0', textAlign: 'left' }}>
        {ordersWithComment?.map((order, idx) => (
          <div
            key={order.customerorderCode}
            style={{
              border: '1px solid grey',
              borderRadius: '6px',
              background: '#8d4a5b',
              padding: '15px',
              marginBottom: '30px',
              fontWeight : 700,
              color : '#ffffff'
            }}
          >
            {/* Order Header */}
            <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px' }}>
              <div style={{ flex: '1 1 30%', minWidth: '100px' }}>{order.customerorderCode}</div>
              <div style={{ flex: '2 1 20%', minWidth: '150px' }}>{order.customerName}</div>
              <div style={{ flex: '3 1 50%', minWidth: '150px'  ,  background: 'green'}}>{order.comment}</div>
            </div>

            {/* Order Lines */}
            {order.orderlines.map((orderLine, lineIndex) => (
              <div
                key={`${order.customerorderCode}-${lineIndex}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px',
                  borderTop: '1px solid #ccc',
                  fontWeight : 200,
                  flexWrap: 'wrap',
                  background: '#fff',
                  color : '#000000'
                }}
              >
                <div style={{ flex: '1 1 30%', minWidth: '150px' }}>{orderLine.pizzanumber}</div>
                <div style={{ flex: '2 1 20%', minWidth: '150px' }}>{orderLine.productname}</div>
                <div style={{ flex: '3 1 50%', minWidth: '100px' , textAlign: 'right'  }}>{orderLine.quantity}</div>
              </div>
            ))}
          </div>
        ))}
      </div>

    </div>
  );



}

export default AdminPackingList