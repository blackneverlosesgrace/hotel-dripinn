export default function Policies() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">Policies & Terms</h1>

        <section className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cancellation Policy</h2>
          <ul className="space-y-3 text-gray-700">
            <li> Cancellations 24 hours before check-in: Full refund</li>
            <li> Cancellations less than 24 hours: 50% forfeit</li>
            <li> No-shows: 100% forfeit</li>
          </ul>
        </section>

        <section className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Policy</h2>
          <ul className="space-y-3 text-gray-700">
            <li> Refunds processed within 5-7 business days</li>
            <li> Online discounts non-refundable</li>
            <li> GST is non-refundable</li>
          </ul>
        </section>

        <section className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Terms & Conditions</h2>
          <p className="text-gray-700 mb-4">By booking with us, you agree to our terms. We reserve the right to refuse entry and cancel bookings for suspicious activity.</p>
          <p className="text-gray-700">Guests are responsible for belongings. Hotel Dripinn is not liable for loss or theft.</p>
        </section>
      </div>
    </div>
  );
}
