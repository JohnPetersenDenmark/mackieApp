import React from 'react';
import { FaFacebookF } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import TruckLocationList from './TruckLocationList';

import PizzaList from './PizzaList';

interface LayoutProps {
  children: React.ReactNode;
}


  const handleClick = () => {
    alert('Button clicked!');
  }


export default function Layout({ children }: LayoutProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif'}}>
      <header style={{   background: '#8d4a5b',   padding: '1rem',   color: '#22191b',   height: '72px',   display: 'flex',  alignItems: 'center' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '4fr 8fr 1fr', gap: '1rem' }}>
            <div style={{ background: '#8d4a5b', padding: '1rem',  fontSize: '24px' ,  margin: 0  }}>Mackie's Pizza Truck</div>
            <div style={{ background: '#8d4a5b', padding: '1rem' }}>Se min bestilling</div>
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
            <div style={{ background: '#c7a6ac', padding: '0rem',  fontSize: '34px' ,  margin: 0  }}>
              <p style={{ textAlign: 'center' ,  fontSize: '34px'}}> 
                Nyd smagen af den originale Mackie's Pizza
              </p>
               <p style={{fontSize: '15px' }}> 
                Er der noget bedre end smagen af den originale Mackie's Pizza?
              </p>
                <p style={{fontSize: '15px' ,}}> 
                  Du finder os på en række udvalgte steder, hvor du kan bestille din Mackie's Pizza på forhånd eller bare komme forbi og tage den rygende varme originale Mackie's Pizza med hjem.
              </p>
              <p style={{fontSize: '15px' }}> 
                 Selvfølgelig kan du også bestille din originale Mackie's Pizza rå og frisklavet, tage den med hjem, og bage og nyde den lige når det passer dig.
              </p>

              <p style={{ textAlign: 'center' ,  fontSize: '20px' }}> 
                Gør som de fleste - Bestil, tag med hjem og bag selv
              </p>

              <p style={{ textAlign: 'center' ,  fontSize: '20px' }}> 
               <button
                  onClick={handleClick}
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
              <p style={{ textAlign: 'center' ,  fontSize: '20px' ,  fontWeight : 700 }}> 
                Her finder du os
              </p>
               <p style={{background: '#c7a6ac', textAlign: 'left' ,  fontSize: '15px' , fontWeight : 700 }}> 
               <TruckLocationList></TruckLocationList>
               </p>
               <p style={{ textAlign: 'center' ,  fontSize: '20px' ,  fontWeight : 700 , color: '#ffffff'}}> 
                Den originale Mackie's Pizza
              </p>
               <p style={{ textAlign: 'center' ,  fontSize: '15px' ,  fontWeight : 700 , color: '#ffffff'}}> 
                Det er nemt og originalt
              </p>
                <p style={{ textAlign: 'left' ,  fontSize: '15px', background: '#8d4a5b', color: '#ffffff'}}> 
               <PizzaList></PizzaList>
               </p>
            </div>           
            <div style={{ background: '#c7a6ac', padding: '0rem',  fontSize: '34px' ,  margin: 0  }}>
            </div>
        </div>
 
      {/* <nav style={{ background: '#c7a6ac', padding: '0.5rem' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
        <Link to="/menu" style={{ marginRight: '1rem' }}>Menu</Link>
        <Link to="/cart">Cart</Link>
      </nav> */}

      <main style={{ padding: '1rem' }}>
      
      </main>

      <footer style={{ background: '#f2f2f2', padding: '1rem', marginTop: '2rem', textAlign: 'center' }}>
        <p>&copy; {new Date().getFullYear()} Mackie's Pizza. Alle rettigheder tilhører Mackie</p>
      </footer>
    </div>
  );
}
