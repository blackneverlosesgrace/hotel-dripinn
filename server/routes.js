import express from 'express';
import * as models from './models.js';

const router = express.Router();

// ============ AUTH ROUTES ============

// Register
router.post('/auth/register', (req, res) => {
  const { name, email, phone, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  if (models.findUserByEmail(email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  
  const user = models.createUser({ name, email, phone, password });
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

// Create admin (protected endpoint - in production use auth middleware)
router.post('/auth/register-admin', (req, res) => {
  const { name, email, phone, password, adminKey } = req.body;
  
  // Simple admin key check (in production, use proper auth)
  const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'CHANGE_THIS_IN_ENV_FILE';
  if (adminKey !== ADMIN_SECRET) {
    return res.status(403).json({ error: 'Invalid admin key' });
  }
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  if (models.findUserByEmail(email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  
  const user = models.createUser({ name, email, phone, password, role: 'admin' });
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

// Login
router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = models.findUserByEmail(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  res.json({ 
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token: 'token_' + user.id // Simple token (use JWT in production)
  });
});

// ============ ROOMS ROUTES ============

// Get all rooms (for API consumption)
router.get('/rooms', (req, res) => {
  // Import rooms from constants (in real app, fetch from DB)
  const rooms = [
    { id: 'room-1', hotel: 'Hotel Dripinn - Lucknow', city: 'lucknow', location: 'Sector 1', photos: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80'], price24h: 3500, price4hStandard: 1800 },
    { id: 'room-2', hotel: 'Hotel Dripinn - Lucknow', city: 'lucknow', location: 'Sector 2', photos: ['https://images.unsplash.com/photo-1535597066210-d792b526f0c5?w=500&q=80'], price24h: 4000, price4hStandard: 2000 },
  ];
  res.json(rooms);
});

// ============ BOOKING ROUTES ============

// Create booking
router.post('/bookings', (req, res) => {
  const { userId, roomId, checkIn, checkOut, guests, extraRequests, totalPrice } = req.body;
  
  if (!models.isRoomAvailable(roomId, checkIn, checkOut)) {
    return res.status(400).json({ error: 'Room not available for selected dates' });
  }
  
  const booking = models.createBooking({
    userId,
    roomId,
    checkIn,
    checkOut,
    guests,
    extraRequests,
    totalPrice
  });
  
  res.json(booking);
});

// Get user bookings
router.get('/bookings/user/:userId', (req, res) => {
  const bookings = models.findBookingsByUserId(req.params.userId);
  res.json(bookings);
});

// Get booking details
router.get('/bookings/:id', (req, res) => {
  const booking = models.findBookingById(req.params.id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  res.json(booking);
});

// Cancel booking
router.post('/bookings/:id/cancel', (req, res) => {
  const booking = models.updateBooking(req.params.id, { 
    status: 'cancelled',
    cancelledAt: new Date().toISOString()
  });
  res.json(booking);
});

// Modify booking
router.put('/bookings/:id', (req, res) => {
  const { checkIn, checkOut, guests } = req.body;
  const booking = models.findBookingById(req.params.id);
  
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  
  if (checkIn && checkOut && !models.isRoomAvailable(booking.roomId, checkIn, checkOut)) {
    return res.status(400).json({ error: 'New dates not available' });
  }
  
  const updated = models.updateBooking(req.params.id, { checkIn, checkOut, guests });
  res.json(updated);
});

// ============ PAYMENT ROUTES ============

// Create payment
router.post('/payments', (req, res) => {
  const { bookingId, amount, method, discountApplied } = req.body;
  
  const payment = models.createPayment({
    bookingId,
    amount,
    method,
    discountApplied,
    transactionId: 'TXN' + Date.now()
  });
  
  res.json(payment);
});

// Verify payment (simulate)
router.post('/payments/:id/verify', (req, res) => {
  const payment = models.findPaymentById(req.params.id);
  
  if (!payment) {
    return res.status(404).json({ error: 'Payment not found' });
  }
  
  // Simulate payment verification (80% success rate)
  const isSuccess = Math.random() > 0.2;
  
  const updated = models.updatePayment(req.params.id, {
    status: isSuccess ? 'success' : 'failed'
  });
  
  if (isSuccess) {
    const booking = models.findBookingById(payment.bookingId);
    if (booking) {
      models.updateBooking(booking.id, { paymentStatus: 'paid' });
    }
  }
  
  res.json(updated);
});

// ============ REVIEW ROUTES ============

// Create review
router.post('/reviews', (req, res) => {
  const { userId, roomId, userName, rating, comment } = req.body;
  
  if (!roomId || !rating || !comment) {
    return res.status(400).json({ error: 'Room, rating, and comment required' });
  }
  
  const review = models.createReview({
    userId,
    roomId,
    userName,
    rating,
    comment,
    createdAt: new Date().toISOString()
  });
  
  res.json(review);
});

// Get room reviews
router.get('/reviews/room/:roomId', (req, res) => {
  const reviews = models.findReviewsByRoomId(req.params.roomId);
  res.json(reviews);
});

// Delete review (admin only)
router.delete('/reviews/:id', (req, res) => {
  models.deleteReview(req.params.id);
  res.json({ success: true });
});

// ============ ADMIN ROUTES ============

// Get all bookings (admin)
router.get('/admin/bookings', (req, res) => {
  const bookings = models.getAllBookings();
  res.json(bookings);
});

// Update booking status (admin)
router.put('/admin/bookings/:id', (req, res) => {
  const { status } = req.body;
  const booking = models.updateBooking(req.params.id, { status });
  res.json(booking);
});

// Get all reviews (admin)
router.get('/admin/reviews', (req, res) => {
  const reviews = models.getAllReviews();
  res.json(reviews);
});

// Approve/Reject review
router.put('/admin/reviews/:id', (req, res) => {
  const { status } = req.body;
  const review = models.updateReview(req.params.id, { status });
  res.json(review);
});

export default router;
