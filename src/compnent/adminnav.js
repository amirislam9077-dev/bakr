import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './adminnav.css';

const AdminNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <nav className="admin-nav">
      <div className="admin-nav-header">
        <div className="admin-nav-logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
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
        <div className="admin-nav-text">
          <h2 className="admin-nav-title">Admin Panel</h2>
          <p className="admin-nav-subtitle">Heritage Map</p>
        </div>
      </div>

      <div className="admin-nav-menu">
        <div 
          className={`admin-nav-item ${location.pathname === '/admin' || location.pathname === '/admin/' ? 'active' : ''}`}
          onClick={() => handleNavClick('/admin')}
        >
          <svg className="admin-nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Dashboard</span>
        </div>

        <div 
          className={`admin-nav-item ${location === '/admin/sites' ? 'active' : ''}`}
          onClick={() => handleNavClick('/admin/sites')}
        >
          <svg className="admin-nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"/>
            <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span>Sites</span>
        </div>

        <div
          className={`admin-nav-item ${location.pathname === '/admin/messages' ? 'active' : ''}`}
          onClick={() => handleNavClick('/admin/messages')}
        >
          <svg className="admin-nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"/>
          </svg>
          <span>Messages</span>
        </div>
      </div>

      <div className="admin-nav-footer">
        <div className="admin-nav-item">
          <svg className="admin-nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          <span>'D91(J)</span>
        </div>

        <div className="admin-nav-item logout">
          <svg className="admin-nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"/>
            <path d="M16 17L21 12L16 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"/>
            <path d="M21 12H9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"/>
          </svg>
          <span>Logout</span>
        </div>
      </div>
    </nav>
  );
};

export default AdminNav;
