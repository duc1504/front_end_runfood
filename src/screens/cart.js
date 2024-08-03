import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import Header from "../components/header";
import Footer from "../components/footer";
import "../styles/cart.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Swal from "sweetalert2";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [error, setError] = useState("");
  const [note, setNote] = useState(""); // State mới để quản lý ghi chú
  const [removeitemramdom, setRemoveitemramdom] = useState(0);
  const navigate = useNavigate();
  const [addressDetail, setAddressDetail] = useState("");

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          // Redirect to login if no user
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `https://backend-runfood.vercel.app/cart/${user._id}`
        );
        const data = response.data;
        if (data.status) {
          setCartItems(data.data.items);
          setTotalPrice(parseFloat(data.data.totalPrice) || 0);
          setName(user.name);
        }
      } catch (err) {
        console.error("Error fetching cart items:", err);
      }
    };

    fetchCartItems();
  }, [navigate]);
  console.log(cartItems);
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(
          "https://esgoo.net/api-tinhthanh/1/0.htm"
        );
        console.log("Provinces data:", response.data);
        setProvinces(response.data.data || []);
      } catch (err) {
        console.error("Error fetching provinces:", err);
      }
    };

    fetchProvinces();
  }, []);

  const handleProvinceChange = async (event) => {
    const selectedProvince = event.target.value;
    setProvince(selectedProvince);
    try {
      const response = await axios.get(
        `https://esgoo.net/api-tinhthanh/2/${selectedProvince}.htm`
      );
      setDistricts(response.data.data || []);
      setDistrict("");
      setWard("");
    } catch (err) {
      console.error("Error fetching districts:", err);
    }
  };

  const handleDistrictChange = async (event) => {
    const selectedDistrict = event.target.value;
    setDistrict(selectedDistrict);
    try {
      const response = await axios.get(
        `https://esgoo.net/api-tinhthanh/3/${selectedDistrict}.htm`
      );
      setWards(response.data.data || []);
      setWard("");
    } catch (err) {
      console.error("Error fetching wards:", err);
    }
  };

  const updateCartItemQuantity = async (productId, quantity) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?._id;
      if (!userId) {
        console.error("User ID không được tìm thấy. Vui lòng đăng nhập.");
        return;
      }

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
    const user = JSON.parse(localStorage.getItem("user"));
    var ramdomremove = Math.floor(Math.random() * 1000);
    setRemoveitemramdom(ramdomremove);
    console.log(ramdomremove);
    const userId = user?._id;
    if (!userId) {
      console.error("User ID không được tìm thấy. Vui bạn đăng nhập.");
      return;
    }
    try {
      await axios.delete("https://backend-runfood.vercel.app/cart/remove", {
        data: { userId: userId, productId: productId },
      });
      setCartItems(cartItems.filter((item) => item.product._id !== productId));
    } catch (err) {
      console.error("Error removing cart item:", err);
      setError("Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng.");
    }
  };

  const handleQuantityChange = async (index, event) => {
    const newQuantity = parseInt(event.target.value, 10);
    
    // Kiểm tra giá trị nhập vào
    console.log("New Quantity:", newQuantity);
    if (isNaN(newQuantity) || newQuantity < 0) {
      return; // Không cho phép số lượng không hợp lệ hoặc âm
    }
  
    try {
      const productId = cartItems[index].product._id;
  
      // Lấy thông tin sản phẩm để kiểm tra số lượng tồn kho
      const productResponse = await axios.get(`https://backend-runfood.vercel.app/product/detail/${productId}`);
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
  

  const findProvinceName = (value) => {
    const province = provinces.find((province) => province.id === value);
    return province ? province.full_name : "";
  };

  const findDistrictName = (value) => {
    const district = districts.find((district) => district.id === value);
    return district ? district.full_name : "";
  };

  const findWardName = (value) => {
    const ward = wards.find((ward) => ward.id === value);
    return ward ? ward.full_name : "";
  };

  const handlePayment = async () => {
    const address = `${addressDetail},${findWardName(ward)},${findDistrictName(
      district
    )},${findProvinceName(province)}`;
    setAddress(address);
    console.log("Address:", address);
    if(error){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error,
      });
    }
    if (name.length < 6 || name.length > 30) {
      setError("Tên phải từ 6 đến 30 ký tự.");
      return;
    }
    if (phone.length < 10 || phone.length > 15) {
      setError("Số điện thoại không hợp lệ.");
      return;
    }
    if (!address) {
      setError("Vui lòng nhập địa chỉ chi tiết.");
      return;
    }
    if (!paymentMethod) {
      setError("Vui lòng chọn phương thức thanh toán.");
      return;
    }
    if (!province || !district || !ward) {
      setError("Vui lòng chọn đầy đủ địa chỉ.");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?._id;
      if (!userId) {
        setError("User ID không được tìm thấy. Vui lòng đăng nhập.");
        return;
      }
      const products = cartItems.map((item) => ({
        product: item.product.name,
        quantity: item.quantity,
        image: item.product.image,
        productId : item.product._id
    }));
    console.log("Products:", products);
      const orderData = {
        userId: userId,
        customerPhone: phone,
        customerAddress: address,
        note: note,
        customerName: name,
        products:products,
        totalPrice: totalPrice,
        paymentMethod: paymentMethod,
      };
      console.log("Products:", orderData.products);
      const response = await axios.post(
        "https://backend-runfood.vercel.app/order/checkout",
        orderData
      );

      if (response.data.status) {
        // alert("Bạn đã đặt hàng thành công");
        // Clear cart after successful payment
        setCartItems([]);
        setTotalPrice(0);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Bạn đã đặt hàng thành công",
          showConfirmButton: false,
          timer: 1500,
        });

        navigate("/");
      } else {
        setError("Đã xảy ra lỗi khi xử lý thanh toán.");
      }
    } catch (err) {
      console.error("Error processing payment:", err);
      setError("Đã xảy ra lỗi khi xử lý thanh toán.");
    }
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };
  
  return (
    <>
      <Header ramdomremove={removeitemramdom} />
      <Container className="mt-5">
        {/* {error && <Alert variant="danger">{error}</Alert>} */}
        <Row>
          <Col lg={8}>
            <Card>
              <Card.Body>
                <h1 className="fw-bold mb-4">Giỏ hàng</h1>
                <Row className="mb-3">
                  <Col>
                    <strong>Ảnh</strong>
                  </Col>
                  <Col>
                    <strong>Tên sản phẩm</strong>
                  </Col>
                  <Col>
                    <strong>Quantity</strong>
                  </Col>
                  <Col>
                    <strong>Giá</strong>
                  </Col>
                  <Col>
                    <strong>Thành tiền</strong>
                  </Col>
                  <Col>
                    <strong>Hành động</strong>
                  </Col>
                </Row>
                {cartItems.length === 0 ? (
                  <p>Không có sản phẩm nào trong giỏ hàng.</p>
                ) : (
                  cartItems.map((item, index) => (
                    <Row key={index} className="align-items-center mb-3">
                      <Col>
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="img-fluid"
                          width="50"
                        />
                      </Col>
                      <Col>{item.product.name}</Col>
                      <Col>
                        <Form.Control
                          type="number"
                          style={{ width: "60px" }}
                          value={item.quantity}
                          onChange={(event) =>
                            handleQuantityChange(index, event)
                          }
                          min="1"
                        />
                      </Col>
                      <Col>{item.product.price.toLocaleString()} ₫</Col>
                      <Col>{formatCurrency(item.subtotal)}</Col>
                      <Col>
                        <Button
                          variant="danger"
                          onClick={() => removeCartItem(item.product._id)}
                        >
                          Xóa
                        </Button>
                      </Col>
                    </Row>
                  ))
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card>
              <Card.Body>
                <h4 className="fw-bold mb-4">Thông tin thanh toán</h4>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Tên người nhận</Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control
                      type="text"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Tỉnh/Thành phố</Form.Label>
                    <Form.Control
                      as="select"
                      value={province}
                      onChange={handleProvinceChange}
                    >
                      <option value="">Chọn Tỉnh/Thành phố</option>
                      {provinces.map((prov) => (
                        <option key={prov.id} value={prov.id}>
                          {prov.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Quận/Huyện</Form.Label>
                    <Form.Control
                      as="select"
                      value={district}
                      onChange={handleDistrictChange}
                    >
                      <option value="">Chọn Quận/Huyện</option>
                      {districts.map((dist) => (
                        <option key={dist.id} value={dist.id}>
                          {dist.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Phường/Xã</Form.Label>
                    <Form.Control
                      as="select"
                      value={ward}
                      onChange={(event) => setWard(event.target.value)}
                    >
                      <option value="">Chọn Phường/Xã</option>
                      {wards.map((wrd) => (
                        <option key={wrd.id} value={wrd.id}>
                          {wrd.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Địa chỉ chi tiết</Form.Label>
                    <Form.Control
                      type="text"
                      value={addressDetail}
                      onChange={(event) => setAddressDetail(event.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Phương thức thanh toán</Form.Label>
                    <Form.Control
                      as="select"
                      value={paymentMethod}
                      onChange={(event) => setPaymentMethod(event.target.value)}
                    >
                      <option value="">Chọn phương thức thanh toán</option>
                      <option value="COD">
                        Thanh toán khi nhận hàng (COD)
                      </option>
                      <option value="Online">Thanh toán trực tuyến</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Ghi chú</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                    />
                  </Form.Group>
                  <h4 className="fw-bold">
                    Tổng cộng: {formatCurrency(totalPrice)}
                  </h4>
                  <Button
                    variant="primary"
                    onClick={handlePayment}
                    className="w-100 mt-3"
                  >
                    Thanh toán
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default Cart;
