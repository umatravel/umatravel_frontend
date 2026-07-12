import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-grid">
          {/* Brand & About */}
          <div className="footer-col brand-col">
            <h3 className="footer-brand">Uma International Travel Services</h3>
            <p className="footer-desc">
              Your trusted travel partner in Gopalganj, Bihar. IATA affiliated, providing premium flight, train, hotel, and tour package services since our inception.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">FB</a>
              <a href="#" aria-label="Instagram">IG</a>
              <a href="#" aria-label="Twitter">X</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/tours">Tours & Excursions</Link></li>
              <li><Link to="/packages">Tour Packages</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-col">
            <h4 className="footer-heading">Our Services</h4>
            <ul className="footer-links">
              <li><Link to="/services">Flight Tickets</Link></li>
              <li><Link to="/services">Train Tickets</Link></li>
              <li><Link to="/services">Hotel Booking</Link></li>
              <li><Link to="/packages">Tour Packages</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-col contact-col">
            <h4 className="footer-heading">Contact Us</h4>
            
            <div className="contact-item">
              <MapPin size={18} className="contact-icon" />
              <div>
                <strong>Head Office:</strong><br/>
                Nagar Palika Market, Post Office Chowk,<br/>
                Banjari Road, Gopalganj, Bihar - 841428
              </div>
            </div>

            <div className="contact-item">
              <MapPin size={18} className="contact-icon" />
              <div>
                <strong>Branch Office:</strong><br/>
                Kushwaha Market, Kuchaikote,<br/>
                Gopalganj, Bihar - 841501
              </div>
            </div>
            
            <div className="contact-item">
              <Phone size={18} className="contact-icon" />
              <div>
                <a href="tel:+916156359772">+91 6156359772</a> / <a href="tel:+919123279922">+91 9123279922</a><br/>
                <a href="https://wa.me/919771648655">WhatsApp: +91 9771648655</a>
              </div>
            </div>

            <div className="contact-item">
              <Mail size={18} className="contact-icon" />
              <a href="mailto:umatravelskk@gmail.com">umatravelskk@gmail.com</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Uma International Travel Services. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
