import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./App.css";
import Home from "./screens/home";
import Login from "./screens/login";
import Signup from "./screens/signup";
import Cart from "./screens/cart";
import ProductDetail from "./screens/ProductDetail";
import Feedback from "./screens/Feedback";
import Blog from "./screens/Blog";
import BlogDetail from "./screens/BlogDetail"; 
import OrderHistory from "./screens/OrderHistory";
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
          <Route
            path="/feedback"
            element={
              <>
                <Helmet>
                  <title>Feedback</title>
                </Helmet>
                <Feedback />
              </>
            }
          />
          <Route
            path="/blog"
            element={
              <>
                <Helmet>
                  <title>Blog</title>
                </Helmet>
                <Blog />
              </>
            }
          />
          <Route
            path="/blog/:id"
            element={
              <>
                <Helmet>
                  <title>Blog Detail</title>
                </Helmet>
                <BlogDetail />
              </>
            }
          />
          <Route
            path="/order-history"
            element={
              <>
                <Helmet>
                  <title>Order History</title>
                </Helmet>
                <OrderHistory />
              </>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
