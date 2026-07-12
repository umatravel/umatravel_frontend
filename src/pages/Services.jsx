import { motion } from 'framer-motion';
import { Plane, Train, Map, Hotel, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Services.css';

const Services = () => {
  const services = [
    {
      id: 'flight',
      title: 'Flight Booking',
      icon: <Plane size={40} />,
      desc: 'Seamless domestic and international flight bookings with competitive rates and 24/7 support.',
      features: ['Best Price Guarantee', 'Flexible Rescheduling', 'Premium Seat Selection', 'Corporate Travel Management'],
      accentClass: 'accent-flight'
    },
    {
      id: 'train',
      title: 'Train Tickets',
      icon: <Train size={40} />,
      desc: 'Hassle-free railway bookings across the Indian railway network, from local routes to luxury trains.',
      features: ['Tatkal Booking Assistance', 'PNR Status Updates', 'Luxury Train Packages', 'Group Bookings'],
      accentClass: 'accent-train'
    },
    {
      id: 'hotel',
      title: 'Hotel Reservations',
      icon: <Hotel size={40} />,
      desc: 'Curated accommodations tailored to your budget and style, from boutique stays to luxury resorts.',
      features: ['Verified Properties', 'Complimentary Breakfast Options', 'Free Cancellation Deals', 'Exclusive Upgrades'],
      accentClass: 'accent-hotel'
    },
    {
      id: 'tours',
      title: 'Tour Packages',
      icon: <Map size={40} />,
      desc: 'Customized itineraries and guided tours designed to give you an unforgettable vacation experience.',
      features: ['Tailor-made Itineraries', 'Expert Local Guides', 'All-inclusive Options', 'Adventure & Leisure Trips'],
      accentClass: 'accent-tours'
    }
  ];

  return (
    <div className="page-content services-page fade-in">
      <header className="page-header bg-primary text-white text-center">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Our Services
          </motion.h1>
          <motion.p 
            className="page-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Comprehensive travel solutions tailored to your unique needs.
          </motion.p>
        </div>
      </header>

      <section className="container section">
        <div className="services-list">
          {services.map((service, index) => (
            <motion.div 
              className={`service-detail-card ${service.accentClass}`}
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="service-icon-large">
                {service.icon}
              </div>
              <div className="service-detail-content">
                <h2>{service.title}</h2>
                <p className="service-detail-desc">{service.desc}</p>
                <ul className="service-features">
                  {service.features.map((feature, idx) => (
                    <li key={idx}>
                      <CheckCircle size={18} className="feature-icon" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <Link to="/contact" className="btn btn-outline">Book {service.title.split(' ')[0]}</Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section bg-light text-center">
         <div className="container">
           <h2>Ready to plan your trip?</h2>
           <p className="section-desc">Get in touch with our experts today for a free consultation.</p>
           <Link to="/contact" className="btn btn-primary mt-4">Contact Us Now</Link>
         </div>
      </section>
    </div>
  );
};

export default Services;
