import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Pizza {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface PizzaListProps {
  onAddToCart: (pizza: Pizza) => void;
}

export default function PizzaList({ onAddToCart }: PizzaListProps) {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);

  useEffect(() => {
    axios.get<Pizza[]>('https://localhost:5001/api/pizza') // your backend API URL
      .then(response => setPizzas(response.data))
      .catch(error => console.error('Error fetching pizzas:', error));
  }, []);

  return (
    <div>
      <h2>Pizza Menu</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {pizzas.map(pizza => (
          <li key={pizza.id} style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
            <h3>{pizza.name}</h3>
            <p>{pizza.description}</p>
            <p><strong>Price:</strong> ${pizza.price.toFixed(2)}</p>
            <button onClick={() => onAddToCart(pizza)}>Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
