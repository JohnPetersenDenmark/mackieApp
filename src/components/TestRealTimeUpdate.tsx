import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import axios from 'axios';
import { Order } from '../types/Order';


const TestRealTimeUpdate: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [signalmessage, setSignalmessage] = useState<string>('');

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

    const playSound = () => {
      const url: string = webApiBaseUrl + '/Uploads/PistolShot.mp3';
      const audio = new Audio(url);
      audio.play().catch(err => {
        console.warn("Autoplay blocked, user interaction required:", err);
      });
    };

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://192.168.8.105:5000/ordersHub", {
        withCredentials: true
      })
      .build();

    connection.on('NewOrder', (order) => {
      // var x = order;
      setSignalmessage(order);
       playSound();
      console.log("New order");
    });

    connection.start()
      .then(() => {
        console.log("SignalR connected!");
        //  connection.invoke("SendMessage", "user1", "Hello from plain JS!");
      })
      .catch(err => console.error(err));

    connection.onclose(async () => {
      console.warn("Disconnected. Reconnecting...");
      try {
        await connection.start();
        console.log("Reconnected!");
      } catch (err) {
        console.error("Reconnect failed:", err);
      }
    });

    return () => {
      connection.stop();
    };
  }, []);

  return (
    <></>
   /*  <div className="p-4">
      <h1 className="text-2xl mb-4">Orders</h1>
      {signalmessage}
      <ul>
        {orders.map(order => (
          <li key={order.id} className="border-b py-2">
            <strong>{order.customerName}</strong> ordered a{' '}
          </li>
        ))}
      </ul>
    </div> */
  );
};

export default TestRealTimeUpdate;
