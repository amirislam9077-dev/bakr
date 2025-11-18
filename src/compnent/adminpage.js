import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminHead from './adminhead';
import AdminNav from './adminnav';
import Dash from './dash';
import Sites from './sites';
import CreateSite from './createsite';
import Message from './message';
import './adminpage.css';

const AdminPage = () => {
  return (
    <div className="admin-page">
      <AdminNav />
      <div className="admin-main">
        <AdminHead />
        <div className="admin-content">
          <Routes>
            <Route path="/" element={<Dash />} />
            <Route path="/sites" element={<Sites />} />
            <Route path="/sites/create" element={<CreateSite />} />
            <Route path="/messages" element={<Message />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
