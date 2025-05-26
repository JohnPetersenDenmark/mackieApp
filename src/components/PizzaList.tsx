import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Define Pizza type matching your API data
interface Pizza {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
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

<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
  {pizzas.map(pizza => (
    <div key={pizza.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
       <h3>{pizza.name}</h3>
      <img 
        src={pizza.imageUrl }        
        style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
      />
     
      <p>{pizza.description}</p>
    </div>
  ))}
</div>
  );
};

export default PizzaList;