import React from 'react';
import './adminhead.css';

const AdminHead = () => {
  return (
    <header className="admin-header">
      <div className="admin-header-content">
        <div className="admin-header-left">
        </div>
        <div className="admin-header-right">
          <div className="admin-user-info">
            <div className="admin-user-avatar">A</div>
            <div className="admin-user-details">
              <p className="admin-user-name">Admin User</p>
              <p className="admin-user-email">admin@heritage.sa</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHead;
