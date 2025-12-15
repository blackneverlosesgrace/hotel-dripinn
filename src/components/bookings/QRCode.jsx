import qrCodeImage from '../../assets/payment-qr.png';

export default function QRCodeComponent({ amount }) {
  return (
    <div className="bg-white p-6 rounded-lg border-2 border-gray-300">
      <div className="w-64 h-64 flex items-center justify-center">
        <img 
          src={qrCodeImage} 
          alt="UPI Payment QR Code" 
          className="w-full h-full object-contain"
          onError={(e) => {
            // Fallback if image not found
            e.target.style.display = 'none';
            e.target.nextElementSibling.style.display = 'flex';
          }}
        />
        <div className="hidden w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg items-center justify-center border-2 border-dashed border-gray-400">
          <div className="text-center">
            <div className="text-4xl mb-2">📱</div>
            <p className="text-sm text-gray-600">UPI QR Code</p>
            <p className="text-xs text-gray-500 mt-2">₹{amount}</p>
            <p className="text-xs text-red-500 mt-2">Image not found</p>
          </div>
        </div>
      </div>
      <p className="text-center text-sm font-semibold text-gray-700 mt-3">
        Amount: ₹{amount}
      </p>
      <p className="text-center text-xs text-gray-500 mt-2">
        Scan with Google Pay, PhonePe, Paytm, or any UPI app
      </p>
    </div>
  );
}
