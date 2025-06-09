import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pizza } from '../types/Pizza';

// Define Pizza type matching your API data
interface PizzaToppingListProps {
  pizzaToppings: Pizza[];
}

const PizzaToppingList: React.FC<PizzaToppingListProps> = ({ pizzaToppings }) => {
  
      const webApiBaseUrl = process.env.REACT_APP_BASE_API_URL;
 
  return ( 

<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
  {pizzaToppings.map(pizza => (
    <div key={pizza.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
       <h3>{pizza.name}</h3>
      <img 
        src={webApiBaseUrl  + pizza.imageurl }        
        style={{ width: '50%', height: 'auto', borderRadius: '4px' }}
      />
     
      <p>{pizza.description}</p>
      <p>{pizza.price},-</p>
    </div>
  ))}
</div>
  );
};

export default PizzaToppingList;