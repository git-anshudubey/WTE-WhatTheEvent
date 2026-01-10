import { createContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // loading state removed as it is not currently used with lazy initialization

    const login = async (email, password) => {
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
                email,
                password,
            });

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            setUser(JSON.parse(JSON.stringify(data)));
            return { success: true };
        } catch (error) {
            console.error('Login error:', error.response?.data?.message || error.message);
            return { success: false, error: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (name, email, password) => {
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
                name,
                email,
                password,
            });

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            return { success: true };
        } catch (error) {
            console.error('Registration error:', error.response?.data?.message || error.message);
            return { success: false, error: error.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const toggleWishlist = async (eventId) => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/users/wishlist/${eventId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update local user state with new wishlist
            const updatedUser = { ...user, wishlist: data.wishlist };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser)); // Persist
            return { success: true, message: data.message };
        } catch (error) {
            console.error('Wishlist error:', error);
            return { success: false, error: 'Could not update wishlist' };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, toggleWishlist }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
