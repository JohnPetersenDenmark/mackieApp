import TruckLocationList from './TruckLocationList';
import config from '../config';
import TermsOfSale from './TermsOfSale';
import { filterTruckLocationsByTodaysDate } from '../types/MiscFunctions';
import { CurrentUser, useCurrentUser } from "../components/CurrentUser";
import { UserDropdown } from "../components/UserDropdown";
import { useDashboardContext } from "./admin/DashboardContext";
import { useLocation } from "react-router-dom";

import React, { useEffect, useState } from 'react';
import OrderModal from './OrderModal';
import { Pizza } from '../types/Pizza';
import { Topping } from '../types/Topping';
import axios from 'axios';
import PizzaList from './PizzaList';
import Login from './Login';

import { TruckLocation } from '../types/TruckLocation';
import CheckMyOrder from './CheckMyOrder';
import AdminDashBoard from './admin/AdminDashBoard';
import { Order } from '../types/Order';
import ClipLoader from 'react-spinners/ClipLoader';
import Privacy from './Privacy';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout() {

  const { user, authStatus } = useCurrentUser();

  const [toppings, setToppings] = useState<Topping[]>([]);
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [order, setOrder] = useState<Order | null>(null);

  const [locations, setLocations] = useState<TruckLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
   const [reload, setReload] = useState(0); 
  
const location = useLocation();

   const { isOpen, setIsOpen } = useDashboardContext();
 useEffect(() => {
    setIsUserDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [pizzasResult, toppingsResult, locationsResult] = await Promise.allSettled([
          axios.get<Pizza[]>(config.API_BASE_URL + '/Home/pizzalist'),
          axios.get<Topping[]>(config.API_BASE_URL + '/Home/toppinglist'),
          axios.get<TruckLocation[]>(config.API_BASE_URL + '/Home/truckcalendarlocationlist'),
          // AxiosClientGet( '/Home/truckcalendarlocationlist' , false)
        ]);

        if (pizzasResult.status === 'fulfilled') {
          setPizzas(pizzasResult.value.data);
        } else {
          setError('Failed to load pizzas');
        }

        if (toppingsResult.status === 'fulfilled') {
          setToppings(toppingsResult.value.data);
        } else {
          setError('Failed to load toppings');
        }

        if (locationsResult.status === 'fulfilled') {
          let locationsFromTodayAndForward = filterTruckLocationsByTodaysDate(locationsResult.value.data);
          const sortedTruckcalendarlocations = locationsFromTodayAndForward.sort((a, b) => parseDanishDateTime(a.startdatetime).getTime() - parseDanishDateTime(b.startdatetime).getTime());
          setLocations(sortedTruckcalendarlocations);
        } else {
          setError('Failed to load locations');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reload]);

  function parseDanishDateTime(dateTimeStr: string): Date {
    // Split into date and time
    const [datePart, timePart] = dateTimeStr.split(' '); // "20-05-2025" and "14:30"
    const [day, month, year] = datePart.split('-').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);

    return new Date(year, month - 1, day, hours, minutes);
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
     setReload(prev => prev + 1);
     window.location.reload();
    setIsLoginModalOpen(false);
  };

  const handleCloseTermsOfSaleModal = () => {
    setIsTermsOfSaleModalOpen(false);
  };

  const handleClosePrivacyModal = () => {
    setIsPrivacyModalOpen(false);
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
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = React.useState(false);
  const [isDashBoardModalOpen, setIsDashboardModalOpen] = React.useState(true);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = React.useState(true);


  const handleCheckOrderClick = () => {
    setIsCheckOrderModalOpen(true);
  };

  const handleDashboardClick = () => {
    setIsDashboardModalOpen(true);
  };

  const handleTermsOfSaleClick = () => {
    setIsTermsOfSaleModalOpen(true);
  };

  const handlePrivacyClick = () => {
    setIsPrivacyModalOpen(true);
  };

  const handleCheckCloseOrderModal = () => {
    setIsCheckOrderModalOpen(false);
    setOrder(null);
  };

  const handleCloseDashboardModal = () => {
    setIsDashboardModalOpen(false);
  };

  const handleCloseUserDropDownModal = () => {
    setIsUserDropdownOpen(false);
  };




  return (
    <>
      <main>
        {/* <Outlet /> */}
      </main>

      {/* {authStatus === 'loggedIn' && user?.displayname === 'John' ?  ( */}

      {authStatus === 'loggedIn' && isOpen ? (
        <AdminDashBoard />
    
      ) :

        (
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
              onClose={handleCloseLoginModal}
            />

            <TermsOfSale
              isOpen={isTermsOfSaleModalOpen}
              onClose={handleCloseTermsOfSaleModal}
            />

            <Privacy
              isOpen={isPrivacyModalOpen}
              onClose={handleClosePrivacyModal} />

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
                  color: '#ffffff',
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
                  style={{ cursor: 'pointer', color:  '#ffffff' }}
                >
                  Handelsbetingelser
                </span>
              </div>

              <div style={{ flex: '1 1 250px', background: '#8d4a5b', padding: '1rem', margin: 0, fontSize: '24px', }}>
                <span
                  onClick={handlePrivacyClick}
                  style={{ cursor: 'pointer', color: '#ffffff' }}
                >
                  Privatlivspolitik
                </span>
              </div>

              <div style={{ flex: '1 1 250px', background: '#8d4a5b', padding: '1rem', margin: 0, fontSize: '24px', }}>
                <span
                  onClick={handleCheckOrderClick}
                  style={{ cursor: 'pointer', color: '#ffffff' }}
                >
                  Se min bestilling
                </span>
              </div>


              {user && (
                <div
                  style={{
                    position: "relative",
                    flex: '1 1 250px',
                    background: '#8d4a5b',
                    color: '#ffffff',
                    padding: '1rem',
                    margin: 0,
                    fontSize: '24px',
                    cursor: "pointer"
                  }}
                  //  style={{ position: "relative", display: "inline-block" , background: '#8d4a5b'}}
                  onClick={() => setIsUserDropdownOpen(prev => !prev)}
                >
                  {user.displayname}
                  {isUserDropdownOpen && <UserDropdown isOpen={isUserDropdownOpen} onClose={handleCloseUserDropDownModal} />}
                </div>
              )}

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
              <div style={{ flex: '1 1 0', background: '#fe9abc', padding: '0rem' }} />

              {/* Middle column */}
              <div
                style={{
                  flex: '2 1 400px',  // wider column for content
                  background: '#fe9abc',
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
             {/*    <p style={{ color: '#ffffff', textAlign: 'center', fontSize: '20px', fontWeight: 700 }}>
                  Her finder du os
                </p> */}
                <p style={{ background: '#fe9abc', textAlign: 'left', fontSize: '15px', fontWeight: 700 }}>
                  <TruckLocationList locations={locations} />
                </p>
                <p style={{ textAlign: 'center', fontSize: '20px', fontWeight: 700, color: '#22191b' }}>
                  Den originale Mackie's Pizza
                </p>
                <p style={{ textAlign: 'center', fontSize: '15px', fontWeight: 700, color: '#22191b' }}>
                  Det er nemt og originalt
                </p>

                {loading && <div><ClipLoader size={50} color="#8d4a5b" /></div>}

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
              <div style={{ flex: '1 1 0', background: '#fe9abc', padding: '0rem', fontSize: '34px', margin: 0 }} />
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

              {/*  <div style={{ flex: '1 1 150px', padding: '1rem', fontSize: '15px', margin: 0 }}>
              <p>Telefon:</p>
              <p>+45 5152 1216</p>
            </div> */}

              <div style={{ flex: '1 1 150px', padding: '1rem', fontSize: '15px', margin: 0 }}>
                <p>Email:</p>
                <p>admin@mackies-pizza.dk</p>
              </div>

              {/*     <div style={{ flex: '1 1 150px', padding: '1rem', fontSize: '15px', margin: 0 }}>
              <p>MobilePay:</p>
              <p>5152 1216</p>
            </div> */}

            </div>
          </>
        )
      }
      {/* </div > */}
    </>
  );
}
