import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import config from "../config";
import { Order } from "../types/Order";

type CreateSessionPayload = {
    orderId: string;
    amount: number;
    customerId: string;
    email: string;
    firstName: string;
    lastName: string;
    PaymentCancelUrl: string;
    PaymentSuccessUrl: string;
};

declare global {
    interface Window {
        Reepay: any;
    }
}


interface CheckoutProps {
    createdOrderA: Order | null;
    onClose: () => void;
}

const FlatpayCheckout: React.FC<CheckoutProps> = ({ createdOrderA, onClose }) => {


   // const [submitting, setSubmitting] = useState(false);
    const didRun = useRef(false);

    let rp: any;

    useEffect(() => {
        if (!createdOrderA || didRun.current) return;

        didRun.current = true;

        const getFlatPaySessionId = async (payLoad: CreateSessionPayload) => {
            try {
              
                const url = config.API_BASE_URL + "/payments/create-session";
                const response = await axios.post(url, payLoad);

                rp = new window.Reepay.EmbeddedCheckout(response.data.id, {
                    html_element: "rp_container",
                });

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

               
            } catch (error: any) {
                console.error(
                    "Payment session error:",
                    error.response?.data || error.message
                );
                alert("Failed to start payment session.");               
            }
        };

        // Prepare payload once we have the order
        const payload: CreateSessionPayload = {
            orderId: createdOrderA.id.toString(),
            amount: createdOrderA.totalPrice * 100,
            customerId: createdOrderA.customerorderCode,
            email: createdOrderA.email,
            firstName: "",
            lastName: createdOrderA.customerName,
            PaymentCancelUrl: config.PAYMENT_CANCEL_URL,
            PaymentSuccessUrl: config.PAYMENT_ACCEPT_URL,
        };
        getFlatPaySessionId(payload);
    }, [createdOrderA]); // Runs only when createdOrderA changes

    const handleCloseThisWindow = () => {
        rp.removeEventHandler(window.Reepay.Event.Accept);
        rp.removeEventHandler(window.Reepay.Event.Cancel);
        rp.removeEventHandler(window.Reepay.Event.Error);
        onClose();
    };

    if (!createdOrderA) return null;

    return (
        <>
            <div id="rp_container" style={{ marginLeft: '50px', marginBottom: '-200px', width: "500px", height: "1000px" }} >
            </div>

            <div style={{ marginLeft: '70px', width: "500px", height: "20px" }}>
                <button
                    onClick={handleCloseThisWindow}
                    // disabled={submitting}
                    style={{
                        marginTop: '1rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#8d4a5b',
                        color: 'white',

                        border: 'none',
                        borderRadius: '4px',
                        // cursor: submitting ? 'not-allowed' : 'pointer',
                        cursor: 'pointer',
                    }}
                >
                    Luk
                </button>
            </div>

        </>
    );
};

export default FlatpayCheckout;
