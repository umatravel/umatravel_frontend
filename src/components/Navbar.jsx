import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Plane } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <Plane size={24} />
          </div>
          <div className="logo-text">
            <span className="brand-name">Uma International</span>
            <span className="brand-tag">Travel Services</span>
          </div>
        </Link>

        <div className="navbar-links desktop-only">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
          <Link to="/services" className={location.pathname === '/services' ? 'active' : ''}>Services</Link>
          <Link to="/packages" className={location.pathname === '/packages' ? 'active' : ''}>Packages</Link>
          <Link to="/tours" className={location.pathname === '/tours' ? 'active' : ''}>Tours</Link>
          <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link>
        </div>

        <div className="navbar-actions desktop-only">
          <div className="iata-badge">IATA Accredited</div>
          <Link to="/contact" className="btn btn-primary">Book Now</Link>
        </div>

        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/services">Services</Link>
          <Link to="/packages">Packages</Link>
          <Link to="/tours">Tours</Link>
          <Link to="/contact">Contact</Link>
          <div className="mobile-actions">
             <div className="iata-badge-mobile">IATA Accredited</div>
             <Link to="/contact" className="btn btn-primary w-full">Book Now</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
