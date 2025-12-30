import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaTicketAlt, FaCalendarAlt, FaUserCircle, FaSignOutAlt, FaChartLine, FaCog, FaHome, FaBars, FaTimes } from 'react-icons/fa';
import { MdEventAvailable } from 'react-icons/md';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setMobileMenuOpen(false);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
                    <FaTicketAlt className="logo-icon" />
                    <span>EventHub</span>
                </Link>

                <button
                    className="mobile-menu-toggle"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>

                <div className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
                    <Link to="/" className="navbar-link" onClick={closeMobileMenu}>
                        <FaHome className="nav-icon" />
                        <span>Home</span>
                    </Link>
                    <Link to="/events" className="navbar-link" onClick={closeMobileMenu}>
                        <FaCalendarAlt className="nav-icon" />
                        <span>Events</span>
                    </Link>

                    {user ? (
                        <>
                            <Link to="/my-bookings" className="navbar-link" onClick={closeMobileMenu}>
                                <MdEventAvailable className="nav-icon" />
                                <span>My Bookings</span>
                            </Link>
                            {user.role === 'admin' && (
                                <>
                                    <Link to="/admin/dashboard" className="navbar-link" onClick={closeMobileMenu}>
                                        <FaChartLine className="nav-icon" />
                                        <span>Dashboard</span>
                                    </Link>
                                    <Link to="/manage-events" className="navbar-link" onClick={closeMobileMenu}>
                                        <FaCog className="nav-icon" />
                                        <span>Manage</span>
                                    </Link>
                                </>
                            )}
                            <div className="navbar-user">
                                <span className="user-name">
                                    <FaUserCircle className="user-icon" />
                                    {user.name}
                                </span>
                                <button onClick={handleLogout} className="btn-logout">
                                    <FaSignOutAlt className="logout-icon" />
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="navbar-auth-buttons">
                            <Link to="/login" className="btn-primary" onClick={closeMobileMenu}>Login</Link>
                            <Link to="/register" className="btn-secondary" onClick={closeMobileMenu}>Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
