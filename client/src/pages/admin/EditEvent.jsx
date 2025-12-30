import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaDollarSign, FaUsers, FaTag, FaFileAlt, FaSave } from 'react-icons/fa';
import '../admin/CreateEvent.css';

const EditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        category: 'Conference',
        price: '',
        capacity: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/events/${id}`);
                // Format date for datetime-local input
                const dateStr = new Date(data.date).toISOString().slice(0, 16);
                setFormData({
                    title: data.title,
                    description: data.description,
                    date: dateStr,
                    location: data.location,
                    category: data.category,
                    price: data.price,
                    capacity: data.capacity
                });
                setLoading(false);
            } catch (error) {
                console.error(error);
                setError('Failed to load event');
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const token = localStorage.getItem('token');

        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/events/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            navigate('/manage-events');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update event');
            setLoading(false);
        }
    };

    if (loading) return <div className="loading-container"><p>Loading event...</p></div>;

    return (
        <div className="create-event-container">
            <div className="create-event-header">
                <h1>Edit Event</h1>
                <p>Update event details</p>
            </div>

            <form onSubmit={onSubmit} className="create-event-form">
                {error && <div className="error-message">{error}</div>}

                <div className="form-grid">
                    <div className="form-section">
                        <h3>Basic Information</h3>

                        <div className="form-group">
                            <label htmlFor="title">
                                <FaFileAlt /> Event Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={onChange}
                                placeholder="Enter event title"
                                required
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">
                                <FaFileAlt /> Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={onChange}
                                placeholder="Describe your event"
                                rows="4"
                                required
                                className="form-control"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="category">
                                    <FaTag /> Category
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={onChange}
                                    className="form-control"
                                >
                                    <option value="Concert">Concert</option>
                                    <option value="Conference">Conference</option>
                                    <option value="Workshop">Workshop</option>
                                    <option value="Meetup">Meetup</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="date">
                                    <FaCalendarAlt /> Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    id="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={onChange}
                                    required
                                    className="form-control"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="location">
                                <FaMapMarkerAlt /> Location
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={onChange}
                                placeholder="Event venue or address"
                                required
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Pricing & Capacity</h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="price">
                                    <FaDollarSign /> Ticket Price
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={onChange}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    required
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="capacity">
                                    <FaUsers /> Capacity
                                </label>
                                <input
                                    type="number"
                                    id="capacity"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={onChange}
                                    placeholder="Max attendees"
                                    min="1"
                                    required
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={() => navigate('/manage-events')}
                        className="btn btn-secondary-outline"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                    >
                        <FaSave />
                        {loading ? 'Updating...' : 'Update Event'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditEvent;
