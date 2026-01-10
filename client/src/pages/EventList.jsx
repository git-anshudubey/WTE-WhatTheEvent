import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import EventCard from '../components/EventCard';
import EventFilter from '../components/EventFilter';
import './EventList.css';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({});

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setPage(1); // Reset to page 1 on filter change
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                let url = `${import.meta.env.VITE_API_URL}/events?page=${page}&limit=6`;

                // Append filters to URL
                const { search, category, minPrice, maxPrice, startDate, endDate } = filters;
                if (search) url += `&search=${search}`;
                if (category) url += `&category=${category}`;
                if (minPrice) url += `&minPrice=${minPrice}`;
                if (maxPrice) url += `&maxPrice=${maxPrice}`;
                if (startDate) url += `&startDate=${startDate}`;
                if (endDate) url += `&endDate=${endDate}`;

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
    }, [filters, page]);

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Explore Events</h1>
                    <p className="page-subtitle">Discover amazing events happening around you</p>
                </div>
            </div>

            <EventFilter onFilterChange={handleFilterChange} />

            {loading ? (
                <div className="loading-container"><p>Loading events...</p></div>
            ) : (
                <>
                    {events && events.length > 0 ? (
                        <div className="events-grid">
                            {events.map((event) => (
                                <EventCard key={event._id} event={event} />
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
