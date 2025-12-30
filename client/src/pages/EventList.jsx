import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './EventList.css';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('');

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                let url = `${import.meta.env.VITE_API_URL}/events?page=${page}&limit=6`;
                if (category) {
                    url += `&category=${category}`;
                }
                const { data } = await axios.get(url);
                setEvents(data.events || []);
                setTotalPages(data.pages);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchEvents();
    }, [category, page]);

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Explore Events</h1>
                    <p className="page-subtitle">Discover amazing events happening around you</p>
                </div>
                <div className="filters-container">
                    <select
                        className="category-select"
                        value={category}
                        onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                    >
                        <option value="">All Categories</option>
                        <option value="Concert">Concert</option>
                        <option value="Conference">Conference</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Meetup">Meetup</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="loading-container"><p>Loading events...</p></div>
            ) : (
                <>
                    {events && events.length > 0 ? (
                        <div className="events-grid">
                            {events.map((event) => (
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
                            ))}
                        </div>
                    ) : (
                        <div className="no-events" style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '16px', marginTop: '2rem' }}>
                            <FaCalendarAlt style={{ fontSize: '3rem', color: '#cbd5e0', marginBottom: '1rem' }} />
                            <h3 style={{ fontSize: '1.5rem', color: '#2d3748', marginBottom: '0.5rem' }}>No events found</h3>
                            <p style={{ color: '#718096' }}>Try adjusting your search or category filters</p>
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="pagination-btn"
                                disabled={page <= 1}
                                onClick={() => setPage(page - 1)}
                            >
                                <FaChevronLeft /> Previous
                            </button>
                            <span className="pagination-info"> Page {page} of {totalPages} </span>
                            <button
                                className="pagination-btn"
                                disabled={page >= totalPages}
                                onClick={() => setPage(page + 1)}
                            >
                                Next <FaChevronRight />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default EventList;
