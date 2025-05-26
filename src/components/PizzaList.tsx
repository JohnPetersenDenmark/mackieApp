import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Define Pizza type matching your API data
interface Pizza {
  id: number;
  name: string;
  description: string;
  //price: number;
}

const PizzaList: React.FC = () => {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get<Pizza[]>('http://192.168.8.105:5000/Home/pizzalist')
      .then(response => {
        setPizzas(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load pizzas');
        setLoading(false);
        console.error(err);
      });
  }, []);

  if (loading) return <p>Loading pizzas...</p>;
  if (error) return <p>{error}</p>;
 
  return (
    <div>
      
      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {pizzas.map(pizza => (
          <li key={pizza.id} style={{ marginBottom: '1rem' }}>
            <strong>{pizza.name}</strong> 
            <p>{pizza.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PizzaList;