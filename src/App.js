import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./App.css";
import Home from "./screens/home";
import Login from "./screens/login";
import Signup from "./screens/signup";
import Cart from "./screens/cart";
import ProductDetail from "./screens/ProductDetail";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Helmet>
                  <title>Home</title>
                </Helmet>
                <Home />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <Helmet>
                  <title>Login</title>
                </Helmet>
                <Login />
              </>
            }
          />
          <Route
            path="/signup"
            element={
              <>
                <Helmet>
                  <title>Signup</title>
                </Helmet>
                <Signup />
              </>
            }
          />
          <Route
            path="/cart"
            element={
              <>
                <Helmet>
                  <title>Cart</title>
                </Helmet>
                <Cart />
              </>
            }
          />
          <Route
            path="/product/:id"
            element={
              <>
                <Helmet>
                  <title>Product Detail</title>
                </Helmet>
                <ProductDetail />
              </>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
