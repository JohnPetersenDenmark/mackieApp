import React, { useState } from 'react';
import { BrowserRouter , Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AdminDashBoard from './components/admin/AdminDashBoard';


function App() {


  return (
     <BrowserRouter>  
    <Layout>
      <Routes>
        <Route path="/dashboard" element={<AdminDashBoard />} />
      </Routes>
    </Layout>
  </BrowserRouter>
  );
}

export default App;
