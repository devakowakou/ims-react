import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import CategoryPage from './pages/CategoryPage';
import { ProtectedRoute, AdminRoute } from "./service/Guard";
import SupplierPage from "./pages/SupplierPage";
import AddEditSupplierPage from "./pages/AddEditSupplierPage.jsx";
import AddEditProductPage from "./pages/AddEditProductPage";
import ProductPage from "./pages/ProductPage";
import PurchasePage from "./pages/PurchasePage";
import TransactionsPage from "./pages/TransactionsPage";
import SellPage from "./pages/SellPage";
import ProfilePage from "./pages/ProfilePage";
import TransactionDetailsPage from "./pages/TransactionDetailsPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/category" element={<AdminRoute element={<CategoryPage/>}/>}/>
          <Route path="/supplier" element={<AdminRoute element={<SupplierPage/>}/>}/>
          <Route path="/add-supplier" element={<AdminRoute element={<AddEditSupplierPage/>}/>}/>
          <Route path="/edit-supplier/:supplierId" element={<AdminRoute element={<AddEditSupplierPage/>}/>}/>
          <Route path="/product" element={<AdminRoute element={<ProductPage/>}/>}/>
          <Route path="/add-product" element={<AdminRoute element={<AddEditProductPage/>}/>}/>
          <Route path="/edit-product/:productId" element={<AdminRoute element={<AddEditProductPage/>}/>}/>
          <Route path="/purchase" element={<ProtectedRoute element={<PurchasePage/>}/>}/>
          <Route path="/sell" element={<ProtectedRoute element={<SellPage/>}/>}/>
          <Route path="/transaction" element={<ProtectedRoute element={<TransactionsPage/>}/>}/>
          <Route path="/transaction/:transactionId" element={<ProtectedRoute element={<TransactionDetailsPage/>}/>}/>
          <Route path="/profile" element={<ProtectedRoute element={<ProfilePage/>}/>}/>
          <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage/>}/>}/>
          <Route path="*" element={<LoginPage/>}/>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;