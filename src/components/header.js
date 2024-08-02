import React, { useEffect, useState } from "react";
import logo from "../assets/images/logo1.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Dropdown } from "react-bootstrap";

const Header = ({ cartCount }) => {
  const [cartCountHeader, setCartCountHeader] = useState(0);
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?._id;
        setName(user?.name || "Login");

        if (userId) {
          const response = await axios.get(
            `https://backend-runfood.vercel.app/cart/count/${userId}`
          );
          const data = response.data;
          if (data.status) {
            setCartCountHeader(data.count);
          }
        }
      } catch (err) {
        console.error("Error fetching cart count:", err);
      }
    };
    fetchCartCount();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white sticky-top navbar-light p-3 shadow-sm">
      <div className="container">
        <a className="navbar-brand" href="/">
          <img src={logo} alt="Logo"
          style={{  height: "50px",width: "196px", objectFit: "contain" }}
          />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto text-center">
            <li className="nav-item">
              <a className="nav-link mx-4 text-uppercase" href="/">
                <h6>Home</h6>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link mx-4 text-uppercase" href="#">
                <h6>Shop</h6>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link mx-4 text-uppercase" href="#">
                <h6>Page</h6>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link mx-4 text-uppercase" href="#">
                <h6>Blog</h6>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link mx-4 text-uppercase" href="#">
                <h6>Contact</h6>
              </a>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto text-center">
            <li className="nav-item iconGioHang">
              <a href="/cart" className="nav-link mx-4 text-uppercase">
                <div id="cart-icon">
                  <FontAwesomeIcon
                    icon={faShoppingCart}
                    style={{ color: "gray" }}
                  />
                  <span id="cart-count">
                    {cartCount ? cartCount : cartCountHeader}
                  </span>
                </div>
              </a>
            </li>

            <li className="nav-item dropdown">
              <Dropdown>
                <Dropdown.Toggle
                  variant="link"
                  id="dropdown-basic"
                  className="nav-link mx-2 text-uppercase"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <FontAwesomeIcon icon={faCircleUser} className="me-1" />
                  {name}
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-right">
                  {name !== "Login" && (
                    <>
                      <Dropdown.Item href="/settings">Settings</Dropdown.Item>
                      <Dropdown.Item onClick={handleLogout}>
                        Log out
                      </Dropdown.Item>
                    </>
                  )}
                  {name === "Login" && (
                    <Dropdown.Item href="/login">Login</Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
