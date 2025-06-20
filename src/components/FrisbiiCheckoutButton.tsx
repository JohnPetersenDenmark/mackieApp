import React from "react";
import axios from "axios";
import config from '../config';
import { Order } from '../types/Order';

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

interface CheckoutProps {

    createdOrderA: Order | null;
}



const FrisbiiCheckoutButton: React.FC<CheckoutProps> = ({ createdOrderA }) => {
 
    if (createdOrderA === null) {
        return null;
    }

    const handleCheckout = async () => {
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

        try {
            const url = config.API_BASE_URL + "/Payments/create-session";
            const response = await axios.post(url, payload);

            const checkoutUrl = response.data.checkoutUrl;
            if (checkoutUrl) {
                window.location.href = checkoutUrl;

            } else {
                alert("No checkout URL returned.");
            }
        } catch (error: any) {
            console.error("Payment session error:", error.response?.data || error.message);
            alert("Failed to start payment session.");
        }
    };

    return (
        <button
            onClick={handleCheckout}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
        >
            Pay with Frisbii
        </button>
    );
};

export default FrisbiiCheckoutButton;
