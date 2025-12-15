import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// CORS configuration - allow all origins
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ MODELS (Simple In-Memory Database) ============
const users = new Map();
const bookings = [];
const reviews = [];
let userIdCounter = 1;
let bookingIdCounter = 1;

const createUser = (data) => {
  const id = 'user_' + userIdCounter++;
  const user = { ...data, id };
  users.set(id, user);
  return user;
};

const findUserByEmail = (email) => {
  for (const user of users.values()) {
    if (user.email === email) return user;
  }
  return null;
};

// ============ ROUTES ============

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Hotel Dripinn API is running', timestamp: new Date().toISOString() });
});

// Auth Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = findUserByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ 
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token: 'token_' + user.id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Auth Register
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    if (findUserByEmail(email)) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    const user = createUser({ name, email, phone, password, role: 'user' });
    res.json({ 
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token: 'token_' + user.id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bookings
app.post('/api/bookings', (req, res) => {
  try {
    const booking = { id: 'booking_' + bookingIdCounter++, ...req.body, createdAt: new Date() };
    bookings.push(booking);
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/bookings/user/:userId', (req, res) => {
  try {
    const userBookings = bookings.filter(b => b.userId === req.params.userId);
    res.json(userBookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/bookings/:id/cancel', (req, res) => {
  try {
    const booking = bookings.find(b => b.id === req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    booking.status = 'cancelled';
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reviews
app.get('/api/reviews/room/:roomId', (req, res) => {
  try {
    const roomReviews = reviews.filter(r => r.roomId === req.params.roomId && r.approved);
    res.json(roomReviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/reviews', (req, res) => {
  try {
    const review = { id: 'review_' + Date.now(), ...req.body, approved: false, createdAt: new Date() };
    reviews.push(review);
    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin endpoints
app.get('/api/admin/bookings', (req, res) => {
  try {
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/bookings/:id', (req, res) => {
  try {
    const booking = bookings.find(b => b.id === req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    Object.assign(booking, req.body);
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/reviews', (req, res) => {
  try {
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/reviews/:id', (req, res) => {
  try {
    const review = reviews.find(r => r.id === req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    Object.assign(review, req.body);
    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/reviews/:id', (req, res) => {
  try {
    const idx = reviews.findIndex(r => r.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Review not found' });
    reviews.splice(idx, 1);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

export default app;
