import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pizza } from '../types/Pizza';
import config from '../config';

// Define Pizza type matching your API data
interface PizzaListProps {
  pizzas: Pizza[];
}

const PizzaList: React.FC<PizzaListProps> = ({ pizzas }) => {
  
     
 
  return ( 

<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
  {pizzas.map(pizza => (
    <div key={pizza.id} >
       <h3>{pizza.pizzanumber + " " + pizza.name}</h3>
      <img 
        src={config.API_BASE_URL  + pizza.imageurl }        
        style={{ width: '30%', height: 'auto', borderRadius: '4px' }}
      />
     
      <p>{pizza.description}</p>
      <p>{pizza.price.toFixed(2).replaceAll('.', ',')}</p>
    </div>
  ))}
</div>
  );
};

export default PizzaList;