import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCalendarAlt, FaMapMarkerAlt, FaDollarSign, FaUsers, FaTag, FaFileAlt, FaImage, FaSave } from 'react-icons/fa';
import './CreateEvent.css';

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        category: 'Conference',
        price: '',
        capacity: '',
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const { title, description, date, location, category, price, capacity } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const data = new FormData();
        console.log('[CreateEvent] API URL:', import.meta.env.VITE_API_URL); // Debug Log
        data.append('title', title);
        data.append('description', description);
        data.append('date', date);
        data.append('location', location);
        data.append('category', category);
        data.append('price', price);
        data.append('capacity', capacity);
        if (image) {
            data.append('image', image);
        }

        try {
            const token = localStorage.getItem('token');
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            console.log('[CreateEvent] Using API URL:', apiUrl);

            await axios.post(`${apiUrl}/events`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/manage-events');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create event');
            setLoading(false);
        }
    };

    return (
        <div className="create-event-container">
            <div className="create-event-header">
                <h1>Create New Event</h1>
                <p>Fill in the details to create an amazing event</p>
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
                                value={title}
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
                                value={description}
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
                                    value={category}
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
                                    value={date}
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
                                value={location}
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
                                    value={price}
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
                                    value={capacity}
                                    onChange={onChange}
                                    placeholder="Max attendees"
                                    min="1"
                                    required
                                    className="form-control"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="image">
                                <FaImage /> Event Image
                            </label>
                            <div className="image-upload-container">
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    accept="image/*"
                                    onChange={onImageChange}
                                    className="file-input"
                                />
                                <label htmlFor="image" className="file-label">
                                    <FaImage />
                                    {imagePreview ? 'Change Image' : 'Choose Image'}
                                </label>
                                {imagePreview && (
                                    <div className="image-preview">
                                        <img src={imagePreview} alt="Preview" />
                                    </div>
                                )}
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
                        {loading ? 'Creating...' : 'Create Event'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateEvent;
