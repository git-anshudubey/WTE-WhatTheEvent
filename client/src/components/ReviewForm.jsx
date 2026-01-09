import { useState } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import './Review.css';

const ReviewForm = ({ eventId, onReviewAdded }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [hover, setHover] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user'));

            await axios.post(
                `${import.meta.env.VITE_API_URL}/events/${eventId}/reviews`,
                { rating, comment, userName: user.name },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setComment('');
            setRating(5);
            setError('');
            if (onReviewAdded) onReviewAdded();
        } catch (err) {
            setError(err.response?.data?.message || 'Error submitting review');
        }
    };

    return (
        <form className="review-form" onSubmit={handleSubmit}>
            <h3>Write a Review</h3>
            {error && <div className="error-message">{error}</div>}
            <div className="rating-select">
                {[...Array(5)].map((star, i) => {
                    const ratingValue = i + 1;
                    return (
                        <label key={i}>
                            <input
                                type="radio"
                                name="rating"
                                value={ratingValue}
                                onClick={() => setRating(ratingValue)}
                            />
                            <FaStar
                                className="star"
                                color={ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
                                size={24}
                                onMouseEnter={() => setHover(ratingValue)}
                                onMouseLeave={() => setHover(null)}
                            />
                        </label>
                    );
                })}
            </div>
            <textarea
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
            />
            <button type="submit" className="btn btn-primary">Submit Review</button>
        </form>
    );
};

export default ReviewForm;
