import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaSearch, FaEye, FaDollarSign } from 'react-icons/fa';
import './ManageEvents.css';

const ManageEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/events`);
            // Handle both array response and object with events property
            setEvents(Array.isArray(data) ? data : (data.events || []));
            setLoading(false);
        } catch (error) {
            console.error(error);
            setEvents([]);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${import.meta.env.VITE_API_URL}/events/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                fetchEvents();
            } catch (error) {
                console.error(error);
                alert('Failed to delete event');
            }
        }
    };

    const filteredEvents = events.filter(event =>
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading-container"><p>Loading events...</p></div>;

    return (
        <div className="manage-events-container">
            <div className="manage-header">
                <div>
                    <h1>Manage Events</h1>
                    <p>View, edit, and manage all your events</p>
                </div>
                <Link to="/create-event" className="btn btn-primary">
                    <FaPlus /> Create Event
                </Link>
            </div>

            <div className="search-bar">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Search events by title, category, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {filteredEvents.length === 0 ? (
                <div className="empty-state">
                    <FaCalendarAlt className="empty-icon" />
                    <h3>No Events Found</h3>
                    <p>Start by creating your first event</p>
                    <Link to="/create-event" className="btn btn-primary">
                        <FaPlus /> Create Event
                    </Link>
                </div>
            ) : (
                <div className="events-grid">
                    {filteredEvents.map((event) => (
                        <div key={event._id} className="event-card">
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
                                    <span className="price-value">${event.price}</span>
                                </div>
                                <div className="tickets-cell">
                                    <span className="data-label">Tickets Left</span>
                                    <div className="data-value">
                                        <FaTicketAlt />
                                        {event.availableTickets}/{event.capacity}
                                    </div>
                                </div>
                            </div>

                            <div className="event-actions">
                                <Link
                                    to={`/events/${event._id}`}
                                    className="action-btn view-btn"
                                    title="View"
                                >
                                    <FaEye /> View
                                </Link>
                                <Link
                                    to={`/edit-event/${event._id}`}
                                    className="action-btn edit-btn"
                                    title="Edit"
                                >
                                    <FaEdit /> Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(event._id)}
                                    className="action-btn delete-btn"
                                    title="Delete"
                                >
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="events-summary">
                <p>Showing {filteredEvents.length} of {events.length} events</p>
            </div>
        </div>
    );
};

export default ManageEvents;
