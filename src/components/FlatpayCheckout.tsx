import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import config from "../config";
import { Order } from "../types/Order";
import { Payment } from "../types/Payment";
import { AxiosClientGet, AxiosClientPost, AxiosClientDelete } from '../types/AxiosClient';

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
    createdOrderData: any | null;
    onClose: () => void;
    onPaymentStatus: (payment: Payment) => void;
}

const FlatpayCheckout: React.FC<CheckoutProps> = ({ createdOrderData, onPaymentStatus, onClose }) => {


     const didRun = useRef(false);

    let rp: any;

    useEffect(() => {

        if (createdOrderData == null || didRun.current) {
            return;
        }



          didRun.current = true;

        const getFlatPaySessionId = async (payLoad: CreateSessionPayload) => {
            try {


                let response: any = await AxiosClientPost("/payments/create-session", payLoad, false)

                rp = new window.Reepay.EmbeddedCheckout(response.id, {
                    html_element: "rp_container",
                });

                rp.addEventHandler(window.Reepay.Event.Accept, (data: any) => {
                    console.log("✅ Payment succeeded", data);
                    handlePayment(true, data);
                    // Optionally redirect or update state
                });

                rp.addEventHandler(window.Reepay.Event.Cancel, (data: any) => {
                    console.log("⚠️ Payment cancelled", data);
                    handlePayment(true, data);
                });

                rp.addEventHandler(window.Reepay.Event.Error, (data: any) => {
                    console.error("❌ Payment error", data);
                    handlePayment(true, data);
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
            orderId: createdOrderData.id.toString(),
            amount: createdOrderData.totalPrice * 100,
            customerId: createdOrderData.customerId,
            email: createdOrderData.email,
            firstName: "",
            lastName: createdOrderData.customerName,
            PaymentCancelUrl: config.PAYMENT_CANCEL_URL,
            PaymentSuccessUrl: config.PAYMENT_ACCEPT_URL,
        };

        getFlatPaySessionId(payload);

    }, [createdOrderData]); // Runs only when createdOrderA changes


    const handlePayment = (status: boolean, responseData: any) => {
        const paymentData: Payment = {

            id: 0,
            flatratepaymentsuccess: status,
            orderid: createdOrderData?.id ? createdOrderData.id : 0,
            flatrateinvoicenumber: responseData.invoice,
            flatratecustomernumber: responseData.customer,
            flatratepaymentid: responseData.id,
            flatratepaymentmethod: responseData.payment_method,
            flatratesubscription: responseData.subscription,
            flatratestatusorerror: responseData.error
        }

        onPaymentStatus(paymentData);
        handleCloseThisWindow();
    };

    const handleCloseThisWindow = () => {
        rp.removeEventHandler(window.Reepay.Event.Accept);
        rp.removeEventHandler(window.Reepay.Event.Cancel);
        rp.removeEventHandler(window.Reepay.Event.Error);
        onClose();
    };

    if (!createdOrderData) return null;

    return (
        <>
            <div id="rp_container" style={{ marginBottom: '10px', marginTop: '50px', marginLeft: '40px', marginRight: '40px',  height: "700px" }} >
            </div>

            <div style={{ marginLeft: '40px', width: "500px", height: "20px", marginBottom : '50px' }}>
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
