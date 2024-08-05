import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "../styles/detail.css";
import Header from "../components/header";
import Swal from "sweetalert2";
import formatCurrency from "../handles/formatCurrency";
const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(
          `https://backend-runfood.vercel.app/product/detail/${id}`
        );
        if (response.data.status) {
          setProduct(response.data.data);
        } else {
          console.error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`https://backend-runfood.vercel.app/review/${id}`);
        if (response.data.status) {
          setReviews(response.data.data);
        } else {
          console.error("Reviews not found");
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchProductDetail();
    fetchReviews();
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
        const existingProduct = cartData.data.items.find(
          (item) => item.product._id === productId
        );
        currentQuantity = existingProduct ? existingProduct.quantity : 0;
      }

      // Lấy thông tin sản phẩm để kiểm tra tồn kho
      const productResponse = await fetch(
        `https://backend-runfood.vercel.app/product/detail/${productId}`
      );
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
          const countResponse = await axios.get(
            `https://backend-runfood.vercel.app/cart/count/${userId}`
          );
          const countData = countResponse.data;
          if (countData.status) {
            setCartCount(countData.count);
          }
        } catch (err) {
          console.error("Error fetching cart count:", err);
        }
      } else {
        console.error(
          addData.error || "Thêm sản phẩm vào giỏ hàng không thành công"
        );
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi:", error.message);
    }
  };

  const handleAddToCart = (product) => {
    // Lấy số lượng từ input
    const quantity = parseInt(
      document.querySelector("input[name=quantity]").value,
      10
    );
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleSubmitReview = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id;

    if (!userId) {
      console.error("User ID không được tìm thấy. Vui lòng đăng nhập.");
      navigate("/login"); // Chuyển hướng đến trang đăng nhập
      return;
    }

    try {
      const response = await axios.post("https://backend-runfood.vercel.app/review", {
        userId,
        productId: id,
        rating,
        comment,
      });

      if (response.data.status) {
        console.log("Review submitted successfully:", response.data.status);
        Swal.fire({
          title: "Đánh giá thành công!",
          text: response.data.message,
          icon: "success",
        }).then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire({
          title: "Đánh giá thất bại",
          text: response.data.message,
          icon: "warning",
        });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      Swal.fire({
        title: "Lỗi!",
        text: error.response.data.message || "Đã xảy ra lỗi khi gửi đánh giá.",
        icon: "warning",
      });
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

  if (!product) return <div className="loaderhome"></div>;

  return (
    <>
      <Header cartCount={cartCount} />
      <div>
        <div className="container py-3">
          <div className="row">
            <div className="col-xs-12 col-sm-6 col-md-5 col-lg-5">
              <div className="col-lg-12 col-12">
                <img
                  style={{
                    width: "100%",
                    maxHeight: "500px",
                    objectFit: "contain",
                  }}
                  src={product.image}
                  alt="product"
                />
              </div>
            </div>
            <div className="col-xs-12 col-sm-6 col-md-7 col-lg-7">
              <div className="p-3 d-flex">
                <h2>{product.name}</h2>
              </div>
              <div className="p-3 d-flex">
                <p>
                  Thương hiệu :<span className="text-primary">The Dream®</span>{" "}
                  | Tình trạng: <span className="text-primary">Còn hàng</span>
                </p>
              </div>
              <b className=" d-flex">
                <h1 className="px-3">{formatCurrency(product.price)}</h1>
              </b>
              <p className="px-3 d-flex">Size</p>
              <div className="px-3 d-flex">
                <input
                  type="radio"
                  className="btn-check"
                  name="options-outlined"
                  id="success-outlined"
                  autoComplete="off"
                  defaultChecked
                />
                <label
                  className="btn btn-outline-primary me-2"
                  htmlFor="success-outlined"
                >
                  Nhỏ
                </label>
                <input
                  type="radio"
                  className="btn-check"
                  name="options-outlined"
                  id="danger-outlined"
                  autoComplete="off"
                />
                <label
                  className="btn btn-outline-primary me-2"
                  htmlFor="danger-outlined"
                >
                  Vừa
                </label>
                <input
                  type="radio"
                  className="btn-check"
                  name="options-outlined"
                  id="xl-outlined"
                  autoComplete="off"
                />
                <label
                  className="btn btn-outline-primary me-2"
                  htmlFor="xl-outlined"
                >
                  Lớn
                </label>
              </div>
              <p className="px-3 mt-4 d-flex">Quantity (max {product.stock})</p>
              <div className="col-md-5 col-lg-5 col-xl-3 d-flex my-3">
                <button
                  className="btn btn-link"
                  onClick={() =>
                    document.querySelector("input[name=quantity]").stepDown()
                  }
                >
                  <i className="fas fa-minus"></i>
                </button>
                <input
                  id="form1"
                  min="1"
                  name="quantity"
                  defaultValue="1"
                  type="number"
                  className="form-control form-control-sm"
                />
                <button
                  className="btn btn-link px-2"
                  onClick={() =>
                    document.querySelector("input[name=quantity]").stepUp()
                  }
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
              <div className="mx-3 d-flex">
                <button
                  className="col-md-5 col-lg-5 col-xl-3 btn bg-primary text-light mt-2 me-3"
                  type="submit"
                  onClick={() => handleAddToCart(product)}
                >
                  <i className="fa-solid fa-cart-shopping"></i> Add to cart
                </button>
                <button
                  className="col-md-5 col-lg-5 col-xl-3 btn bg-primary text-light mt-2"
                  type="submit"
                  onClick={() => (window.location.href = "/cart")}
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>

          <div className="comment-area">
            <div className="rating-container">
              <h2 className="rating-title">Rating</h2>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`fa-star ${rating >= star ? "fas" : "far"}`}
                    onClick={() => setRating(star)}
                  ></i>
                ))}
              </div>
              <div className="box-hidden"></div>
            </div>
            <textarea
              className="form-control mt-2"
              placeholder="Viết đánh giá của bạn tại đây..."
              rows="5"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>

          <div className="d-flex justify-content-end mt-3 me-3">
            <button
              type="button"
              className="btn btn-success px-4"
              onClick={handleSubmitReview}
            >
              Gửi!
            </button>
          </div>

          <div className="reviews mt-3">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review._id} className="review mb-3">
                  <div className="d-flex align-items-center">
                    <strong>{review.user.name}</strong>
                    <div className="ms-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i
                          key={star}
                          className={`fa-star ${
                            review.rating >= star ? "fas" : "far"
                          }`}
                          style={{ color: "#f39c12" }}
                        ></i>
                      ))}
                    </div>
                  </div>
                  <p className="mt-2">{review.comment}</p>
                  <small className="text-muted">
                    Đánh giá vào lúc{" "}
                    {new Date(review.createdAt).toLocaleDateString()}
                  </small>
                </div>
              ))
            ) : (
              <p>Chưa có đánh giá nào cho sản phẩm này.</p>
            )}
          </div>

          <div id="notification" className="notification hidden">
            Sản phẩm đã được thêm vào giỏ hàng!
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
