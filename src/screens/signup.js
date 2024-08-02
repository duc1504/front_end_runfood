import React, { useState } from 'react';
import logo from '../assets/images/logo.png';
import signupImage from '../assets/images/team.png'; 
import Header from '../components/header';
import Footer from '../components/footer';
import Swal from 'sweetalert2'

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch('https://backend-runfood.vercel.app/user/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Lưu thông tin vào localStorage
                const userData = await response.json();
                localStorage.setItem('user', JSON.stringify(userData));
                // Điều hướng đến trang khác hoặc thông báo thành công
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Signup successfully!",
                    showConfirmButton: false,
                    timer: 1500
                  });
                window.location.href = '/';
            } else {
                const error = await response.json();
                alert(`Đăng ký thất bại: ${error.message}`);
            }
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };
    return (
        <>
        <Header />
        <section>
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col col-xl-10">
                        <div className="card">
                            <div className="row">
                                <div className="col-md-6 col-lg-5 d-none d-md-block">
                                    <img src={signupImage} alt="signup form" className="w-100 h-100" />
                                </div>
                                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                                    <div className="card-body p-4 p-lg-5 text-black">
                                        <form name="formsignup" onSubmit={handleSubmit}>
                                            <div className="d-flex align-items-center mb-3 pb-1">
                                                <div><img src={logo} alt="Logo" /></div>
                                            </div>
                                            <h5 className="fw-normal mb-3 pb-3" style={{ letterSpacing: '1px' }}>Đăng ký tài khoản</h5>
                                            <div className="form-outline mb-4">
                                                <input
                                                    type="text"
                                                    id="name"
                                                    className="form-control form-control-lg"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                />
                                                <label className="form-label" htmlFor="name">Họ và tên</label>
                                            </div>
                                            <div className="form-outline mb-4">
                                                <input
                                                    type="email"
                                                    id="email"
                                                    className="form-control form-control-lg"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                />
                                                <label className="form-label" htmlFor="email">Email address</label>
                                            </div>
                                            <div className="form-outline mb-4">
                                                <input
                                                    type="text"
                                                    id="phone"
                                                    className="form-control form-control-lg"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                />
                                                <label className="form-label" htmlFor="phone">Số điện thoại</label>
                                            </div>
                                            <div className="form-outline mb-4">
                                                <input
                                                    type="password"
                                                    id="password"
                                                    className="form-control form-control-lg"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                />
                                                <label className="form-label" htmlFor="password">Password</label>
                                            </div>
                                            <div className="pt-1 mb-4">
                                                <button id="submit" className="btn btn-primary py-2 px-5 btn-block" type="submit">Đăng ký</button>
                                            </div>
                                            <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}>Bạn đã có tài khoản? <a href="/login" style={{ color: '#393f81' }}>Đăng nhập</a></p>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <Footer />
       </>
    );
};
export default Signup;
