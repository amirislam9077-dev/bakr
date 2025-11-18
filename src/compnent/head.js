import React from 'react';
import { useNavigate } from 'react-router-dom';
import './head.css';

const Head = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/admin');
  };

  const handleContactClick = () => {
    navigate('/contact');
  };

  return (
    <header className="heritage-header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo-icon" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L4 7V12C4 16.42 7.16 20.44 11.5 21.85C11.66 21.91 11.83 21.95 12 21.95C12.17 21.95 12.34 21.91 12.5 21.85C16.84 20.44 20 16.42 20 12V7L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"/>
              <path d="M12 8L9 11L11 13L15 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="header-text">
            <h1 className="header-title">Saudi Heritage Map</h1>
            <p className="header-subtitle">Explore Natural Landmarks & Heritage Sites</p>
          </div>
        </div>
        <div className="header-right">
          <button className="contact-button" onClick={handleContactClick}>
            <svg className="contact-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Contact Us
          </button>
          <button className="language-button">
            <svg className="language-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"/>
              <path d="M2 12H22"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"/>
              <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"/>
            </svg>
            العربية
          </button>
        </div>
      </div>
    </header>
  );
};

export default Head;
