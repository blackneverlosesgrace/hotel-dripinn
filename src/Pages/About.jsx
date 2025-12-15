import { HOTEL_INFO } from '../data/constants';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-emerald-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">About Hotel Dripinn</h1>
          <p className="text-xl text-emerald-100">{HOTEL_INFO.tagline}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <p className="text-lg text-gray-700 leading-relaxed">{HOTEL_INFO.description}</p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Us</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {HOTEL_INFO.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-md">
                <span className="text-2xl text-emerald-600">✓</span>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Featured In</h2>
          <div className="flex flex-wrap gap-3">
            {HOTEL_INFO.media.map((outlet, idx) => (
              <span key={idx} className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full font-semibold">{outlet}</span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
