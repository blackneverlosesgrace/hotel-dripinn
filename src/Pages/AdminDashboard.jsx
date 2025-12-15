import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalReviews: 0,
    totalRevenue: 0,
    avgRating: 0
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [bookingsRes, reviewsRes] = await Promise.all([
        fetch('https://hoteldripinn-qcajs976t-swatis-projects-d5718665.vercel.app/api/admin/bookings'),
        fetch('https://hoteldripinn-qcajs976t-swatis-projects-d5718665.vercel.app/api/admin/reviews')
      ]);

      const bookingsData = await bookingsRes.json();
      const reviewsData = await reviewsRes.json();

      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);

      // Calculate stats
      const totalRevenue = bookingsData.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
      const avgRating = reviewsData.length > 0 
        ? (reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewsData.length).toFixed(1)
        : 0;

      setStats({
        totalBookings: bookingsData.length,
        totalReviews: reviewsData.length,
        totalRevenue,
        avgRating
      });
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const res = await fetch(`https://hoteldripinn-qcajs976t-swatis-projects-d5718665.vercel.app/api/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
      }
    } catch (err) {
      console.error('Error updating booking:', err);
    }
  };

  const approveReview = async (reviewId) => {
    try {
      const res = await fetch(`https://hoteldripinn-qcajs976t-swatis-projects-d5718665.vercel.app/api/admin/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
      });

      if (res.ok) {
        setReviews(reviews.map(r => r.id === reviewId ? { ...r, status: 'approved' } : r));
      }
    } catch (err) {
      console.error('Error approving review:', err);
    }
  };

  const rejectReview = async (reviewId) => {
    try {
      const res = await fetch(`https://hoteldripinn-qcajs976t-swatis-projects-d5718665.vercel.app/api/reviews/${reviewId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setReviews(reviews.filter(r => r.id !== reviewId));
      }
    } catch (err) {
      console.error('Error rejecting review:', err);
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto p-6 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-600 text-sm font-medium">Total Bookings</div>
          <div className="text-3xl font-bold text-emerald-600">{stats.totalBookings}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-600 text-sm font-medium">Total Revenue</div>
          <div className="text-3xl font-bold text-emerald-600">₹{stats.totalRevenue.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-600 text-sm font-medium">Total Reviews</div>
          <div className="text-3xl font-bold text-emerald-600">{stats.totalReviews}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-600 text-sm font-medium">Avg Rating</div>
          <div className="text-3xl font-bold text-yellow-500">{stats.avgRating} ★</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 font-semibold ${activeTab === 'bookings' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-gray-600'}`}
        >
          Bookings
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 font-semibold ${activeTab === 'reviews' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-gray-600'}`}
        >
          Reviews
        </button>
      </div>

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Guest</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Check-in</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Payment</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Transaction ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-600">No bookings yet</td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{booking.id}</td>
                    <td className="px-6 py-4 text-sm">
                      <div>{booking.guestName || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{booking.guestPhone}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">{new Date(booking.checkIn).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm font-semibold">₹{booking.totalPrice}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        booking.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                        booking.paymentStatus === 'pending-verification' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.paymentStatus || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-xs">
                      {booking.transactionId || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {booking.paymentStatus === 'pending-verification' ? (
                        <button
                          onClick={() => {
                            if (confirm('Verify this payment as completed?')) {
                              updateBookingStatus(booking.id, 'confirmed');
                            }
                          }}
                          className="px-3 py-1 bg-emerald-600 text-white text-xs rounded hover:bg-emerald-700"
                        >
                          Verify Payment
                        </button>
                      ) : (
                        <select
                          onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                          defaultValue={booking.status}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
              No reviews yet
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{review.userName}</h3>
                    <div className="flex gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Room: {review.roomId}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    review.status === 'approved' ? 'bg-green-100 text-green-800' :
                    review.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {review.status || 'pending'}
                  </span>
                </div>

                <p className="text-gray-700 mb-4">{review.comment}</p>

                <div className="flex gap-3">
                  {review.status !== 'approved' && (
                    <button
                      onClick={() => approveReview(review.id)}
                      className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => rejectReview(review.id)}
                    className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
