import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CITIES, ROOMS, formatCurrency } from '../data/constants';

function Rooms() {
  const locationHook = useLocation();
  const queryParams = new URLSearchParams(locationHook.search);

  const [city, setCity] = useState(queryParams.get("city") || "");
  const [location, setLocation] = useState(queryParams.get("location") || "");
  const [duration, setDuration] = useState(queryParams.get("duration") || "24h");
  const [roomType, setRoomType] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(99999);
  const [amenities, setAmenities] = useState([]);

  function toggleAmenity(a) {
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  }

  function getPrice(room) {
    if (duration === "4h") {
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

  const filteredRooms = ROOMS.filter((r) => {
    if (city && r.city !== city) return false;
    if (location && r.location !== location) return false;
    if (roomType && r.type !== roomType) return false;

    const price = getPrice(r);
    if (price == null) return false;
    if (price < minPrice || price > maxPrice) return false;

    if (amenities.length && !amenities.every((a) => r.amenities.includes(a)))
      return false;

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-extrabold mb-4">
        Hotel Dripinn - Available Properties
      </h1>

      <div className="grid md:grid-cols-4 gap-6">
        {/* FILTERS */}
        <aside className="md:col-span-1 bg-white p-4 rounded shadow-sm space-y-4">
          <h3 className="font-medium">Filter by</h3>

          <select
            className="w-full p-2 border rounded"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setLocation("");
            }}
          >
            <option value="">All cities</option>
            {CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            className="w-full p-2 border rounded"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={!city}
          >
            <option value="">All locations</option>
            {city &&
              CITIES.find((c) => c.id === city).locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
          </select>

          <select
            className="w-full p-2 border rounded"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
          >
            <option value="">Any room type</option>
            {[...new Set(ROOMS.map((r) => r.type))].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <div>
            <label className="text-sm">Duration</label>
            <select
              className="w-full p-2 border rounded"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option value="4h">Up to 4 hours</option>
              <option value="6h">Up to 6 hours</option>
              <option value="24h">24 hours</option>
            </select>
          </div>

          <div>
            <label className="text-sm">Price range</label>
            <div className="flex gap-2">
              <input
                type="number"
                className="w-full p-2 border rounded"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
              />
              <input
                type="number"
                className="w-full p-2 border rounded"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <div className="text-sm mb-2">Amenities</div>
            <div className="flex flex-wrap gap-2">
              {["WiFi", "Breakfast", "AC", "Gym"].map((a) => (
                <button
                  key={a}
                  onClick={() => toggleAmenity(a)}
                  className={`px-2 py-1 border rounded text-sm ${
                    amenities.includes(a)
                      ? "bg-emerald-600 text-white"
                      : ""
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* RESULTS */}
        <section className="md:col-span-3 grid sm:grid-cols-2 gap-6">
          {filteredRooms.length ? (
            filteredRooms.map((r) => {
              const price = getPrice(r);

              return (
                <div
                  key={r.id}
                  className="bg-white rounded-lg shadow overflow-hidden"
                >
                  <img
                    src={r.photos[0]}
                    alt={r.hotel}
                    className="w-full h-52 object-cover"
                  />

                  <div className="p-4">
                    <h3 className="font-bold">{r.hotel}</h3>
                    <p className="text-sm text-gray-500">
                      {r.location} • {r.guests} guests
                    </p>

                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {r.description}
                    </p>

                    <div className="mt-3 flex justify-between items-end">
                      <div>
                        <div className="text-sm text-gray-500">
                          Price for {duration}
                        </div>
                        <div className="text-lg font-bold text-emerald-600">
                          {price ? formatCurrency(price) : "-"}
                        </div>
                      </div>

                      <Link
                        to={`/rooms/${r.id}?duration=${duration}`}
                        className="px-4 py-2 bg-emerald-600 text-white rounded text-sm"
                      >
                        See availability
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-6">No rooms match your filters.</div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Rooms;
