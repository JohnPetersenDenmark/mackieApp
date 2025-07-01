import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import axios from 'axios';
import { Order } from '../types/Order';
import config from '../config';
import {AxiosClientGet, AxiosClientPost} from '../types/AxiosClient';

interface ChildComponentProps {
  doNotify: (data: Order) => void;
}

const TestRealTimeUpdate: React.FC<ChildComponentProps> = ({doNotify}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [signalmessage, setSignalmessage] = useState<Order | ''>('');

  



  useEffect(() => {

    
    const fetchOrders = async () => {
      try {
       /*  const url = config.API_BASE_URL + '/Home/orderlist';
        const response = await axios.get<Order[]>(url); */
         const ordersResponse: Order[]= await AxiosClientGet('/Home/orderlist', true);
        const sortedOrders = ordersResponse.sort(
          (a, b) => new Date(b.modifieddatetime).getTime() - new Date(a.modifieddatetime).getTime()
        );
        setOrders(sortedOrders);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();

    const playSound = () => {
      const url: string = config.API_BASE_URL + '/Uploads/PistolShot.mp3';
      const audio = new Audio(url);
      audio.play().catch(err => {
        console.warn("Autoplay blocked, user interaction required:", err);
      });
    };

    const connection = new signalR.HubConnectionBuilder()
      .withUrl( config.API_BASE_URL + "/ordersHub", {
        withCredentials: true
      })
      .build();

    connection.on('NewOrder', (order) => {
      // var x = order;
      setSignalmessage(order);
      doNotify(order);
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
