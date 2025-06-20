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
};

interface CheckoutProps {
 
  createdOrderA: Order  | null ;
}



const FrisbiiCheckoutButton: React.FC<CheckoutProps> = ({ createdOrderA }) => {
  /*   const handleCheckout = async () => {
        const payload: CreateSessionPayload = {
            orderId: "order-462",
            amount: 19900, // 199.00 DKK
            customerId: "cust-789",
            email: "jane@example.com",
            firstName: "Jane",
            lastName: "Doe",
        };
 */

        if (createdOrderA === null)
        {
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
        };

        try {
            const url = config.API_BASE_URL + "/payments/create-session";
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
