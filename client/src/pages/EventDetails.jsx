import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaTag, FaRupeeSign, FaUsers, FaStar } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import './EventDetails.css';

const EventDetails = () => {
    const [event, setEvent] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const fetchEvent = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/events/${id}`);
            setEvent(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/events/${id}/reviews`);
            setReviews(data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    useEffect(() => {
        fetchEvent();
        fetchReviews();
    }, [id]);

    const handleBooking = () => {
        navigate(`/checkout/${id}`, { state: { quantity } });
    };

    const onReviewAdded = () => {
        fetchEvent(); // Refresh event for updated rating
        fetchReviews(); // Refresh reviews list
    };

    if (loading) return <div className="loading-container"><p>Loading event details...</p></div>;
    if (!event) return <div className="loading-container"><p>Event not found</p></div>;

    return (
        <div className="event-details-container">
            <div className="event-details-header">
                {event.image && (
                    <img
                        src={`http://localhost:5000/${event.image}`}
                        alt={event.title}
                        className="event-details-image"
                    />
                )}
                <div className="event-details-overlay">
                    <div className="event-details-content">
                        <span className="event-category-badge">
                            <FaTag /> {event.category}
                        </span>
                        <h1>{event.title}</h1>
                        <div className="rating-badge">
                            <FaStar color="#ffc107" />
                            <span>
                                {event.averageRating ? event.averageRating.toFixed(1) : 'No Ratings'} ({event.numReviews} reviews)
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="event-details-body">
                <div className="event-info-section">
                    <h2>Event Information</h2>
                    <div className="event-info-grid">
                        <div className="info-card">
                            <FaCalendarAlt className="info-icon" />
                            <div>
                                <p className="info-label">Date & Time</p>
                                <p className="info-value">{new Date(event.date).toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="info-card">
                            <FaMapMarkerAlt className="info-icon" />
                            <div>
                                <p className="info-label">Location</p>
                                <p className="info-value">{event.location}</p>
                            </div>
                        </div>
                        <div className="info-card">
                            <FaRupeeSign className="info-icon" />
                            <div>
                                <p className="info-label">Price per Ticket</p>
                                <p className="info-value">₹{event.price}</p>
                            </div>
                        </div>
                        <div className="info-card">
                            <FaTicketAlt className="info-icon" />
                            <div>
                                <p className="info-label">Available Tickets</p>
                                <p className="info-value">{event.availableTickets} / {event.capacity}</p>
                            </div>
                        </div>
                    </div>

                    <div className="description-section">
                        <h3>About This Event</h3>
                        <p>{event.description}</p>
                    </div>

                    <div className="reviews-section">
                        <h2>Reviews & Ratings</h2>
                        {user ? (
                            <ReviewForm eventId={id} onReviewAdded={onReviewAdded} />
                        ) : (
                            <div className="login-prompt">
                                <p>Please <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>login</a> to write a review.</p>
                            </div>
                        )}
                        <ReviewList reviews={reviews} />
                    </div>
                </div>

                <div className="booking-section">
                    <div className="booking-card">
                        <h3>Book Your Tickets</h3>
                        <div className="ticket-selector">
                            <label htmlFor="quantity">
                                <FaUsers /> Number of Tickets
                            </label>
                            <input
                                type="number"
                                id="quantity"
                                min="1"
                                max={event.availableTickets}
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="quantity-input"
                            />
                        </div>
                        <div className="price-summary">
                            <div className="price-row">
                                <span>Ticket Price</span>
                                <span>₹{event.price}</span>
                            </div>
                            <div className="price-row">
                                <span>Quantity</span>
                                <span>× {quantity}</span>
                            </div>
                            <div className="price-total">
                                <span>Total</span>
                                <span>₹{event.price * quantity}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleBooking}
                            className="btn btn-primary btn-book"
                            disabled={event.availableTickets === 0}
                        >
                            <FaTicketAlt /> {event.availableTickets > 0 ? 'Book Now' : 'Sold Out'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
