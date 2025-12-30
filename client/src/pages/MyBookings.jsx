import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { FaTicketAlt, FaCalendarAlt, FaMapMarkerAlt, FaDollarSign, FaCheckCircle, FaClock, FaEye } from 'react-icons/fa';
import './MyBookings.css';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(
                    `${import.meta.env.VITE_API_URL}/bookings/my-bookings`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                // Ensure data is an array, or check for nested property if API changed
                const bookingsData = Array.isArray(data) ? data : (data.bookings || []);
                setBookings(bookingsData);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    if (loading) return <div className="loading-container"><p>Loading your bookings...</p></div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>My Bookings</h1>
                <p className="page-subtitle">View and manage your event tickets</p>
            </div>

            {!bookings || bookings.length === 0 ? (
                <div className="empty-state">
                    <FaTicketAlt className="empty-icon" />
                    <h3>No Bookings Yet</h3>
                    <p>You haven't booked any events. Start exploring events now!</p>
                    <Link to="/events" className="btn btn-primary">Browse Events</Link>
                </div>
            ) : (
                <div className="bookings-grid">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="booking-card">
                            <div
                                className="booking-header"
                                style={booking.event?.image ? {
                                    backgroundImage: `url(http://localhost:5000/${booking.event.image})`
                                } : {}}
                            >
                                {booking.event?.image && (
                                    <img
                                        src={`http://localhost:5000/${booking.event.image}`}
                                        alt={booking.event.title}
                                        className="booking-thumb"
                                    />
                                )}
                                <div className="booking-info-text">
                                    <h3>{booking.event?.title || 'Event'}</h3>
                                    <p className="booking-date">{new Date(booking.event?.date).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="booking-grid-data">
                                <div className="booking-data-cell">
                                    <span className="data-label">Date</span>
                                    <div className="data-content">
                                        <FaCalendarAlt />
                                        <span>{new Date(booking.event?.date).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="booking-data-cell">
                                    <span className="data-label">Location</span>
                                    <div className="data-content">
                                        <FaMapMarkerAlt />
                                        <span>{booking.event?.location}</span>
                                    </div>
                                </div>

                                <div className="booking-data-cell">
                                    <span className="data-label">Status</span>
                                    <div className="data-content">
                                        <span className={`status-badge ${booking.status}`}>
                                            {booking.status === 'confirmed' ? <FaCheckCircle /> : <FaClock />}
                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="booking-grid-data">
                                <div className="booking-data-cell price-cell">
                                    <span className="data-label">Total Paid</span>
                                    <div className="data-content">
                                        <span className="booking-price">${booking.totalPrice}</span>
                                    </div>
                                </div>

                                <div className="booking-data-cell tickets-cell">
                                    <span className="data-label">Tickets</span>
                                    <div className="data-content">
                                        <FaTicketAlt />
                                        <span>{booking.ticketCount} Tickets</span>
                                    </div>
                                </div>
                            </div>

                            <div className="booking-actions">
                                <Link
                                    to={`/events/${booking.event?._id}`}
                                    className="booking-btn view-btn"
                                    title="View"
                                >
                                    <FaEye /> View
                                </Link>
                                <span className="booking-id">Booking ID: {booking._id.slice(-8)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
