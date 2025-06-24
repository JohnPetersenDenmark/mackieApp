import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Layout from './components/Layout';
import PaymentSuccess from "./components/PaymentSuccess";
import PaymentCancel from "./components/PaymentCancel";
import TermsOfSale from './components/TermsOfSale';

/* function Layout() {
  return (
    <div>
      <h1>My Layout</h1>
      <Outlet />
    </div>
  );
} */  



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
        <Route index element={<></>} />       root /
          <Route path="payment-success" element={<PaymentSuccess />} />
          <Route path="payment-cancel" element={<PaymentCancel />} /> 
          {/* <Route path="/termsofsale" element={<TermsOfSale />} /> */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
