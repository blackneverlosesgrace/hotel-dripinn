import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for contacting us!');
    setForm({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">Contact Us</h1>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">📞 Phone</h3>
                <p className="text-gray-700">+91-8765432100</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">📧 Email</h3>
                <p className="text-gray-700">info@dripinn.com</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">💬 WhatsApp</h3>
                <a href="https://wa.me/918765432100" className="text-emerald-600 hover:underline">Chat with us</a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows="5" className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white font-semibold py-2 rounded-lg hover:bg-emerald-700">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
