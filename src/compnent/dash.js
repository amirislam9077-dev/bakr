import React from 'react';
import { useNavigate } from 'react-router-dom';
import { sites } from './sites';
import './dash.css';

const Dash = () => {
  const navigate = useNavigate();

  // Calculate statistics from sites data
  const totalSites = sites.length;
  const mountains = sites.filter(site => site.type === 'Mountain').length;
  const valleys = sites.filter(site => site.type === 'Other').length;
  const heritageSites = sites.filter(site => site.type === 'Heritage Site').length;

  // Get all sites for recent activity
  const recentActivity = sites;

  return (
    <div className="dash-container">
      <div className="dash-header">
        <h1 className="dash-title">Dashboard</h1>
        <p className="dash-subtitle">Overview</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div className="stat-label">TOTAL SITES</div>
          <div className="stat-value">{totalSites}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon yellow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div className="stat-label">MOUNTAINS</div>
          <div className="stat-value">{mountains}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div className="stat-label">VALLEYS</div>
          <div className="stat-value">{valleys}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pink">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div className="stat-label">HERITAGE SITES</div>
          <div className="stat-value">{heritageSites}</div>
        </div>
      </div>

      {/* Create Button */}
      <div className="dash-create-section">
        <button
          className="dash-create-btn"
          onClick={() => navigate('/admin/sites/create')}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Create New Site
        </button>
        <button
          className="dash-view-btn"
          onClick={() => navigate('/admin/messages')}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          View Messages
        </button>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity-card">
        <div className="activity-header">
          <h3 className="section-title">RECENT ACTIVITY</h3>
          <button className="view-all-btn" onClick={() => navigate('/admin/sites')}>
            View all �
          </button>
        </div>
        <div className="activity-list">
          {recentActivity.map((site, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div className="activity-info">
                <div className="activity-name">{site.name}</div>
                <div className="activity-location">{site.city}, {site.state}</div>
              </div>
              <div className={`activity-type ${site.type.toLowerCase().replace(' ', '-')}`}>
                {site.type}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dash;
