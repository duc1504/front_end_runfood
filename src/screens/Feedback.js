import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import '../styles/feedbackstyle.css';

const Feedback = () => {
  return (
    <>
      <Header />
      <div className="feedback-container">
        <div className="feedback-header">
          <h1 className="feedback-title">Your Feedback Matters!</h1>
          <p className="feedback-intro">We value your feedback and strive to improve our services based on your suggestions. Please take a moment to share your thoughts with us.</p>
        </div>
        <div className="feedback-form-container">
          <iframe 
            src="https://docs.google.com/forms/d/e/1FAIpQLSdkAzSqHfFc28MBysZ7cS40HyJhR9KnJTpFgB1iYQ8DSYPXwA/viewform?embedded=true" 
            width="100%" 
            height="1600" 
            title="Feedback Form"
            className="feedback-form"
          >
            Đang tải…
          </iframe>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Feedback;
