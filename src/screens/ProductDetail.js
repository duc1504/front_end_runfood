import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import '../styles/detail.css';
import Header from "../components/header";
import Swal from 'sweetalert2'
const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(`https://backend-runfood.vercel.app/product/detail/${id}`);
        if (response.data.status) {
          setProduct(response.data.data);
        } else {
          console.error('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetail();
  }, [id]);

  const addToCart = async (product, quantity = 1) => {
    const productId = product._id;
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id;
    
    if (!userId) {
      console.error("User ID không được tìm thấy. Vui lòng đăng nhập.");
      navigate("/login"); // Chuyển hướng đến trang đăng nhập
      return;
    }
  
    try {
      // Lấy thông tin giỏ hàng hiện tại để kiểm tra số lượng sản phẩm
      const cartResponse = await fetch(`https://backend-runfood.vercel.app/cart/${userId}`);
      const cartData = await cartResponse.json();
      
      let currentQuantity = 0;
      if (cartData.status) {
        const existingProduct = cartData.data.items.find(item => item.product._id === productId);
        currentQuantity = existingProduct ? existingProduct.quantity : 0;
      }
  
      // Lấy thông tin sản phẩm để kiểm tra tồn kho
      const productResponse = await fetch(`https://backend-runfood.vercel.app/product/detail/${productId}`);
      const productData = await productResponse.json();
      const stock = productData.data.stock;
  
      if (stock < quantity + currentQuantity) {
        Swal.fire({
          title: "Max quantity: ",
          text: `Số lượng sản phẩm trong kho chỉ còn ${stock} sản phẩm.`,
          icon: "warning",
        });
        return;
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

  const handleAddToCart = (product) => {
    // Lấy số lượng từ input
    const quantity = parseInt(document.querySelector('input[name=quantity]').value, 10);
    if (product) {
      addToCart(product, quantity);
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <>
    <Header cartCount={cartCount}/>
    <div>
      <div className="container py-3">
        <div className="row">
          <div className="col-xs-12 col-sm-6 col-md-5 col-lg-5">
            <div className="col-lg-12 col-12">
              <img style={{ width: "100%",maxHeight: "500px", objectFit: "contain" }} src={product.image} alt="product" />
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-md-7 col-lg-7">
            <div className="p-3 d-flex">
              <h2>{product.name}</h2>
            </div>
            <div className="p-3 d-flex">
              <p>Thương hiệu :
                <span className="text-primary">NEEDS OF WISDOM®</span> | Tình trạng: <span className="text-primary">Còn hàng</span>
              </p>
            </div>
            <b className=" d-flex">
              <h1 className="px-3">{product.price.toLocaleString()} VND</h1>
            </b>
            <p className="px-3 d-flex">Size</p>
            <div className="px-3 d-flex">
              <input type="radio" className="btn-check" name="options-outlined" id="success-outlined" autoComplete="off" defaultChecked />
              <label className="btn btn-outline-primary me-2" htmlFor="success-outlined">Nhỏ</label>
              <input type="radio" className="btn-check" name="options-outlined" id="danger-outlined" autoComplete="off" />
              <label className="btn btn-outline-primary me-2" htmlFor="danger-outlined">Vừa</label>
              <input type="radio" className="btn-check" name="options-outlined" id="xl-outlined" autoComplete="off" />
              <label className="btn btn-outline-primary me-2" htmlFor="xl-outlined">Lớn</label>
            </div>
            <p className="px-3 mt-4 d-flex">Quantity (max {product.stock})</p>
            <div className="col-md-5 col-lg-5 col-xl-3 d-flex my-3">
              <button className="btn btn-link" onClick={() => document.querySelector('input[name=quantity]').stepDown()}>
                <i className="fas fa-minus"></i>
              </button>
              <input id="form1" min="1" name="quantity" defaultValue="1" type="number" className="form-control form-control-sm" />
              <button className="btn btn-link px-2" onClick={() => document.querySelector('input[name=quantity]').stepUp()}>
                <i className="fas fa-plus"></i>
              </button>
            </div>
            <div className="mx-3 d-flex">
              <button className="col-md-5 col-lg-5 col-xl-3 btn bg-primary text-light mt-2 me-3" type="submit" onClick={() => handleAddToCart(product)}>
                <i className="fa-solid fa-cart-shopping"></i> Add to cart
              </button>
              <button className="col-md-5 col-lg-5 col-xl-3 btn bg-primary text-light mt-2" type="submit">Mua ngay</button>
            </div>
          </div>
        </div>
        <h2 className="mt-5 d-flex">Rating</h2>
        <div className="comment-area mt-3">
          <textarea className="form-control" placeholder="Viết đánh giá của bạn tại đây..." rows="5"></textarea>
        </div>
        <div className="d-flex justify-content-end mt-3 me-3">
          <button type="button" className="btn btn-success">Gửi!</button>
        </div>
      </div>
      <div id="notification" className="notification hidden">
        Sản phẩm đã được thêm vào giỏ hàng!
      </div>
    </div>
    </>
  );
};

export default ProductDetail;
