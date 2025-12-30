import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTicketAlt, FaShoppingCart, FaCreditCard, FaCheckCircle } from 'react-icons/fa';
import './Checkout.css';

const Checkout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/events/${id}`);
                setEvent(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleCheckout = async () => {
        setProcessing(true);
        try {
            const token = localStorage.getItem('token');
            const { data: booking } = await axios.post(
                `${import.meta.env.VITE_API_URL}/bookings`,
                { eventId: id, ticketCount: quantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const { data: session } = await axios.post(
                `${import.meta.env.VITE_API_URL}/payment/create-checkout-session`,
                { bookingId: booking._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            window.location.href = session.url;
        } catch (error) {
            console.error(error);
            alert('Payment failed. Please try again.');
            setProcessing(false);
        }
    };

    if (loading) return <div className="loading-container"><p>Loading checkout...</p></div>;
    if (!event) return <div className="loading-container"><p>Event not found</p></div>;

    return (
        <div className="checkout-container">
            <div className="checkout-header">
                <h1>Checkout</h1>
                <p>Complete your booking</p>
            </div>

            <div className="checkout-content">
                <div className="checkout-summary">
                    <h2>Booking Summary</h2>
                    <div className="summary-card">
                        {event.image && (
                            <img
                                src={`http://localhost:5000/${event.image}`}
                                alt={event.title}
                                className="summary-image"
                            />
                        )}
                        <div className="summary-details">
                            <h3>{event.title}</h3>
                            <p className="summary-date">{new Date(event.date).toLocaleString()}</p>
                            <p className="summary-location">{event.location}</p>
                        </div>
                    </div>

                    <div className="quantity-selector">
                        <label htmlFor="quantity">
                            <FaTicketAlt /> Number of Tickets
                        </label>
                        <div className="quantity-controls">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="quantity-btn"
                            >
                                −
                            </button>
                            <input
                                type="number"
                                id="quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                min="1"
                                max={event.availableTickets}
                                className="quantity-input"
                            />
                            <button
                                onClick={() => setQuantity(Math.min(event.availableTickets, quantity + 1))}
                                className="quantity-btn"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>

                <div className="checkout-payment">
                    <h2>Payment Details</h2>
                    <div className="payment-card">
                        <div className="price-breakdown">
                            <div className="price-row">
                                <span>Ticket Price</span>
                                <span>${event.price}</span>
                            </div>
                            <div className="price-row">
                                <span>Quantity</span>
                                <span>× {quantity}</span>
                            </div>
                            <div className="price-row subtotal">
                                <span>Subtotal</span>
                                <span>${(event.price * quantity).toFixed(2)}</span>
                            </div>
                            <div className="price-row total">
                                <span>Total</span>
                                <span>${(event.price * quantity).toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={processing || event.availableTickets === 0}
                            className="btn btn-primary btn-checkout"
                        >
                            {processing ? (
                                <>Processing...</>
                            ) : (
                                <>
                                    <FaCreditCard /> Proceed to Payment
                                </>
                            )}
                        </button>

                        <div className="payment-note">
                            <FaCheckCircle />
                            <p>Secure payment powered by Stripe</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
