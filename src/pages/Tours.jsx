import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Info } from 'lucide-react';

const Tours = () => {
  const tours = [
    {
      id: 1,
      title: 'Bodh Gaya Pilgrimage Tour',
      duration: '2 Nights / 3 Days',
      desc: 'Experience the profound spirituality of Bodh Gaya, where Lord Buddha attained enlightenment.',
      imageGradient: 'linear-gradient(135deg, #FFB75E 0%, #ED8F03 100%)'
    },
    {
      id: 2,
      title: 'Goa Beach Getaway',
      duration: '4 Nights / 5 Days',
      desc: 'Relax on pristine beaches, enjoy water sports, and experience the vibrant nightlife of Goa.',
      imageGradient: 'linear-gradient(135deg, #1CB5E0 0%, #000851 100%)'
    },
    {
      id: 3,
      title: 'Kashmir Honeymoon Package',
      duration: '5 Nights / 6 Days',
      desc: 'A romantic escape to the Paradise on Earth featuring Shikara rides and snow-capped peaks.',
      imageGradient: 'linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)'
    },
    {
      id: 4,
      title: 'Char Dham Yatra',
      duration: '11 Nights / 12 Days',
      desc: 'A complete spiritual journey covering Yamunotri, Gangotri, Kedarnath, and Badrinath.',
      imageGradient: 'linear-gradient(135deg, #e1eec3 0%, #f05053 100%)'
    },
    {
      id: 5,
      title: 'Varanasi Heritage Walk',
      duration: '2 Nights / 3 Days',
      desc: 'Witness the mesmerizing Ganga Aarti and explore the ancient alleys of Varanasi.',
      imageGradient: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)'
    },
    {
      id: 6,
      title: 'Darjeeling Tea & Toy Train',
      duration: '3 Nights / 4 Days',
      desc: 'Enjoy sweeping views of Kanchenjunga and the UNESCO World Heritage mountain railway.',
      imageGradient: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)'
    }
  ];

  return (
    <div className="page-content packages-page fade-in">
      <header className="page-header text-center">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Tours & Excursions
          </motion.h1>
          <motion.p 
            className="page-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ color: 'var(--text-light)' }}
          >
            Individual bookable experiences and regional tours across India.
          </motion.p>
        </div>
      </header>

      <section className="container section">
        <div className="packages-grid">
          {tours.map((tour, index) => (
            <motion.div 
              className="package-card"
              key={tour.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
            >
              <div 
                className="package-image"
                style={{ background: tour.imageGradient }}
              />
              <div className="package-content">
                <h3>{tour.title}</h3>
                <div className="detail-item mb-2" style={{ marginBottom: '1rem' }}>
                  <MapPin size={16} className="text-accent" /> {tour.duration}
                </div>
                <p className="service-detail-desc" style={{ fontSize: '0.95rem' }}>{tour.desc}</p>

                <div className="package-footer" style={{ marginTop: 'auto' }}>
                  <Link to="/contact" className="btn btn-outline package-btn"><Info size={16}/> View Details</Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Tours;
