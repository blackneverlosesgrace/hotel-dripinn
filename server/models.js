// In-memory database models (In production, use MongoDB/PostgreSQL)
// For now, we'll simulate with JSON storage

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'db.json');

let db = {
  users: [],
  bookings: [],
  reviews: [],
  payments: [],
  blockedDates: []
};

// Initialize DB
function initDB() {
  try {
    if (fs.existsSync(dbPath)) {
      db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    }
  } catch (err) {
    console.log('Creating new DB');
  }
  saveDB();
}

function saveDB() {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error('Error saving DB:', err);
  }
}

// Users
export function createUser(userData) {
  const user = {
    id: Date.now().toString(),
    ...userData,
    createdAt: new Date().toISOString(),
    role: userData.role || 'user' // 'admin', 'employee', 'user'
  };
  db.users.push(user);
  saveDB();
  return user;
}

export function findUserByEmail(email) {
  return db.users.find(u => u.email === email);
}

export function findUserById(id) {
  return db.users.find(u => u.id === id);
}

export function updateUser(id, updates) {
  const user = db.users.find(u => u.id === id);
  if (user) {
    Object.assign(user, updates);
    saveDB();
  }
  return user;
}

// Bookings
export function createBooking(bookingData) {
  const booking = {
    id: 'BK' + Date.now(),
    ...bookingData,
    createdAt: new Date().toISOString(),
    status: 'confirmed', // 'pending', 'confirmed', 'completed', 'cancelled'
    paymentStatus: 'pending' // 'pending', 'paid', 'failed'
  };
  db.bookings.push(booking);
  saveDB();
  return booking;
}

export function findBookingById(id) {
  return db.bookings.find(b => b.id === id);
}

export function findBookingsByUserId(userId) {
  return db.bookings.filter(b => b.userId === userId);
}

export function updateBooking(id, updates) {
  const booking = db.bookings.find(b => b.id === id);
  if (booking) {
    Object.assign(booking, updates);
    saveDB();
  }
  return booking;
}

export function getAllBookings() {
  return db.bookings;
}

// Reviews
export function createReview(reviewData) {
  const review = {
    id: 'REV' + Date.now(),
    ...reviewData,
    createdAt: new Date().toISOString(),
    status: 'pending' // 'pending', 'approved', 'rejected'
  };
  db.reviews.push(review);
  saveDB();
  return review;
}

export function findReviewsByRoomId(roomId) {
  return db.reviews.filter(r => r.roomId === roomId && r.status === 'approved');
}

export function getAllReviews() {
  return db.reviews;
}

export function updateReview(id, updates) {
  const review = db.reviews.find(r => r.id === id);
  if (review) {
    Object.assign(review, updates);
    saveDB();
  }
  return review;
}

export function deleteReview(id) {
  db.reviews = db.reviews.filter(r => r.id !== id);
  saveDB();
}

// Payments
export function createPayment(paymentData) {
  const payment = {
    id: 'PAY' + Date.now(),
    ...paymentData,
    createdAt: new Date().toISOString(),
    status: 'pending' // 'pending', 'success', 'failed'
  };
  db.payments.push(payment);
  saveDB();
  return payment;
}

export function findPaymentById(id) {
  return db.payments.find(p => p.id === id);
}

export function updatePayment(id, updates) {
  const payment = db.payments.find(p => p.id === id);
  if (payment) {
    Object.assign(payment, updates);
    saveDB();
  }
  return payment;
}

// Check availability
export function isRoomAvailable(roomId, checkIn, checkOut) {
  const conflicts = db.bookings.filter(b => {
    if (b.roomId !== roomId || b.status === 'cancelled') return false;
    const bookingStart = new Date(b.checkIn);
    const bookingEnd = new Date(b.checkOut);
    const searchStart = new Date(checkIn);
    const searchEnd = new Date(checkOut);
    return searchStart < bookingEnd && searchEnd > bookingStart;
  });
  return conflicts.length === 0;
}

// Calculate average rating
export function calculateAverageRating(roomId) {
  const reviews = findReviewsByRoomId(roomId);
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return (sum / reviews.length).toFixed(1);
}

initDB();
