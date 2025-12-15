import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { CITIES, ROOMS, formatCurrency, HOTEL_INFO } from '../data/constants';

function Home() {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [duration, setDuration] = useState("24h");
  const todayStr = new Date().toISOString().slice(0, 10);

  function onSearch(e) {
    e.preventDefault();

    if (!city || !checkIn) {
      alert("Please select city and check-in date");
      return;
    }

    const params = new URLSearchParams();
    params.set("city", city);
    if (location) params.set("location", location);
    params.set("checkIn", checkIn);
    if (duration === "24h" && checkOut) params.set("checkOut", checkOut);
    params.set("guests", guests);
    params.set("duration", duration);

    navigate(`/rooms?${params.toString()}`);
  }

  return (
    <main>
      {/* HERO + SEARCH */}
      <section className="relative">
        <div
          className="h-72 sm:h-96 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1501117716987-c8e3a8b4c7a8?w=1600&q=80')",
          }}
        >
          <div
            className="w-full h-full flex items-center"
            style={{
              background:
                "linear-gradient(to right, rgba(0,0,0,0.55), rgba(0,0,0,0.25))",
            }}
          >
            <div className="max-w-7xl mx-auto px-4 w-full">
              <div className="grid lg:grid-cols-2 gap-6 items-center">
                <div className="text-white">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3">
                    {HOTEL_INFO.name}
                  </h1>
                  <p className="text-lg sm:text-xl mb-3">{HOTEL_INFO.tagline}</p>
                  <p className="text-gray-100 text-sm sm:text-base">
                    Safe, comfortable stays across Lucknow, Greater Noida & Rishikesh
                  </p>
                </div>

                {/* SEARCH FORM */}
                <form
                  onSubmit={onSearch}
                  className="bg-white rounded-lg shadow-2xl p-6 space-y-4 max-w-xl ml-auto"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <select
                      className="border p-3 rounded-md text-sm"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        setLocation("");
                      }}
                    >
                      <option value="">Select City</option>
                      {CITIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>

                    <select
                      className="border p-3 rounded-md text-sm"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      disabled={!city}
                    >
                      <option value="">Location</option>
                      {city &&
                        CITIES.find((c) => c.id === city).locations.map((l) => (
                          <option key={l} value={l}>
                            {l}
                          </option>
                        ))}
                    </select>

                    <input
                      type="date"
                      className="border p-3 rounded-md text-sm"
                      value={checkIn}
                      min={todayStr}
                      onChange={(e) => setCheckIn(e.target.value)}
                    />

                    {duration === "24h" && (
                      <input
                        type="date"
                        className="border p-3 rounded-md text-sm"
                        value={checkOut}
                        min={checkIn || todayStr}
                        onChange={(e) => setCheckOut(e.target.value)}
                      />
                    )}
                  </div>

                  <div className="flex gap-3 items-center">
                    <div className="flex items-center gap-2">
                      <label className="text-sm">Guests</label>
                      <input
                        type="number"
                        min={1}
                        className="border p-2 rounded-md w-20 text-sm"
                        value={guests}
                        onChange={(e) =>
                          setGuests(Number(e.target.value))
                        }
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-sm">Duration</label>
                      <select
                        className="border p-2 rounded text-sm"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                      >
                        <option value="4h">≤ 4 hours</option>
                        <option value="6h">≤ 6 hours</option>
                        <option value="24h">24 hours</option>
                      </select>
                    </div>

                    <button className="flex-1 px-4 py-3 bg-emerald-600 text-white font-medium rounded-md">
                      Search
                    </button>
                  </div>

                  <div className="text-xs text-gray-600 border-t pt-3">
                    ✓ No booking fees • ✓ Free cancellation
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR ROOMS */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Our Properties
          </h2>
          <p className="text-gray-600">
            Premium stays in prime locations
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ROOMS.slice(0, 6).map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:-translate-y-1 transition"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={r.photos[0]}
                  alt={r.hotel}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-900">
                  {r.hotel}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {r.location} • {r.guests} guests
                </p>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {r.description}
                </p>

                <div className="text-sm text-gray-700 mb-4">
                  <span className="font-medium">
                    Starting from{" "}
                    {r.price24h
                      ? formatCurrency(r.price24h)
                      : "-"}{" "}
                    / night
                  </span>
                </div>

                <Link
                  to={`/rooms/${r.id}`}
                  className="block text-center px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg"
                >
                  See availability
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="bg-emerald-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">About {HOTEL_INFO.name}</h2>
          <p className="text-gray-700 mb-8 leading-relaxed max-w-3xl">
            {HOTEL_INFO.description}
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Why Choose Us</h3>
              <ul className="space-y-3">
                {HOTEL_INFO.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-emerald-600 font-bold mt-1">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Presence</h3>
              <ul className="space-y-3 mb-6">
                {HOTEL_INFO.presence.map((location, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-emerald-600 font-bold mt-1">📍</span>
                    <span className="text-gray-700">{location}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-bold text-gray-900 mb-4">Featured In</h3>
              <div className="flex flex-wrap gap-2">
                {HOTEL_INFO.media.map((outlet, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white rounded-full text-sm text-emerald-700 border border-emerald-200">
                    {outlet}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
