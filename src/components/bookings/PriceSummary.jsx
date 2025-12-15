export default function PriceSummary({ price, taxes }) {
  return (
    <div className="bg-gray-50 p-4 rounded">
      <div>Subtotal: ₹{price}</div>
      <div>Taxes: ₹{taxes}</div>
      <div>Total: ₹{price + taxes}</div>
    </div>
  );
}
