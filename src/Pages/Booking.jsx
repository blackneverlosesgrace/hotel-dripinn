import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import GuestForm from '../components/bookings/GuestForm';
import PriceSummary from '../components/bookings/PriceSummary';
import PaymentMethod from '../components/bookings/PaymentMethod';
import { ROOMS } from '../data/constants';

function Booking() {
  const [searchParams] = useSearchParams();
  const [guestData, setGuestData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  const roomId = searchParams.get('roomId');
  const room = ROOMS.find(r => r.id === roomId);

  const bookingDetails = {
    roomId: roomId,
    roomName: room?.hotel || 'Hotel Room',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    totalAmount: 4500
  };

  const handlePaymentSuccess = (data) => {
    setPaymentData(data);
    alert(`✅ ${data.message}\n\nBooking ID: ${data.bookingId}\n\nA WhatsApp message has been sent to you.`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>
      
      {!guestData ? (
        <div className="grid md:grid-cols-2 gap-6">
          <GuestForm setData={setGuestData} />
          <PriceSummary price={bookingDetails.totalAmount} taxes={Math.round(bookingDetails.totalAmount * 0.18)} />
        </div>
      ) : !paymentData ? (
        <div className="grid md:grid-cols-2 gap-6">
          <PaymentMethod 
            guestData={guestData}
            bookingDetails={bookingDetails}
            onPaymentSuccess={handlePaymentSuccess}
          />
          <PriceSummary price={bookingDetails.totalAmount} taxes={Math.round(bookingDetails.totalAmount * 0.18)} />
        </div>
      ) : (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-600 mb-4">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">Your booking has been successfully confirmed.</p>
          
          <div className="bg-gray-50 p-4 rounded-lg text-left mb-6">
            <p><strong>Booking ID:</strong> {paymentData.bookingId}</p>
            <p><strong>Guest Name:</strong> {guestData.fullName}</p>
            <p><strong>Hotel:</strong> {bookingDetails.roomName}</p>
            <p><strong>Check-in:</strong> {bookingDetails.checkIn}</p>
            <p><strong>Check-out:</strong> {bookingDetails.checkOut}</p>
            <p><strong>Payment Method:</strong> {paymentData.method === 'hotel' ? 'At Hotel' : 'Online'}</p>
            <p><strong>Status:</strong> {paymentData.status === 'completed' ? '✅ Paid' : '⏳ Pending'}</p>
          </div>

          <button
            onClick={() => window.location.href = '/'}
            className="bg-emerald-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-emerald-700 transition"
          >
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
}

export default Booking;
