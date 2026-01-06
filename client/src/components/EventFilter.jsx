import { useState, useEffect } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import './EventFilter.css';

const EventFilter = ({ onFilterChange }) => {
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        minPrice: '',
        maxPrice: '',
        startDate: '',
        endDate: ''
    });

    const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(filters.search);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [filters.search]);

    // Notify parent when debounced search or other filters change
    useEffect(() => {
        onFilterChange({ ...filters, search: debouncedSearch });
    }, [debouncedSearch, filters.category, filters.minPrice, filters.maxPrice, filters.startDate, filters.endDate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="event-filter-container">
            <div className="filter-header">
                <h3><FaFilter /> Filters</h3>
            </div>

            <div className="filter-group search-group">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    name="search"
                    placeholder="Search events..."
                    value={filters.search}
                    onChange={handleChange}
                    className="filter-input search-input"
                />
            </div>

            <div className="filter-row">
                <div className="filter-group">
                    <label>Category</label>
                    <select name="category" value={filters.category} onChange={handleChange} className="filter-select">
                        <option value="">All Categories</option>
                        <option value="Concert">Concert</option>
                        <option value="Conference">Conference</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Meetup">Meetup</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Price Range</label>
                    <div className="price-inputs">
                        <input
                            type="number"
                            name="minPrice"
                            placeholder="Min"
                            value={filters.minPrice}
                            onChange={handleChange}
                            className="filter-input"
                        />
                        <span>-</span>
                        <input
                            type="number"
                            name="maxPrice"
                            placeholder="Max"
                            value={filters.maxPrice}
                            onChange={handleChange}
                            className="filter-input"
                        />
                    </div>
                </div>

                <div className="filter-group">
                    <label>Date Range</label>
                    <div className="date-inputs">
                        <input
                            type="date"
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleChange}
                            className="filter-input"
                        />
                        <input
                            type="date"
                            name="endDate"
                            value={filters.endDate}
                            onChange={handleChange}
                            className="filter-input"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventFilter;
