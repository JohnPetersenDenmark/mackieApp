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
<div
  style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    justifyContent: 'center',
  }}
>
  {pizzas.map((pizza) => (
    <div
      key={pizza.id}
      style={{
        flex: '1 1 200px',
        background: '#c7a6ac',
        padding: '1rem',
        borderRadius: '0.5rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '320px', // uniform height
      }}
    >
      {/* Title */}
      <h3 style={{ marginTop:  0 }}>{pizza.pizzanumber + ' ' + pizza.name}</h3>

      {/* Image container */}
      <div
        style={{
          width: '100%',
          height: '250px', // fixed image height
          overflow: 'hidden',
          borderRadius: '4px',
          marginBottom: '0.5rem',
        }}
      >
        <img
          src={config.API_BASE_URL + pizza.imageurl}
          alt={pizza.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>

      {/* Description */}
      <p style={{ flexGrow: 1 }}>{pizza.description}</p>

      {/* Price */}
      <p style={{ fontWeight: 600 }}>{pizza.price.toFixed(2).replace('.', ',')} kr</p>
    </div>
  ))}
</div>


  );
};

export default PizzaList;