// PizzaList.tsx
import React from 'react';
import { Pizza } from '../types/Pizza';
import config from '../config';

interface PizzaListProps {
  pizzas: Pizza[];
}

const PizzaList: React.FC<PizzaListProps> = ({ pizzas }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
      }}
    >
      {pizzas.map((pizza) => (
        <div
          key={pizza.id}
          style={{
            fontSize: '14px',
            background: '#8d4a5b',
            color: '#ffffff',
            padding: '1rem',
            borderRadius: '0.5rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '320px',
          }}
        >
          <h3 style={{ marginTop: 0 }}>
            {pizza.pizzanumber} {pizza.name}
          </h3>

          <div
            style={{
              width: '100%',
              height: '250px',
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

          <p style={{ flexGrow: 1 }}>{pizza.description}</p>

          <p style={{ fontWeight: 600 }}>{pizza.price.toFixed(2).replace('.', ',')} kr</p>
        </div>
      ))}
    </div>
  );
};

export default PizzaList;
