
import { FaFacebookF } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import TruckLocationList from './TruckLocationList';
import React, { useEffect, useState } from 'react';
import OrderModal from './OrderModal';
import { Pizza } from '../types/Pizza';
import { Topping } from '../types/Topping';
import axios from 'axios';
import PizzaList from './PizzaList';
import PizzaToppingList from './PizzaToppingList';
import { TruckLocation } from '../types/TruckLocation';
import CheckMyOrder from './CheckMyOrder';
import { Order } from '../types/Order';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {


  const [toppings, setToppings] = useState<Topping[]>([]);
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [order, setOrder] = useState<Order | null>(null);


  const [locations, setLocations] = useState<TruckLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get<Pizza[]>('http://192.168.8.105:5000/Home/pizzalist')
      .then(response => {
        const allPizzas = response.data;
        setPizzas(allPizzas);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load pizzas');
        setLoading(false);
        console.error(err);
      });

    axios.get<Topping[]>('http://192.168.8.105:5000/Home/toppinglist')
      .then(response => {
        const allToppings = response.data;
        setToppings(allToppings);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load pizzas');
        setLoading(false);
        console.error(err);
      });

    axios.get<TruckLocation[]>('http://192.168.8.105:5000/Home/locationlist')
      .then(response => {
        setLocations(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load locations');
        setLoading(false);
        console.error(err);
      });

  }, []);



  const handleOrderFetched = (orderData: Order) => {
    setOrder(orderData);
     setIsCheckOrderModalOpen(false);
    setIsOrderModalOpen(true);  // open the order
  };
  const [isOrderModalOpen, setIsOrderModalOpen] = React.useState(false);
  const handleOrderClick = () => {
    setIsOrderModalOpen(true);
  };

  
  const handleCloseOrderModal = () => {
    setIsOrderModalOpen(false);
    setOrder(null);
  };

   const handleCloseCheckOrder = () => {
    setIsOrderModalOpen(false);
    setOrder(null);
  };

  const [isCheckOrderModalOpen, setIsCheckOrderModalOpen] = React.useState(false);
  const handleCheckOrderClick = () => {
    setIsCheckOrderModalOpen(true);
  };
  const handleCheckCloseOrderModal = () => {
    setIsCheckOrderModalOpen(false);
    setOrder(null);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      

      {!order && ( 
        <CheckMyOrder isOpen={isCheckOrderModalOpen} onOrderFetched={handleOrderFetched} onClose={() => handleCheckCloseOrderModal()} ></CheckMyOrder>
      )}

      {order && (
       <OrderModal existingOrder={order} locations={locations} pizzas={pizzas} toppings={toppings} isOpen={isOrderModalOpen} onClose={() => handleCloseOrderModal()} />
        )} 

      <OrderModal existingOrder={order} locations={locations} pizzas={pizzas} toppings={toppings} isOpen={isOrderModalOpen} onClose={() => handleCloseOrderModal()} />
      <header style={{ background: '#8d4a5b', padding: '1rem', color: '#22191b', height: '50px', display: 'flex', alignItems: 'center' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '4fr 8fr 1fr', gap: '1rem' }}>
          <div style={{ background: '#8d4a5b', padding: '1rem', fontSize: '24px', margin: 0 }}>Mackie's Pizza Truck</div>
          <div style={{ background: '#8d4a5b', padding: '1rem' }}>
            <p>

            </p>
            <span onClick={handleCheckOrderClick} style={{ cursor: 'pointer', color: 'blue' }}>
              Se min bestilling
            </span>

          </div>
          <div><a href="https://www.facebook.com/profile.php?id=61570093418685" target="_blank" rel="noopener noreferrer">
            <img
              src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
              alt="Facebook"
              style={{ height: '24px', width: '24px' }}
            />
          </a>
          </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '4fr 8fr 1fr', gap: '0rem' }}>
        <div style={{ background: '#c7a6ac', padding: '0rem' }}>
        </div>
        <div style={{ background: '#c7a6ac', padding: '0rem', fontSize: '34px', margin: 0 }}>
          <p style={{ textAlign: 'center', fontSize: '34px' }}>
            Nyd smagen af den originale Mackie's Pizza
          </p>
          <p style={{ fontSize: '15px' }}>
            Er der noget bedre end smagen af den originale Mackie's Pizza?
          </p>
          <p style={{ fontSize: '15px', }}>
            Du finder os på en række udvalgte steder, hvor du kan bestille din Mackie's Pizza på forhånd eller bare komme forbi og tage den rygende varme originale Mackie's Pizza med hjem.
          </p>
          <p style={{ fontSize: '15px' }}>
            Selvfølgelig kan du også bestille din originale Mackie's Pizza rå og frisklavet, tage den med hjem, og bage og nyde den lige når det passer dig.
          </p>

          <p style={{ textAlign: 'center', fontSize: '20px' }}>
            Gør som de fleste - Bestil, tag med hjem og bag selv
          </p>

          <p style={{ textAlign: 'center', fontSize: '20px' }}>
            <button
              onClick={handleOrderClick}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#8d4a5b',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Bestil og bag selv
            </button>
          </p>
          <p style={{ textAlign: 'center', fontSize: '20px', fontWeight: 700 }}>
            Her finder du os
          </p>
          <p style={{ background: '#c7a6ac', textAlign: 'left', fontSize: '15px', fontWeight: 700 }}>
            <TruckLocationList locations={locations}></TruckLocationList>
          </p>
          <p style={{ textAlign: 'center', fontSize: '20px', fontWeight: 700, color: '#ffffff' }}>
            Den originale Mackie's Pizza
          </p>
          <p style={{ textAlign: 'center', fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
            Det er nemt og originalt
          </p>

        </div>
        <div style={{ background: '#c7a6ac', padding: '0rem', fontSize: '34px', margin: 0 }}>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '4fr 8fr 1fr', gap: '0rem' }}>
        <div style={{ background: '#8d4a5b', padding: '1rem', fontSize: '24px', margin: 0 }}></div>
        <div style={{ background: '#8d4a5b', padding: '1rem' }}>
          <p style={{ textAlign: 'left', fontSize: '15px', background: '#8d4a5b', color: '#ffffff' }}>
            Pizzaer
          </p>
          <p style={{ textAlign: 'left', fontSize: '15px', background: '#8d4a5b', color: '#ffffff' }}>
            <PizzaList pizzas={pizzas}></PizzaList>
          </p>

          {/*         <p style={{ textAlign: 'left' ,  fontSize: '15px', background: '#8d4a5b', color: '#ffffff'}}> 
                  Tilbehør           
               </p>
                 <p style={{ textAlign: 'left' ,  fontSize: '15px', background: '#8d4a5b', color: '#ffffff'}}>               
               <PizzaToppingList pizzaToppings={toppings}></PizzaToppingList>
               </p> */}

        </div>
        <div style={{ background: '#8d4a5b', padding: '1rem', fontSize: '24px', margin: 0 }}></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '4fr 8fr 1fr', gap: '0rem', background: '#c7a6ac' }}>
        <div style={{ padding: '1rem', fontSize: '24px', margin: 0 }}></div>
        <div style={{ padding: '1rem', fontSize: '24px', margin: 0 }}>
          <p style={{ textAlign: 'center', fontSize: '25px', color: '#22191b', fontWeight: 700 }}>
            Du kan få det som du vil ha' det..
          </p>
          <p style={{ textAlign: 'center', fontSize: '25px', color: '#22191b' }}>
            <img
              src="http://192.168.8.105:5000/Uploads/PizzaTruck.png"
              alt="Pizza Truck"
              style={{ width: '400px', height: 'auto' }}
            />
          </p>
          <p style={{ textAlign: 'center', fontSize: '15px', color: '#22191b', fontWeight: 700 }}>
            Mackie´s Pizza Bag-Selv
          </p>
          <p style={{ textAlign: 'center', fontSize: '15px', color: '#22191b', fontWeight: 700 }}>
            Tag din velsmagende frisklavet pizza med hjem, bagen den og nyd den rygende varm.
          </p>
          <p style={{ textAlign: 'center', fontSize: '15px', color: '#22191b', fontWeight: 700 }}>
            Kom forbi vores food truck eller bestil her på hjemmesiden.
          </p>
        </div>

        <div style={{ padding: '1rem', fontSize: '24px', margin: 0 }}></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', gap: '0rem', background: '#8d4a5b', color: '#ffffff' }}>
        <div style={{ padding: '1rem', fontSize: '15px', margin: 0, color: '#ffffff' }}>
          <p>Mackies Pizza Truck</p>
          <p> {new Date().getFullYear()} Mackie's Pizza Truck</p>
        </div>

        <div style={{ padding: '1rem', fontSize: '15px', margin: 0, color: '#ffffff' }}>
          <p>Cvr nr.:</p>
          <p>15475285</p>
        </div>

        <div style={{ padding: '1rem', fontSize: '15px', margin: 0, color: '#ffffff' }}>
          <p>Adresse:</p>
          <p>Østergade 10, 8983 Gjerlev J</p>
        </div>

        <div style={{ padding: '1rem', fontSize: '15px', margin: 0, color: '#ffffff' }}>
          <p>Telefon:</p>
          <p>+45 5152 1216</p>
        </div>

        <div style={{ padding: '1rem', fontSize: '15px', margin: 0, color: '#ffffff' }}>
          <p>Email:</p>
          <p>admin@mackies-pizza.dk</p>
        </div>

        <div style={{ padding: '1rem', fontSize: '15px', margin: 0, color: '#ffffff' }}>
          <p>MobilePay:</p>
          <p>5152 1216</p>
        </div>

      </div>

    </div>
  );
}
