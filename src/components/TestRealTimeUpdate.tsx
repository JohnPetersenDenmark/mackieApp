import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import axios from 'axios';
import { Order } from '../types/Order';

const TestRealTimeUpdate: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const webApiBaseUrl = process.env.REACT_APP_BASE_API_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const url = webApiBaseUrl + '/Home/orderlist';
        const response = await axios.get<Order[]>(url);
        const sortedOrders = response.data.sort(
          (a, b) => new Date(b.modifieddatetime).getTime() - new Date(a.modifieddatetime).getTime()
        );
        setOrders(sortedOrders);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://192.168.8.105:5000/ordersHub")
      .withHubProtocol(signalR.JsonHubProtocol)
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => {
        console.log('SignalR Connected');
        connection.on('NewOrder', (order) => {
          setOrders(prev => [order, ...prev]);
        });
      })
      .catch(err => console.error('SignalR Connection Error: ', err));

    connection.onclose(error => {
      if (error) {
        console.error('SignalR connection closed with error:', error);
      } else {
        console.log('SignalR connection closed.');
      }
    });

    return () => {
      connection.stop();
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Orders</h1>
      <ul>
        {orders.map(order => (
          <li key={order.id} className="border-b py-2">
            <strong>{order.customerName}</strong> ordered a{' '}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestRealTimeUpdate;
