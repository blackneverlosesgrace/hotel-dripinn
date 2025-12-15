import { useState } from 'react';
import UPIPayment from './UPIPayment';

export default function PaymentMethod({ guestData, bookingDetails, onPaymentSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [bookingId] = useState(`BK${Date.now()}`);

  const saveBookingToBackend = async (paymentStatus) => {
    try {
      const response = await fetch('http://localhost:3000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: bookingId,
          userId: localStorage.getItem('userId') || 'guest',
          roomId: bookingDetails.roomId,
          roomName: bookingDetails.roomName,
          guestName: guestData.fullName,
          guestEmail: guestData.email,
          guestPhone: guestData.phone,
          guestAddress: guestData.address || '',
          guestCity: guestData.city || '',
          guestPostalCode: guestData.postalCode || '',
          checkIn: bookingDetails.checkIn,
          checkOut: bookingDetails.checkOut,
          totalAmount: bookingDetails.totalAmount,
          paymentMethod: paymentMethod === 'hotel' ? 'hotel' : 'online',
          paymentStatus: paymentStatus,
          createdAt: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error('Failed to save booking');
      return await response.json();
    } catch (error) {
      console.error('Error saving booking:', error);
      alert('Booking saved locally but sync failed. Contact support.');
    }
  };

  const handleHotelPayment = async () => {
    if (!guestData?.phone) {
      alert('Phone number is required for hotel payment');
      return;
    }

    const message = `Hi, I have a booking at Hotel Dripinn\n\nBooking ID: ${bookingId}\nName: ${guestData.fullName}\nPhone: ${guestData.phone}\nEmail: ${guestData.email}\n\nRoom Details:\n${bookingDetails.roomName}\nCheck-in: ${bookingDetails.checkIn}\nCheck-out: ${bookingDetails.checkOut}\n\nTotal Amount: ₹${bookingDetails.totalAmount}\n\nI will make the payment at the hotel.`;
    
    const whatsappUrl = `https://wa.me/917706978533?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Save booking to backend
    await saveBookingToBackend('pending');
    
    if (onPaymentSuccess) {
      onPaymentSuccess({
        method: 'hotel',
        bookingId,
        status: 'pending',
        message: 'Booking confirmed! Please make payment at the hotel.'
      });
    }
  };

  const handleOnlinePayment = () => {
    setPaymentMethod('upi');
  };

  if (paymentMethod === 'upi') {
    return (
      <UPIPayment 
        guestData={guestData}
        bookingDetails={bookingDetails}
        bookingId={bookingId}
        onSuccess={onPaymentSuccess}
        onBack={() => setPaymentMethod(null)}
      />
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
      
      <div className="space-y-4">
        {/* Hotel Payment Option */}
        <div 
          onClick={() => setPaymentMethod('hotel')}
          className="border-2 border-gray-300 rounded-lg p-4 cursor-pointer hover:border-emerald-600 hover:bg-emerald-50 transition"
        >
          <div className="flex items-start">
            <input 
              type="radio" 
              checked={paymentMethod === 'hotel'} 
              onChange={() => setPaymentMethod('hotel')}
              className="mt-1 mr-4"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Make Payment at Hotel</h3>
              <p className="text-gray-600 text-sm mt-1">Pay when you arrive at the hotel</p>
              <p className="text-gray-500 text-xs mt-2">✓ Share booking details via WhatsApp</p>
            </div>
          </div>
        </div>

        {/* Online Payment Option */}
        <div 
          onClick={() => setPaymentMethod('online')}
          className="border-2 border-gray-300 rounded-lg p-4 cursor-pointer hover:border-emerald-600 hover:bg-emerald-50 transition"
        >
          <div className="flex items-start">
            <input 
              type="radio" 
              checked={paymentMethod === 'online'} 
              onChange={() => setPaymentMethod('online')}
              className="mt-1 mr-4"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Pay Online</h3>
              <p className="text-gray-600 text-sm mt-1">UPI or QR Code payment</p>
              <p className="text-gray-500 text-xs mt-2">✓ Instant confirmation</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          {paymentMethod === 'hotel' && (
            <button
              onClick={handleHotelPayment}
              className="flex-1 bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition"
            >
              Send Details via WhatsApp
            </button>
          )}
          {paymentMethod === 'online' && (
            <button
              onClick={handleOnlinePayment}
              className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Continue to Online Payment
            </button>
          )}
          <button
            onClick={() => setPaymentMethod(null)}
            className="px-6 bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-400 transition"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
