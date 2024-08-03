// src/hooks/useCart.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const useCart = (userId, cartItems, setCartItems, setTotalPrice) => {
  const [error, setError] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(
          "https://esgoo.net/api-tinhthanh/1/0.htm"
        );
        setProvinces(response.data.data || []);
      } catch (err) {
        console.error("Error fetching provinces:", err);
      }
    };

    fetchProvinces();
  }, []);

  const handleProvinceChange = async (event) => {
    const selectedProvince = event.target.value;
    try {
      const response = await axios.get(
        `https://esgoo.net/api-tinhthanh/2/${selectedProvince}.htm`
      );
      setDistricts(response.data.data || []);
    } catch (err) {
      console.error("Error fetching districts:", err);
    }
  };

  const handleDistrictChange = async (event) => {
    const selectedDistrict = event.target.value;
    try {
      const response = await axios.get(
        `https://esgoo.net/api-tinhthanh/3/${selectedDistrict}.htm`
      );
      setWards(response.data.data || []);
    } catch (err) {
      console.error("Error fetching wards:", err);
    }
  };

  const updateCartItemQuantity = async (productId, quantity) => {
    try {
      await axios.put("https://backend-runfood.vercel.app/cart/update", {
        userId: userId,
        productId: productId,
        quantity: quantity,
      });
    } catch (err) {
      console.error("Error updating cart item quantity:", err);
      setError("Đã xảy ra lỗi khi cập nhật số lượng sản phẩm.");
    }
  };

  const removeCartItem = async (productId) => {
    try {
      await axios.delete("https://backend-runfood.vercel.app/cart/remove", {
        data: { userId: userId, productId: productId },
      });

      // Cập nhật giỏ hàng sau khi xóa item
      const updatedCartItems = cartItems.filter(
        (item) => item.product._id !== productId
      );
      setCartItems(updatedCartItems);

      // Cập nhật tổng giá tiền
      const newTotalPrice = updatedCartItems.reduce(
        (acc, item) => acc + parseFloat(item.subtotal),
        0
      );
      setTotalPrice(newTotalPrice.toFixed(2));
    } catch (err) {
      console.error("Error removing cart item:", err);
      setError("Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng.");
    }
  };

  const handleQuantityChange = async (index, event, cartItems, setCartItems, setTotalPrice) => {
    const newQuantity = parseInt(event.target.value, 10);

    if (isNaN(newQuantity) || newQuantity < 0) {
      return; // Không cho phép số lượng không hợp lệ hoặc âm
    }

    try {
      const productId = cartItems[index].product._id;

      // Lấy thông tin sản phẩm để kiểm tra số lượng tồn kho
      const productResponse = await axios.get(
        `https://backend-runfood.vercel.app/product/detail/${productId}`
      );
      const productData = productResponse.data;
      const stock = productData.data.stock;

      // Tính tổng số lượng sản phẩm hiện tại trong giỏ hàng
      const currentQuantity = cartItems.reduce((acc, item) => {
        if (item.product._id === productId) {
          return acc + item.quantity;
        }
        return acc;
      }, 0);

      // Kiểm tra tổng số lượng sau khi thay đổi
      if (newQuantity + (currentQuantity - cartItems[index].quantity) > stock) {
        Swal.fire({
          icon: "warning",
          title: "Số lượng không hợp lệ",
          text: `Số lượng sản phẩm trong kho chỉ còn ${stock}.`,
        });
        return;
      }

      // Cập nhật số lượng sản phẩm trong giỏ hàng
      const updatedCartItems = [...cartItems];
      updatedCartItems[index].quantity = newQuantity;
      updatedCartItems[index].subtotal = (
        newQuantity * updatedCartItems[index].product.price
      ).toFixed(2);
      setCartItems(updatedCartItems);

      // Cập nhật tổng giá tiền
      const newTotalPrice = updatedCartItems.reduce(
        (acc, item) => acc + parseFloat(item.subtotal),
        0
      );
      setTotalPrice(newTotalPrice.toFixed(2));

      // Cập nhật số lượng sản phẩm trong giỏ hàng trên server
      await updateCartItemQuantity(
        updatedCartItems[index].product._id,
        newQuantity
      );
    } catch (err) {
      console.error("Error handling quantity change:", err);
      setError("Đã xảy ra lỗi khi thay đổi số lượng sản phẩm.");
    }
  };

  return {
    provinces,
    districts,
    wards,
    handleProvinceChange,
    handleDistrictChange,
    updateCartItemQuantity,
    removeCartItem,
    handleQuantityChange,
    error,
    setError
  };
};

export default useCart;
