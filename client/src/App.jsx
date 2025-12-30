import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EventList from './pages/EventList';
import EventDetails from './pages/EventDetails';
import CreateEvent from './pages/admin/CreateEvent';
import ManageEvents from './pages/admin/ManageEvents';
import EditEvent from './pages/admin/EditEvent';
import Checkout from './pages/Checkout';
import MyBookings from './pages/MyBookings';
import BookingSuccess from './pages/BookingSuccess';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserList from './pages/admin/UserList';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/events/:id" element={<EventDetails />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserList />} />
            <Route path="/manage-events" element={<ManageEvents />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/edit-event/:id" element={<EditEvent />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/checkout/:id" element={<Checkout />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/booking-success" element={<BookingSuccess />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
