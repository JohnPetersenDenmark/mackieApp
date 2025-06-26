

import { Link } from 'react-router-dom';
import { Outlet } from "react-router-dom";
import TruckLocationList from './TruckLocationList';
import config from '../config';
import TermsOfSale from './TermsOfSale';

import React, { useEffect, useState } from 'react';
import OrderModal from './OrderModal';
import { Pizza } from '../types/Pizza';
import { Topping } from '../types/Topping';
import axios from 'axios';
import PizzaList from './PizzaList';
import Login from './Login';
import PizzaToppingList from './PizzaToppingList';
import { TruckLocation } from '../types/TruckLocation';
import CheckMyOrder from './CheckMyOrder';
import AdminDashBoard from './admin/AdminDashBoard';
import { Order } from '../types/Order';

interface LayoutProps {
  children: React.ReactNode;
}

// export default function Layout({ children }: LayoutProps) {

export default function Layout() {



  const [toppings, setToppings] = useState<Topping[]>([]);
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [order, setOrder] = useState<Order | null>(null);


  const [locations, setLocations] = useState<TruckLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);



  useEffect(() => {
    axios.get<Pizza[]>(config.API_BASE_URL + '/Home/pizzalist')
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

    axios.get<Topping[]>(config.API_BASE_URL + '/Home/toppinglist')
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

    axios.get<TruckLocation[]>(config.API_BASE_URL + '/Home/truckcalendarlocationlist')
      .then(response => {
        const sortedTruckcalendarlocations = response.data.sort((a, b) => {
          //    const timeDiffInMilliSeconds = new Date(b.startdatetime + "Z").getTime() - new Date(a.startdatetime + "Z").getTime();
          const timeDiffInMilliSeconds = parseDanishDateTime(a.startdatetime).getTime() - parseDanishDateTime(b.startdatetime).getTime();
          return timeDiffInMilliSeconds;
        });
        setLocations(sortedTruckcalendarlocations);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load locations');
        setLoading(false);
        console.error(err);
      });

  }, []);

  function parseDanishDateTime(dateTimeStr: string): Date {
    // Split into date and time
    const [datePart, timePart] = dateTimeStr.split(' '); // "20-05-2025" and "14:30"
    const [day, month, year] = datePart.split('-').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);

    return new Date(year, month - 1, day, hours, minutes);
  }

  const handleLoggedIn = (loggedIn: boolean) => {
    setLoggedIn(loggedIn)
  }

  const handleOrderFetched = (orderData: Order) => {
    setOrder(orderData);
    setIsCheckOrderModalOpen(false);
    setIsOrderModalOpen(true);  // open the order
  };
  const [isOrderModalOpen, setIsOrderModalOpen] = React.useState(false);
  const handleOrderClick = () => {
    setIsOrderModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleCloseTermsOfSaleModal = () => {
    setIsTermsOfSaleModalOpen(false);
  };

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseOrderModal = () => {
    setIsOrderModalOpen(false);
    setOrder(null);
  };

  const handleCloseCheckOrder = () => {
    setIsOrderModalOpen(false);
    setOrder(null);
  };

  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);
  const [isCheckOrderModalOpen, setIsCheckOrderModalOpen] = React.useState(false);
  const [isTermsOfSaleModalOpen, setIsTermsOfSaleModalOpen] = React.useState(false);

  const handleCheckOrderClick = () => {
    setIsCheckOrderModalOpen(true);
  };

  const handleTermsOfSaleClick = () => {
    setIsTermsOfSaleModalOpen(true);
  };

  const handleCheckCloseOrderModal = () => {
    setIsCheckOrderModalOpen(false);
    setOrder(null);
  };

  return (

    <>
      <main>
        <Outlet />
      </main>

      {/* <div style={{ fontFamily: 'Arial, sans-serif' }}> */}


      {loggedIn ? (
        <AdminDashBoard />
      ) : (
        <>
          {!order && (
            <CheckMyOrder
              isOpen={isCheckOrderModalOpen}
              onOrderFetched={handleOrderFetched}
              onClose={handleCheckCloseOrderModal}
            />
          )}

          {order && (
            <OrderModal
              existingOrder={order}
              locations={locations}
              pizzas={pizzas}
              toppings={toppings}
              isOpen={isOrderModalOpen}
              onClose={handleCloseOrderModal}
            />
          )}

          <OrderModal
            existingOrder={order}
            locations={locations}
            pizzas={pizzas}
            toppings={toppings}
            isOpen={isOrderModalOpen}
            onClose={handleCloseOrderModal}
          />

          <Login
            isOpen={isLoginModalOpen}
            onLoggedIn={handleLoggedIn}
            onClose={handleCloseLoginModal}
          />

          <TermsOfSale
            isOpen={isTermsOfSaleModalOpen}
            onClose={handleCloseTermsOfSaleModal}
          />

          {/* HEADER */}
          {/*   <header style={{ background: '#8d4a5b', padding: '1rem', color: '#22191b', height: '50px', display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '1rem' }}>
              <div style={{ background: '#8d4a5b', padding: '1rem', fontSize: '24px', margin: 0 }}>Mackie's Pizza Truck</div>
              <div style={{ background: '#8d4a5b', padding: '1rem' }}>
                
                <span onClick={handleCheckOrderClick} style={{   cursor: 'pointer', color: '#22191b' }}>
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
          </header> */}

          {/* HEADER */}
          {/*  <header
            style={{
              background: '#8d4a5b',
              padding: '1rem',
              color: '#22191b',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
            }}
          > */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',        // enables wrapping to new line
              alignItems: 'center',
              gap: '0rem',
            }}
          >
            <div
              style={{
                flex: '1 1 250px',    // try to take at least 250px, can grow/shrink
                background: '#8d4a5b',
                padding: '1rem',
                fontSize: '24px',
                margin: 0,
              }}
            >
              Mackie's Pizza Truck
            </div>

            <div style={{ flex: '1 1 250px', background: '#8d4a5b', padding: '1rem', margin: 0, fontSize: '24px', }}>
              <span
                onClick={handleTermsOfSaleClick}
                style={{ cursor: 'pointer', color: '#22191b' }}
              >
                Handelsbetingelser
              </span>
            </div>

            <div style={{ flex: '1 1 250px', background: '#8d4a5b', padding: '1rem', margin: 0, fontSize: '24px', }}>
              <span
                onClick={handleCheckOrderClick}
                style={{ cursor: 'pointer', color: '#22191b' }}
              >
                Se min bestilling
              </span>
            </div>

            <div style={{ flex: '1 1 250px', background: '#8d4a5b', padding: '1rem', fontSize: '24px', }}>
              <a
                href="https://www.facebook.com/profile.php?id=61570093418685"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
                  alt="Facebook"
                  style={{ height: '24px', width: '24px' }}
                />
              </a>
            </div>
          </div>
          {/* </header> */}


          {/* MAIN GRID SECTION */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',     // allow wrapping if needed on small screens
              gap: '0rem',
            }}
          >
            {/* Left empty column */}
            <div style={{ flex: '1 1 0', background: '#c7a6ac', padding: '0rem' }} />

            {/* Middle column */}
            <div
              style={{
                flex: '2 1 400px',  // wider column for content
                background: '#c7a6ac',
                padding: '0rem',
                fontSize: '34px',
                margin: 0,
              }}
            >
              <p style={{ textAlign: 'center', fontSize: '34px' }}>
                Nyd smagen af den originale Mackie's Pizza
              </p>
              <p style={{ fontSize: '15px' }}>
                Er der noget bedre end smagen af den originale Mackie's Pizza?
              </p>
              <p style={{ fontSize: '15px' }}>
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
                <TruckLocationList locations={locations} />
              </p>
              <p style={{ textAlign: 'center', fontSize: '20px', fontWeight: 700, color: '#ffffff' }}>
                Den originale Mackie's Pizza
              </p>
              <p style={{ textAlign: 'center', fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
                Det er nemt og originalt
              </p>
         

             <PizzaList pizzas={pizzas} />

              


              <p
                style={{
                  textAlign: 'center',
                  fontSize: '25px',
                  color: '#22191b',
                  fontWeight: 700,
                }}
              >
                Du kan få det som du vil ha' det..
              </p>
              <p style={{ textAlign: 'center', fontSize: '25px', color: '#22191b' }}>
                <img
                  src={config.API_BASE_URL + '/Uploads/PizzaTruck.png'}
                  alt="Pizza Truck"
                  style={{ width: '300px', height: 'auto' }}
                />
              </p>
              <p
                style={{
                  textAlign: 'center',
                  fontSize: '15px',
                  color: '#22191b',
                  fontWeight: 700,
                }}
              >
                Mackie´s Pizza Bag-Selv
              </p>
              <p
                style={{
                  textAlign: 'center',
                  fontSize: '15px',
                  color: '#22191b',
                  fontWeight: 700,
                }}
              >
                Tag din velsmagende frisklavet pizza med hjem, bagen den og nyd den rygende varm.
              </p>
              <p
                style={{
                  textAlign: 'center',
                  fontSize: '15px',
                  color: '#22191b',
                  fontWeight: 700,
                }}
              >
                Kom forbi vores food truck eller bestil her på hjemmesiden.
              </p>
            </div>



            {/* Right empty column */}
            <div style={{ flex: '1 1 0', background: '#c7a6ac', padding: '0rem', fontSize: '34px', margin: 0 }} />
          </div>


          {/* FOOTER */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0rem',
              background: '#8d4a5b',
              color: '#ffffff',
            }}
          >
            <div style={{ flex: '1 1 150px', padding: '1rem', fontSize: '15px', margin: 0 }}>
              <p>
                <span onClick={handleLoginClick} style={{ cursor: 'pointer', color: '#ffffff' }}>
                  Mackies Pizza Truck
                </span>
              </p>
              <p>{new Date().getFullYear()} Mackie's Pizza Truck</p>
            </div>

            <div style={{ flex: '1 1 150px', padding: '1rem', fontSize: '15px', margin: 0 }}>
              <p>Cvr nr.:</p>
              <p>15475285</p>
            </div>

            <div style={{ flex: '1 1 150px', padding: '1rem', fontSize: '15px', margin: 0 }}>
              <p>Adresse:</p>
              <p>Østergade 10, 8983 Gjerlev J</p>
            </div>

            <div style={{ flex: '1 1 150px', padding: '1rem', fontSize: '15px', margin: 0 }}>
              <p>Telefon:</p>
              <p>+45 5152 1216</p>
            </div>

            <div style={{ flex: '1 1 150px', padding: '1rem', fontSize: '15px', margin: 0 }}>
              <p>Email:</p>
              <p>admin@mackies-pizza.dk</p>
            </div>

            <div style={{ flex: '1 1 150px', padding: '1rem', fontSize: '15px', margin: 0 }}>
              <p>MobilePay:</p>
              <p>5152 1216</p>
            </div>
          </div>



        </>
      )
      }
      {/* </div > */}
    </>
  );
}
