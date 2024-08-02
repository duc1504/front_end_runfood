import React from 'react';
import footerLogo from '../assets/images/logo1.png';
// import paymentImg from '../assets/images/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faGooglePlus, faPinterest, faYoutube } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return (
        <footer className="text-center text-lg-start bg-dark pt-3 mt-3">
            <div className="container text-center text-md-start mt-5 text-white">
                <div className="row mt-3">
                    <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4 text-white">
                        <img src={footerLogo} alt="Footer Logo"
                            style={{ width: '190px', height: '60px' }} />
                        <p className="mt-5">Gather 'Round the Good Stuff” and “Makin' it great again and again,</p>
                        {/* <img className="mt-3" src={paymentImg} alt="Payment Methods" /> */}
                    </div>
                    <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                        <h6 className="mb-3">FOOD<hr /></h6>
                        <ul>
                            <li><a href="#!">Food Store</a></li>
                            <li><a href="#!">Trending Food</a></li>
                            <li><a href="#!">Accessories</a></li>
                            <li><a href="#!">Sale</a></li>
                        </ul>
                    </div>
                    <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                        <h6 className="mb-3">INFORMATION<hr /></h6>
                        <ul>
                            <li><a href="#!">Questions?</a></li>
                            <li><a href="#!">Payments Methods</a></li>
                            <li><a href="#!">Sizing Charts</a></li>
                            <li><a href="#!">Return Policy</a></li>
                        </ul>
                    </div>
                    <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                        <h6 className="mb-4">NEWSLETTER<hr /></h6>
                        <form className="d-flex flex-column">
                            <input className="form-control me-2" type="search" placeholder="Email" aria-label="Search" />
                            <button className="btn bg-primary text-light mt-2" type="submit">SUBSCRIBE <FontAwesomeIcon icon="fa-solid fa-right-long" /></button>
                        </form>
                        <div className="d-flex mt-3 icon_footer">
                            <a href="https://www.facebook.com/duc1504/"><FontAwesomeIcon icon={faFacebook} className="fa-2xl me-2" /></a>
                            <a href="#"><FontAwesomeIcon icon={faTwitter} className="fa-2xl me-2" /></a>
                            <a href="#"><FontAwesomeIcon icon={faGooglePlus} className="fa-2xl me-2" /></a>
                            <a href="#"><FontAwesomeIcon icon={faPinterest} className="fa-2xl me-2" /></a>
                            <a href="#"><FontAwesomeIcon icon={faYoutube} className="fa-2xl me-2" /></a>
                        </div>
                    </div>
                </div>
                <hr />
            </div>
            <div className="d-flex justify-content-center text-white footer pb-3">
                <div className="me-5 d-none d-lg-block">
                    <span><b>© Designer by Trịnh Ngọc Đức. ALL rights reserved.</b></span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
