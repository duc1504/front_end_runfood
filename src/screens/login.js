import React, { useState } from 'react';
import logo from '../assets/images/logo.png';
import loginImage from '../assets/images/team.png';
import Header from '../components/header';
import Footer from '../components/footer';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault(); 

        try {
            const response = await fetch('https://backend-runfood.vercel.app/user/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.status) {
               
                const { password, ...userData } = data.data;
                localStorage.setItem('user', JSON.stringify(userData));
             
                window.location.href = '/';
            } else {
                setError(data.error || 'Đăng nhập không thành công');
            }
        } catch (error) {
            setError('Đã xảy ra lỗi: ' + error.message);
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
                                    <img src={loginImage} alt="login form" className="w-100 h-100"
                                     />
                                </div>
                                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                                    <div className="card-body p-4 p-lg-5 text-black">
                                        <form name="formlogin" onSubmit={handleSubmit}>
                                            <div className="d-flex align-items-center mb-3 pb-1">
                                                <div><img src={logo} alt="Logo" /></div>
                                            </div>
                                            <h5 className="fw-normal mb-3 pb-3" style={{ letterSpacing: '1px' }}>Đăng nhập tài khoản</h5>
                                            <div className="form-outline mb-4">
                                                <input
                                                    type="email"
                                                    id="mail"
                                                    className="form-control form-control-lg"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                                <label className="form-label" htmlFor="mail">Email address</label>
                                            </div>
                                            <div className="form-outline mb-4">
                                                <input
                                                    type="password"
                                                    id="pass"
                                                    className="form-control form-control-lg"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                                <label className="form-label" htmlFor="pass">Password</label>
                                            </div>
                                            <div className="pt-1 mb-4">
                                                <button id="submit" className="btn btn-primary py-2 px-5 btn-block" type="submit">Đăng nhập</button>
                                            </div>
                                            {error && <p className="text-danger">{error}</p>}
                                            <a className="small text-muted" href="#">Quên mật khẩu?</a>
                                            <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}>Bạn chưa có tài khoản? <a href="/signup" style={{ color: '#393f81' }}>Đăng kí</a></p>
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

export default Login;
