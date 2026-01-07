import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaEye, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import './EventCard.css'; // We'll move styles here

const EventCard = ({ event }) => {
    const { user, toggleWishlist } = useContext(AuthContext);

    // Check if event is in user's wishlist
    // user.wishlist can be array of strings or objects, we handle both just in case
    const isWishlisted = user?.wishlist?.some(id =>
        (typeof id === 'string' ? id : id._id) === event._id
    );

    const handleWishlistClick = (e) => {
        e.preventDefault(); // Prevent linking if wrapped in link
        if (!user) {
            alert('Please login to save events');
            return;
        }
        toggleWishlist(event._id);
    };

    return (
        <div className="event-card">
            <div
                className="event-card-header"
                style={event.image ? {
                    backgroundImage: `url(http://localhost:5000/${event.image})`
                } : {}}
            >
                {event.image && (
                    <img
                        src={`http://localhost:5000/${event.image}`}
                        alt={event.title}
                        className="event-thumb"
                    />
                )}

                <button
                    className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                    onClick={handleWishlistClick}
                    title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                    {isWishlisted ? <FaHeart /> : <FaRegHeart />}
                </button>

                <div className="event-header-content">
                    <div className="event-title">{event.title}</div>
                    <div className="event-description">
                        {event.description?.substring(0, 80)}...
                    </div>
                </div>
            </div>

            <div className="event-card-body">
                <div className="event-data-cell">
                    <span className="data-label">Date</span>
                    <div className="data-value">
                        <FaCalendarAlt />
                        {new Date(event.date).toLocaleDateString()}
                    </div>
                </div>
                <div className="event-data-cell">
                    <span className="data-label">Location</span>
                    <div className="data-value">
                        <FaMapMarkerAlt />
                        {event.location}
                    </div>
                </div>
                <div className="event-data-cell">
                    <span className="data-label">Category</span>
                    <span className="category-badge">{event.category}</span>
                </div>
            </div>

            <div className="event-card-footer-data">
                <div className="price-cell">
                    <span className="price-label">Price</span>
                    <span className="price-value">₹{event.price}</span>
                </div>
                <div className="tickets-cell">
                    <span className="data-label">Tickets</span>
                    <div className="data-value">
                        <FaTicketAlt />
                        {event.availableTickets} Left
                    </div>
                </div>
            </div>

            <div className="event-actions">
                <Link to={`/events/${event._id}`} className="view-btn">
                    <FaEye /> View
                </Link>
            </div>
        </div>
    );
};

export default EventCard;
