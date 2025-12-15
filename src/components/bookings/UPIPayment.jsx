import { useState } from 'react';
import QRCodeComponent from './QRCode';

export default function UPIPayment({ guestData, bookingDetails, bookingId, onSuccess, onBack }) {
  const [upiId, setUpiId] = useState('');
  const [paymentType, setPaymentType] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const saveBookingToBackend = async (paymentStatus, transactionId = '') => {
    try {
      const response = await fetch('https://hoteldripinn-16vgzp4a5-swatis-projects-d5718665.vercel.app/api/bookings', {
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
          paymentMethod: 'online',
          paymentStatus: paymentStatus,
          transactionId: transactionId,
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

  const handleUPIPayment = async () => {
    if (!upiId.trim()) {
      alert('Please enter your UPI ID');
      return;
    }

    const transactionId = prompt('Please enter your UPI Transaction ID (12-digit reference number):');
    if (!transactionId || transactionId.trim().length < 10) {
      alert('Valid Transaction ID is required for verification');
      return;
    }

    setIsProcessing(true);

    // Save booking with pending verification status
    await saveBookingToBackend('pending-verification', transactionId);

    const message = `Hi, Payment initiated!\n\nBooking ID: ${bookingId}\nTransaction ID: ${transactionId}\nUPI ID: ${upiId}\n\nName: ${guestData.fullName}\nPhone: ${guestData.phone}\n\nRoom: ${bookingDetails.roomName}\nCheck-in: ${bookingDetails.checkIn}\nCheck-out: ${bookingDetails.checkOut}\nAmount: ₹${bookingDetails.totalAmount}\n\nPlease verify this payment.`;
    
    const whatsappUrl = `https://wa.me/917706978533?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    setIsProcessing(false);
    if (onSuccess) {
      onSuccess({
        method: 'upi',
        upiId,
        transactionId,
        bookingId,
        status: 'pending-verification',
        message: 'Payment submitted! We will verify and confirm your booking shortly.'
      });
    }
  };

  const handleQRPayment = async () => {
    const transactionId = prompt('After scanning and paying, please enter your UPI Transaction ID (12-digit reference number):');
    if (!transactionId || transactionId.trim().length < 10) {
      alert('Valid Transaction ID is required for verification');
      return;
    }

    setIsProcessing(true);

    // Save booking with pending verification status
    await saveBookingToBackend('pending-verification', transactionId);

    const message = `Hi, Payment initiated!\n\nBooking ID: ${bookingId}\nTransaction ID: ${transactionId}\n\nName: ${guestData.fullName}\nPhone: ${guestData.phone}\n\nRoom: ${bookingDetails.roomName}\nCheck-in: ${bookingDetails.checkIn}\nCheck-out: ${bookingDetails.checkOut}\nAmount: ₹${bookingDetails.totalAmount}\n\nPlease verify this payment.`;
    
    const whatsappUrl = `https://wa.me/917706978533?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    setIsProcessing(false);
    if (onSuccess) {
      onSuccess({
        method: 'qr',
        transactionId,
        bookingId,
        status: 'pending-verification',
        message: 'Payment submitted! We will verify and confirm your booking shortly.'
      });
    }
  };

  if (paymentType === 'upi') {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">UPI Payment</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your UPI ID
            </label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="yourname@upi"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-gray-500 text-xs mt-1">Example: yourname@okaxis, yourname@okhdfcbank</p>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">
              <strong>Amount to Pay:</strong> ₹{bookingDetails.totalAmount}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleUPIPayment}
              disabled={isProcessing}
              className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {isProcessing ? 'Processing...' : 'Pay with UPI'}
            </button>
            <button
              onClick={() => setPaymentType(null)}
              className="px-6 bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentType === 'qr') {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Scan QR Code to Pay</h3>
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <QRCodeComponent amount={bookingDetails.totalAmount} />
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">
              <strong>Amount to Pay:</strong> ₹{bookingDetails.totalAmount}
            </p>
            <p className="text-sm text-gray-600 mt-2">Scan this QR code with any UPI app to make payment</p>
          </div>

          <button
            onClick={handleQRPayment}
            disabled={isProcessing}
            className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
          >
            {isProcessing ? 'Processing...' : 'Confirm Payment'}
          </button>

          <button
            onClick={() => setPaymentType(null)}
            className="w-full bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Online Payment</h3>
      
      <div className="space-y-3">
        <button
          onClick={() => setPaymentType('upi')}
          className="w-full border-2 border-gray-300 rounded-lg p-4 text-left hover:border-blue-600 hover:bg-blue-50 transition"
        >
          <h4 className="font-semibold">Pay with UPI</h4>
          <p className="text-sm text-gray-600">Enter your UPI ID</p>
        </button>

        <button
          onClick={() => setPaymentType('qr')}
          className="w-full border-2 border-gray-300 rounded-lg p-4 text-left hover:border-blue-600 hover:bg-blue-50 transition"
        >
          <h4 className="font-semibold">Scan QR Code</h4>
          <p className="text-sm text-gray-600">Use any UPI app to scan</p>
        </button>
      </div>

      <button
        onClick={onBack}
        className="w-full mt-4 bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-400 transition"
      >
        Back to Payment Method
      </button>
    </div>
  );
}
