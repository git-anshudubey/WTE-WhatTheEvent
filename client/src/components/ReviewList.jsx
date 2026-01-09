import { FaStar, FaUserCircle } from 'react-icons/fa';
import './Review.css';

const ReviewList = ({ reviews }) => {
    if (!reviews || reviews.length === 0) {
        return <div className="no-reviews">No reviews yet. Be the first to review!</div>;
    }

    return (
        <div className="review-list">
            {reviews.map((review) => (
                <div key={review._id} className="review-card">
                    <div className="review-header">
                        <div className="reviewer-info">
                            <FaUserCircle className="user-icon" />
                            <span className="user-name">{review.userName}</span>
                        </div>
                        <div className="review-rating">
                            {[...Array(5)].map((star, i) => (
                                <FaStar
                                    key={i}
                                    color={i < review.rating ? '#ffc107' : '#e4e5e9'}
                                    size={16}
                                />
                            ))}
                        </div>
                    </div>
                    <p className="review-date">{new Date(review.createdAt).toLocaleDateString()}</p>
                    <p className="review-comment">{review.comment}</p>
                </div>
            ))}
        </div>
    );
};

export default ReviewList;
