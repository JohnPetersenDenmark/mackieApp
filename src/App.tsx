import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PizzaList from './components/PizzaList';
import Cart from './components/Cart';

interface Pizza {
  id: number; 
  name: string;
  description: string;
  price: number;
}

function App() {
  const [cart, setCart] = useState<Pizza[]>([]);

  const handleAddToCart = (pizza: Pizza) => setCart(prev => [...prev, pizza]);
  const handleRemoveFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Router>  
      <Layout>
        <Routes>
          <Route path="/" element={<p>Welcome to Pizza Planet!</p>} />
          <Route path="/menu" element={<PizzaList onAddToCart={handleAddToCart} />} />
          <Route path="/cart" element={<Cart cartItems={cart} onRemove={handleRemoveFromCart} />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
