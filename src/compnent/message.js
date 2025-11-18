import React, { useState } from 'react';
import './message.css';

const Message = () => {
  const [messages] = useState([
    {
      id: 1,
      sender: 'John Doe',
      email: 'john.doe@email.com',
      subject: 'Question about Simien Mountains',
      message: 'I would like to know more about the hiking trails and best time to visit.',
      date: '2024-01-15',
      read: false
    },
    {
      id: 2,
      sender: 'Sarah Smith',
      email: 'sarah.smith@email.com',
      subject: 'Heritage Site Information Request',
      message: 'Can you provide more details about the Rock-Hewn Churches?',
      date: '2024-01-14',
      read: true
    },
    {
      id: 3,
      sender: 'Michael Brown',
      email: 'michael.b@email.com',
      subject: 'Tour Guide Inquiry',
      message: 'Are there certified tour guides available for Lalibela?',
      date: '2024-01-13',
      read: true
    },
    {
      id: 4,
      sender: 'Emily Johnson',
      email: 'emily.j@email.com',
      subject: 'Accommodation Options',
      message: 'What are the recommended hotels near Axum?',
      date: '2024-01-12',
      read: false
    },
    {
      id: 5,
      sender: 'David Wilson',
      email: 'david.w@email.com',
      subject: 'Transportation Services',
      message: 'How can I arrange transportation between heritage sites?',
      date: '2024-01-11',
      read: true
    }
  ]);

  const unreadCount = messages.filter(msg => !msg.read).length;
  const totalMessages = messages.length;

  return (
    <div className="message-container">
      <div className="message-header">
        <h1 className="message-title">Messages</h1>
        <p className="message-subtitle">Manage your inbox</p>
      </div>

      {/* Statistics Cards */}
      <div className="message-stats-grid">
        <div className="message-stat-card">
          <div className="message-stat-icon blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"/>
            </svg>
          </div>
          <div className="message-stat-label">TOTAL MESSAGES</div>
          <div className="message-stat-value">{totalMessages}</div>
        </div>

        <div className="message-stat-card">
          <div className="message-stat-icon red">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div className="message-stat-label">UNREAD</div>
          <div className="message-stat-value">{unreadCount}</div>
        </div>

        <div className="message-stat-card">
          <div className="message-stat-icon green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20,6 9,17 4,12"/>
            </svg>
          </div>
          <div className="message-stat-label">READ</div>
          <div className="message-stat-value">{totalMessages - unreadCount}</div>
        </div>
      </div>

      {/* Messages List */}
      <div className="messages-list-card">
        <div className="messages-list-header">
          <h3 className="section-title">INBOX</h3>
        </div>
        <div className="messages-list">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-item ${!msg.read ? 'unread' : ''}`}>
              <div className="message-avatar">
                <div className="avatar-circle">
                  {msg.sender.charAt(0)}
                </div>
              </div>
              <div className="message-content">
                <div className="message-top-row">
                  <div className="message-sender">{msg.sender}</div>
                  <div className="message-date">{msg.date}</div>
                </div>
                <div className="message-subject">{msg.subject}</div>
                <div className="message-preview">{msg.message}</div>
              </div>
              {!msg.read && <div className="unread-indicator"></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Message;
