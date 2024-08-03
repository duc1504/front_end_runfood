import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/header";
import Footer from "../components/footer";
import "../styles/orderHistory.css";

const OrderHistory = ({ userId }) => {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("user"))?._id;
      const response = await axios.get(
        `https://backend-runfood.vercel.app/order/user/${userId}`
      );
      if (response.status === 200) {
        setOrders(response.data.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching user orders:", error);
    }
  };

  const getStatusClass = (status) => {
    if (status === "pending") return "status-pending";
    if (status === "success") return "status-success";
    if (status === "failed") return "status-failed";
    return "";
  };

  return (
    <>
      <Header />
      <div className="order-history-container">
        <h1 className="text-center my-5">Lịch sử đơn hàng</h1>
        {loading ? (
          <div className="loader-order-history"></div>
        ) : (
          <div className="orders">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <h2>Order ID: {order._id}</h2>
                <p>Customer Name: {order.customerName}</p>
                <p>Customer Phone: {order.customerPhone}</p>
                <p>Customer Address: {order.customerAddress}</p>
                <p className={`order-status ${getStatusClass(order.status)}`}>
                  Status: {order.status}
                </p>
                <p>Created At: {new Date(order.createdAt).toLocaleString()}</p>
                <div className="products">
                  {order.products.map((item, index) => (
                    <div key={index} className="product-item">
                      <img src={item.image} alt={item.name} />
                      <div>
                        <p className="product-name"> {item.product}</p>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {order.note && <p>Note: {order.note}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default OrderHistory;
