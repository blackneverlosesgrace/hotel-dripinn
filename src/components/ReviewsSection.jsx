import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ReviewsSection({ roomId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`https://hoteldripinn-occk67r7h-swatis-projects-d5718665.vercel.app/api/reviews/room/${roomId}`);
      const data = await res.json();
      setReviews(data);
      
      if (data.length > 0) {
        const avg = (data.reduce((sum, r) => sum + r.rating, 0) / data.length).toFixed(1);
        setAverageRating(avg);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to leave a review');
      return;
    }

    if (!newReview.comment.trim()) {
      alert('Please write a comment');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('https://hoteldripinn-occk67r7h-swatis-projects-d5718665.vercel.app/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          userId: user.id,
          userName: user.name,
          rating: newReview.rating,
          comment: newReview.comment
        })
      });

      if (res.ok) {
        setNewReview({ rating: 5, comment: '' });
        fetchReviews();
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 mt-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Guest Reviews</h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-emerald-600">{averageRating}</div>
              <div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"}>★</span>
                  ))}
                </div>
                <div className="text-sm text-gray-600">{reviews.length} reviews</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Review Form */}
      {user && (
        <form onSubmit={handleSubmitReview} className="bg-gray-50 p-6 rounded-lg mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Your Experience</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  className={`text-3xl ${newReview.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Share your experience..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              rows="4"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:bg-gray-400"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {!user && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-8">
          Please <a href="/login" className="font-semibold underline">login</a> to leave a review
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-8">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-600">No reviews yet. Be the first to review!</div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold text-gray-900">{review.userName}</div>
                  <div className="flex gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
              <p className="text-gray-700 mt-2">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
