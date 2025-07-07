import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import axios from 'axios';
import { Order } from '../types/Order';
import config from '../config';
import { AxiosClientGet, AxiosClientPost } from '../types/AxiosClient';

interface ChildComponentProps {
  doNotify: (data: Order) => void;
}

const TestRealTimeUpdate: React.FC<ChildComponentProps> = ({ doNotify }) => {

  const remoteLog = async (message: string, orderData: any) => {
    let logData = {
      message: message,
      data: JSON.stringify(orderData),
      time: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }

    try {
      const response = await AxiosClientPost("/Login/clientlog", logData, true);
    } catch (error) {
      console.error(error);
    } finally {

    }
  };


  useEffect(() => {
    const playSound = () => {
      const url: string = config.API_BASE_URL + '/Uploads/PistolShot.mp3';
      const audio = new Audio(url);
      audio.play()
        .then(() => {
          remoteLog("Audio played successfully", null);
        })
        .catch((err) => {
          remoteLog("Audio play failed: Autoplay blocked or error occurred", { error: err });
          console.warn("Autoplay blocked or audio failed:", err);
        });
    };


    const connection = new signalR.HubConnectionBuilder()
      .withUrl(config.API_BASE_URL + "/ordersHub", {
        withCredentials: true
      })
      .build();

    connection.on('NewOrder', (order) => {
      doNotify(order);
      playSound();
      remoteLog("New order received", order);

      console.log("New order");
    });

    connection.start()
      .then(() => {
        console.log("SignalR connected!");
        remoteLog("SignalR connected!", null);
      })
      .catch(err => {
        remoteLog("SignalR connection failed", { error: err.message });
        console.error(err);
      });

    connection.onclose(async () => {
      remoteLog("SignalR disconnected", null);
      console.warn("Disconnected. Reconnecting...");
      try {
        await connection.start();
        remoteLog("SignalR reconnected", null);
        console.log("Reconnected!");
      } catch (err) {
        remoteLog("SignalR reconnect failed", { error: err });
        console.error("Reconnect failed:", err);
      }
    });

    return () => {
      connection.stop();
      remoteLog("SignalR connection stopped", null);
    };
  }, []);

  return (
    <></>

  );
};

export default TestRealTimeUpdate;
