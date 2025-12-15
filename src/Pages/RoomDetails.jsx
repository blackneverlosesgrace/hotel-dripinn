import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ROOMS, formatCurrency } from '../data/constants';
import ReviewsSection from '../components/ReviewsSection';

function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const loc = useLocation();
  const params = new URLSearchParams(loc.search);

  const room = ROOMS.find((r) => r.id === id);

  const [duration, setDuration] = useState(params.get("duration") || "24h");
  const [variant, setVariant] = useState("standard");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  if (!room) return <div className="p-6">Room not found</div>;

  function getPrice() {
    if (duration === "4h") {
      if (variant === "deluxe" && room.price4hDeluxe)
        return room.price4hDeluxe;
      return (
        room.price4hStandard ??
        (room.price24h ? Math.round(room.price24h * 0.5) : null)
      );
    }

    if (duration === "6h") {
      const base =
        room.price4hStandard ??
        (room.price24h ? Math.round(room.price24h * 0.5) : null);
      return base ? Math.round(base * 1.4) : null;
    }

    return room.price24h;
  }

  const price = getPrice();

  function onReserve() {
    const p = new URLSearchParams();
    p.set("roomId", room.id);
    p.set("duration", duration);
    p.set("variant", variant);
    p.set("checkIn", checkIn);
    p.set("checkOut", checkOut);
    p.set("guests", guests);
    navigate(`/booking?${p.toString()}`);
  }

  return (
    <div className="max-w-7xl mx-auto p-6 grid lg:grid-cols-3 gap-6">
      {/* LEFT CONTENT */}
      <div className="lg:col-span-2 space-y-6">
        <img
          src={room.photos[0]}
          alt={room.hotel}
          className="w-full h-96 object-cover rounded-lg"
        />

        <div>
          <h1 className="text-2xl font-extrabold">{room.hotel}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {room.location} • {room.city.toUpperCase()}
          </p>
        </div>

        <div className="bg-white p-5 rounded shadow space-y-3">
          <h3 className="font-semibold">About this property</h3>
          <p className="text-sm text-gray-600">{room.description}</p>

          <div className="text-sm">
            <strong>Address:</strong> {room.address}
          </div>

          {room.mapsUrl && (
            <a
              href={room.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-600 text-sm"
            >
              Show on map
            </a>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            {room.amenities.map((a) => (
              <span
                key={a}
                className="px-2 py-1 border rounded text-xs"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div className="lg:col-span-2">
        <ReviewsSection roomId={room.id} />
      </div>

      {/* RIGHT STICKY BOOKING CARD */}
      <aside className="bg-white rounded-lg shadow p-5 sticky top-6 h-fit">
        <div className="mb-4">
          <div className="text-sm text-gray-500">Price for {duration}</div>
          <div className="text-3xl font-extrabold text-emerald-600">
            {price ? formatCurrency(price) : "-"}
          </div>
          <div className="text-xs text-gray-500">
            Includes taxes & fees
          </div>
        </div>

        <div className="space-y-3">
          <select
            className="w-full border p-2 rounded"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            <option value="4h">Up to 4 hours</option>
            <option value="6h">Up to 6 hours</option>
            <option value="24h">24 hours</option>
          </select>

          {room.price4hDeluxe && duration === "4h" ? (
            <select
              className="w-full border p-2 rounded"
              value={variant}
              onChange={(e) => setVariant(e.target.value)}
            >
              <option value="standard">Standard</option>
              <option value="deluxe">Deluxe</option>
            </select>
          ) : null}

          <input
            type="date"
            className="w-full border p-2 rounded"
            value={checkIn}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setCheckIn(e.target.value)}
          />

          {duration === "24h" && (
            <input
              type="date"
              className="w-full border p-2 rounded"
              value={checkOut}
              min={checkIn || new Date().toISOString().split('T')[0]}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          )}

          <input
            type="number"
            min={1}
            className="w-full border p-2 rounded"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
          />

          <button
            onClick={onReserve}
            className="w-full mt-2 px-4 py-3 bg-emerald-600 text-white font-semibold rounded hover:bg-emerald-700"
          >
            Reserve
          </button>

          <div className="text-xs text-gray-500 text-center">
            You won’t be charged yet
          </div>
        </div>
      </aside>
    </div>
  );
}

export default RoomDetails;
