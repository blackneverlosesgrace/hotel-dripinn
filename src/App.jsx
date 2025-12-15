import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './Pages/Home';
import Rooms from './Pages/Rooms';
import RoomDetails from './Pages/RoomDetails';
import Booking from './Pages/Booking';
import Login from './Pages/Login';
import Register from './Pages/Register';
import MyBookings from './Pages/MyBookings';
import Profile from './Pages/Profile';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Policies from './Pages/Policies';
import AdminDashboard from './Pages/AdminDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/rooms/:id" element={<RoomDetails />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/policies" element={<Policies />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
