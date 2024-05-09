import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import OrderStatus from "./pages/OrderStatus";
import ProductDetail from "./components/ProductDetail";
import ProductList from "./components/ProductList";
import Favorites from "./pages/Favorites";
import CartPage from "./pages/Cart"; 
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import Payment from "./pages/Payment";
import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/order-status" element={<OrderStatus />} />
          <Route path="/products/:productId" element={<ProductDetail />} />
          <Route
            path="/products/category/:category"
            element={<ProductList />}
          />
          <Route path="/favorites/*" element={<Favorites />} />
          <Route path="/cart" element={<CartPage />} />{" "}
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
