import React from 'react';

interface Pizza {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface CartProps {
  cartItems: Pizza[];
  onRemove: (index: number) => void;
}

export default function Cart({ cartItems, onRemove }: CartProps) {
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="pizzaCard">
      <h2>Your Cart</h2>
      {cartItems.length === 0 && <p>Cart is empty.</p>}
      <ul>
        {cartItems.map((item, idx) => (
          <li key={idx}>
            {item.name} - ${item.price.toFixed(2)}{' '}
            <button onClick={() => onRemove(idx)}>Remove</button>
          </li>
        ))}
      </ul>
      <h3>Total: ${total.toFixed(2)}</h3>
    </div>
  );
}