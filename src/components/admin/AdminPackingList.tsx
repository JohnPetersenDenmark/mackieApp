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

    const [orderCommentArray, setOrderCommentArray] = useState<string[]>([]);

  const [groupedOrderLinesNoComment, setGroupedOrderLinesNoComment] = useState<PizzaGroup[]>([]);

   const [groupedOrderLinesWithComment, setGroupedOrderLinesWithComment] = useState<PizzaGroup[]>([]);


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
        const orderLinesArrayComment: OrderItem[] = [];
          let tmpOrderCommentArray : string[] = [];

        filteredByHaveCommentArray.forEach(order => {
          let index = 0;
          order.orderlines.forEach(orderLine => {
            if (orderLine.producttype === 0)  // type 0 is pizza
            {
              orderLinesArrayComment.push(orderLine)
              tmpOrderCommentArray.push(order.comment);
              index ++;
            }

          });
        });

        setOrderCommentArray(tmpOrderCommentArray);
        
        const sortedLinesComment = [...orderLinesArrayComment].sort((a, b) => a.productid - b.productid);
         const va1 = GroupOrderLinesByPizzaProductId(sortedLinesComment);
        setGroupedOrderLinesWithComment(va1);

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
      const created = parseDanishDateTime(order.locationstartdatetime ); // assumes createdAt is ISO UTC string

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
        width: '100vw',
        boxSizing: 'border-box',
        margin: 0,
        overflowX: 'hidden',
      }}
    >
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
            <div style={{ flex: '2 1 40%', minWidth: '150px', textAlign: 'left' }}>
              {group.pizzaName}
            </div>
            <div style={{ flex: '1 1 20%', minWidth: '80px', textAlign: 'right' }}>
              {group.subtotalNumber}
            </div>
          </div>
        ))}
      </div>


<div style={{ margin: '20px 0', textAlign: 'left' }}>
        {groupedOrderLinesWithComment?.map((group, idx) => (
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
            <div style={{ flex: '2 1 40%', minWidth: '150px', textAlign: 'left' }}>
              {group.pizzaName}
            </div>
             <div style={{ flex: '2 1 40%', minWidth: '150px', textAlign: 'left' }}>
              {orderCommentArray[idx]}
            </div>
            <div style={{ flex: '1 1 20%', minWidth: '80px', textAlign: 'right' }}>
              {group.subtotalNumber}
            </div>
          </div>
        ))}
      </div>




    </div>
  );



}

export default AdminPackingList