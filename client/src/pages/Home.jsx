import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaTicketAlt, FaCreditCard, FaEnvelope, FaCalendarCheck, FaShieldAlt, FaBolt } from 'react-icons/fa';
import { MdEventAvailable } from 'react-icons/md';
import './Home.css';

const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="home-container">
            <div className="hero-section">
                <h1 className="hero-title">
                    Welcome to EventHub{user ? `, ${user.name}` : ''}! 🎉
                </h1>
                <p className="hero-subtitle">
                    Discover and book amazing events happening around you
                </p>
                <div className="hero-actions">
                    <Link to="/events" className="btn-hero-primary">
                        <FaCalendarCheck className="btn-icon" />
                        Browse Events
                    </Link>
                    {user && (
                        <Link to="/my-bookings" className="btn-hero-secondary">
                            <MdEventAvailable className="btn-icon" />
                            My Bookings
                        </Link>
                    )}
                </div>
            </div>

            <div className="features-grid">
                <div className="feature-card">
                    <div className="feature-icon-wrapper">
                        <FaBolt className="feature-icon" />
                    </div>
                    <h3>Easy Booking</h3>
                    <p>Book tickets for your favorite events in seconds with our streamlined process</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon-wrapper">
                        <FaShieldAlt className="feature-icon" />
                    </div>
                    <h3>Secure Payments</h3>
                    <p>Safe and secure payment processing powered by Stripe technology</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon-wrapper">
                        <FaEnvelope className="feature-icon" />
                    </div>
                    <h3>Instant Confirmation</h3>
                    <p>Get your tickets with QR codes via email immediately after purchase</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
