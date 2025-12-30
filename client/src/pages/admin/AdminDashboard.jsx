import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/analytics/summary`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <p>Loading Dashboard...</p>;

    return (
        <div className="container">
            <h1>Admin Dashboard</h1>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <h3>Total Revenue</h3>
                    <p style={{ fontSize: '2em', fontWeight: 'bold', color: 'green' }}>${stats.totalRevenue}</p>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <h3>Total Bookings</h3>
                    <p style={{ fontSize: '2em', fontWeight: 'bold' }}>{stats.totalBookings}</p>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <h3>Total Users</h3>
                    <p style={{ fontSize: '2em', fontWeight: 'bold' }}>{stats.totalUsers}</p>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <h3>Total Events</h3>
                    <p style={{ fontSize: '2em', fontWeight: 'bold' }}>{stats.totalEvents}</p>
                </div>
            </div>

            {/* Sales Chart */}
            <div className="card" style={{ height: '400px' }}>
                <h3>Weekly Sales</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={stats.dailySales}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="_id" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="sales" fill="#8884d8" name="Sales ($)" />
                        <Bar dataKey="bookings" fill="#82ca9d" name="Bookings" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AdminDashboard;
