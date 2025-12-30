import { Link } from 'react-router-dom';

const BookingSuccess = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    return (
        <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1 style={{ color: 'green' }}>Payment Successful!</h1>
            <p>Your booking has been confirmed.</p>
            {sessionId && <p style={{ fontSize: '0.8em', color: '#666' }}>Reference: {sessionId.slice(0, 10)}...</p>}
            <div style={{ marginTop: '20px' }}>
                <Link to="/my-bookings" className="btn" style={{ marginRight: '10px' }}>View My Bookings</Link>
                <Link to="/" className="btn" style={{ background: '#fff', color: '#333', border: '1px solid #333' }}>Back to Home</Link>
            </div>
        </div>
    );
};

export default BookingSuccess;
