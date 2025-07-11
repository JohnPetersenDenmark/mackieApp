import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Layout from './components/Layout';
import PaymentSuccess from "./components/PaymentSuccess";
import PaymentCancel from "./components/PaymentCancel";
import TermsOfSale from './components/TermsOfSale';
import { CurrentUser } from "./components/CurrentUser";
import { DashboardProvider } from "./components/admin/DashboardContext";
import AdminDashboard from "./components/admin/AdminDashBoard";

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
      <CurrentUser>
        <DashboardProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<></>} />
              <Route path="payment-success" element={<PaymentSuccess />} />
              <Route path="payment-cancel" element={<PaymentCancel />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="*" element={<div>404 Not Found</div>} />
            </Route>
          </Routes>
        </DashboardProvider>
      </CurrentUser>
    </BrowserRouter>

  );
}
