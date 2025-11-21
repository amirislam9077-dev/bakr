import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import './contact.css';
import Head from './head';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Head />
      <main style={{ flex: 1, paddingTop: '20px' }}>
        <div className="contact-container">
          <h1 className="contact-title">Contact Us</h1>
          <p className="contact-subtitle">Get in touch with us. We'd love to hear from you!</p>
          <div className="contact-content">
            <div className="contact-info">
              <div className="info-card">
                <h2>Contact Information</h2>
                <div className="info-item">
                  <MapPin className="info-icon" />
                  <div>
                    <h3>Office Address</h3>
                    <p>123 Heritage Street, Riyadh 12345, Saudi Arabia</p>
                  </div>
                </div>
                <div className="info-item">
                  <Phone className="info-icon" />
                  <div>
                    <h3>Phone</h3>
                    <p>+966 12 345 6789</p>
                  </div>
                </div>
                <div className="info-item">
                  <Mail className="info-icon" />
                  <div>
                    <h3>Email</h3>
                    <p>info@saudiheritage.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="contact-form-section">
              <div className="contact-card">
                <h2 className="card-title">Send us a message</h2>
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your Email"
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Subject"
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your Message"
                      className="form-textarea"
                      rows="5"
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="submit-button">
                    <Send size={18} className="button-icon" />
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
