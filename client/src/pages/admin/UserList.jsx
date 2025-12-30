import { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) return <p>Loading Users...</p>;

    return (
        <div className="container">
            <h1>User Management</h1>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>Name</th>
                        <th style={{ padding: '10px' }}>Email</th>
                        <th style={{ padding: '10px' }}>Role</th>
                        <th style={{ padding: '10px' }}>Joined</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '10px' }}>{user.name}</td>
                            <td style={{ padding: '10px' }}>{user.email}</td>
                            <td style={{ padding: '10px' }}>
                                <span style={{
                                    padding: '5px 10px',
                                    borderRadius: '15px',
                                    background: user.role === 'admin' ? '#e2e6ea' : '#d4edda',
                                    color: user.role === 'admin' ? '#333' : '#155724'
                                }}>
                                    {user.role}
                                </span>
                            </td>
                            <td style={{ padding: '10px' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;
