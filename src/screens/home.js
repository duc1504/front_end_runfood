import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.css";
import "../styles/homestyle.css";
import Header from "../components/header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/footer";
import ProductDetail from "./ProductDetail"; // Import your ProductDetail component
import Swal from 'sweetalert2'
const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const slideImages = [
    require("../assets/images/banner01.png"),
    require("../assets/images/banner02.png"),
    require("../assets/images/banner03.png"),
    require("../assets/images/banner04.png"),
   
  ];

  useEffect(() => {
    fetchProducts();
    fetchCategories();

    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slideImages.length);
    }, 3000);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://backend-runfood.vercel.app/product");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setProducts(data.data); // Lưu danh sách sản phẩm vào state
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("https://backend-runfood.vercel.app/categories");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setCategories(data.data); // Lưu danh sách danh mục vào state
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const formatTotal = (total) => {
    return total.toLocaleString("vi-VN", { minimumFractionDigits: 0 });
  };

  const addToCart = async (product, quantity = 1) => {
    const productId = product._id;
    const stock = product.stock;
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id;
  
    if (!userId) {
      console.error("User ID không được tìm thấy. Vui lòng đăng nhập.");
      navigate("/login"); // Chuyển hướng đến trang đăng nhập
      return;
    }
  
    try {
      // Kiểm tra tổng số lượng sản phẩm trong giỏ hàng
      const response = await fetch(`https://backend-runfood.vercel.app/cart/${userId}`);
      const cartData = await response.json();
  
      if (cartData.status) {
        // Lấy tổng số lượng sản phẩm của sản phẩm cụ thể trong giỏ hàng
        const existingProduct = cartData.data.items.find(item => item.product._id === productId);
        const currentQuantity = existingProduct ? existingProduct.quantity : 0;
  
        // Kiểm tra nếu số lượng sản phẩm trong giỏ hàng + số lượng muốn thêm vượt quá tồn kho
        if (currentQuantity + quantity > stock) {
          Swal.fire({
            title: "Max quantity: ",
            text: `Số lượng sản phẩm trong kho chỉ còn ${stock} sản phẩm.`,
            icon: "warning",
          });
          return;
        }
      }
  
      // Thêm sản phẩm vào giỏ hàng
      const addResponse = await fetch("https://backend-runfood.vercel.app/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity,
          userId,
        }),
      });
  
      const addData = await addResponse.json();
  
      if (addData.status) {
        showThongBao("Sản phẩm đã được thêm vào giỏ hàng!");
  
        // Cập nhật số lượng sản phẩm trong giỏ hàng
        try {
          const countResponse = await axios.get(`https://backend-runfood.vercel.app/cart/count/${userId}`);
          const countData = countResponse.data;
          if (countData.status) {
            setCartCount(countData.count);
          }
        } catch (err) {
          console.error("Error fetching cart count:", err);
        }
      } else {
        console.error(addData.error || "Thêm sản phẩm vào giỏ hàng không thành công");
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi:", error.message);
    }
  };
  

  const showThongBao = (message) => {
    var notification = document.getElementById("notification");
    notification.textContent = message; // Cập nhật nội dung thông báo
    notification.classList.remove("hidden");
    notification.style.opacity = "1";

    setTimeout(function () {
      notification.style.opacity = "0"; // Biến mất dần
      setTimeout(function () {
        notification.classList.add("hidden");
      }, 1000); // Sau 1 giây, ẩn thông báo hoàn toàn
    }, 1000); // Hiển thị trong 1 giây
  };

  const prevSlide = () => {
    const newSlide = (currentSlide - 1 + slideImages.length) % slideImages.length;
    setCurrentSlide(newSlide);
  };

  const nextSlide = () => {
    const newSlide = (currentSlide + 1) % slideImages.length;
    setCurrentSlide(newSlide);
  };

  const handleCategoryClick = async (categoryId) => {
    setActiveCategory(categoryId);
    try {
      const response = await fetch("https://backend-runfood.vercel.app/product/category/" + categoryId);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setProducts(data.data); // Lưu danh sách sản phẩm vào state
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleCartClick = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?._id) {
      navigate("/login");
    } else {
      navigate("/cart");
    }
  };
  if (!categories) return <p>Loading...</p>;
  return (
    <>

      <Header cartCount={cartCount} onCartClick={handleCartClick} />
      <div id="slide">
        <img
          src={slideImages[currentSlide]}
          id="image"
          alt="Slide"
          
          style={{ objectFit: "contain", width: "100%"}}
        />
        <i className="fa fa-chevron-circle-left" onClick={prevSlide}></i>
        <i className="fa fa-chevron-circle-right" onClick={nextSlide}></i>
      </div>
      <section className="category-section">
        <div className="container">
          <h2 className="text-center">Danh Mục Sản Phẩm</h2>
          <div className="category-list">
            {categories.map((category) => (
              <div
                key={category._id}
                className={`category-card ${activeCategory === category._id ? "active" : ""}`}
                onClick={() => handleCategoryClick(category._id)}
              >
                <div className="card-body">
                  <h5 className="category-card-title">{category.name}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="pb-5 pt-4">
        <div className="container">
          <div className="row justify-content-center sanphammoi">
            {products.map((product) => (
              <div key={product._id} className="col-lg-4 col-md-4 col-sm-6 mt-3 sp">
                <div className="card h-100">
                  <img
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="card-img-top "
                    style={{ objectFit: "contain", maxHeight: "250px" }}
                    src={`${product.image}`}
                    alt={product.name}
                  />
                  <div className="card-body p-4" onClick={() => navigate(`/product/${product._id}`)}>
                    <div className="text-center">
                      <h5 className="fw-bolder">{product.name}</h5>
                      <div className="d-flex justify-content-center small text-warning mb-2">
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                      </div>
                      <b>{formatTotal(product.price)} VND</b>
                    </div>
                  </div>
                  <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
                    <div className="text-center">
                      <a
                        className="btn btn-outline-dark mt-auto"
                        href="javascript:void(0)"
                        id="addToCartBtn"
                        onClick={() => addToCart(product)}
                      >
                        <i className="fa-solid fa-cart-shopping"></i>Add to cart
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
      <div id="notification" className="notification hidden">
        Sản phẩm đã được thêm vào giỏ hàng!
      </div>
    </>
  );
};

export default Home;
