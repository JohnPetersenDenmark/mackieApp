import React from "react";

import axios from "axios";
import config from '../config';
import { Order } from '../types/Order';
import { useState } from "react";
import { useEffect } from "react";

type CreateSessionPayload = {
    orderId: string;
    amount: number;
    customerId: string;
    email: string;
    firstName: string;
    lastName: string;
    PaymentCancelUrl: string;
    PaymentSuccessUrl: string
};

declare global {
    interface Window {
        Reepay: any;
    }
}

interface CheckoutProps {

    createdOrderA: Order | null;
}



const FlatpayCheckout: React.FC<CheckoutProps> = ({ createdOrderA }) => {

    const [submitting, setSubmitting] = useState(false);

    /*  if (createdOrderA === null) {
         return null;
     } */

          const getFlatPaySessionId = async (payLoad: CreateSessionPayload) => {
            try {
                const url = config.API_BASE_URL + "/payments/create-session";
                const response = await axios.post(url, payLoad);
                if (response) {
                    let rp = new window.Reepay.EmbeddedCheckout(response.data.id, { html_element: 'rp_container' });
                    rp.addEventHandler(window.Reepay.Event.Accept, (data: any) => {
                        console.log("✅ Payment succeeded", data);
                        // Optionally redirect or update state
                    });

                    rp.addEventHandler(window.Reepay.Event.Cancel, (data: any) => {
                        console.log("⚠️ Payment cancelled", data);
                    });

                    rp.addEventHandler(window.Reepay.Event.Error, (data: any) => {
                        console.error("❌ Payment error", data);
                    });

                    setSubmitting(false);
                } else {
                    alert("No flatpay session id ");
                }
            }
            catch (error: any) {
                console.error("Payment session error:", error.response?.data || error.message);
                alert("Failed to start payment session.");
            }
        }

    useEffect(() => {
        // const checkout = async () => {
        //     // setSubmitting(true);
            if (createdOrderA) {
                const payload: CreateSessionPayload = {
                    orderId: createdOrderA.id.toString(),
                    amount: createdOrderA.totalPrice, // 199.00 DKK
                    customerId: createdOrderA.customerorderCode,
                    email: createdOrderA.email,
                    firstName: "",
                    lastName: createdOrderA.customerName,
                    PaymentCancelUrl: config.PAYMENT_CANCEL_URL,
                    PaymentSuccessUrl: config.PAYMENT_ACCEPT_URL

                };
                getFlatPaySessionId(payload)
            }
        // }

       

       

    }, []);



    return (
        <>
            <div id='rp_container' style={{
                width: '500px', height: '730px'
            }}></div>
            {/*  <button
                onClick={handleCheckout}
                disabled={submitting}
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#8d4a5b',
                  color: 'white',

                  border: 'none',
                  borderRadius: '4px',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                }}
              >
                Betaling
              </button> */}
            {/*  <button
                onClick={handleCheckout}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
            >
                Pay with Frisbii
            </button> */}
        </>
    );
};

export default FlatpayCheckout;
