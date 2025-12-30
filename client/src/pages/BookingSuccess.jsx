import { Link, useLocation } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import './BookingSuccess.css';

const BookingSuccess = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    return (
        <div className="success-container">
            <FaCheckCircle className="success-icon" />
            <h1>Payment Successful!</h1>
            <p>Your booking has been confirmed and your tickets are ready.</p>

            {sessionId && (
                <div className="session-id">
                    Ref: {sessionId.slice(0, 10)}...
                </div>
            )}

            <div className="success-actions">
                <Link to="/my-bookings" className="btn-success-primary">
                    View My Bookings
                </Link>
                <Link to="/" className="btn-success-secondary">
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default BookingSuccess;
