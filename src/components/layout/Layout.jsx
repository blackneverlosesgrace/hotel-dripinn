import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-emerald-600">
            🏨 Hotel Dripinn
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 items-center">
            <Link to="/" className="text-gray-700 hover:text-emerald-600">
              Home
            </Link>
            <Link to="/rooms" className="text-gray-700 hover:text-emerald-600">
              Rooms
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-emerald-600">
              About & Services
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-emerald-600">
              Contact
            </Link>
            
            {user ? (
              <>
                <Link to="/my-bookings" className="text-gray-700 hover:text-emerald-600">
                  My Bookings
                </Link>
                <div className="relative group">
                  <button className="text-gray-700 hover:text-emerald-600 flex items-center gap-2">
                    👤 {user.name}
                  </button>
                  <div className="hidden group-hover:block absolute right-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-emerald-600">
                  Login
                </Link>
                <Link to="/register" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            {user ? (
              <Link to="/profile" className="text-emerald-600">
                👤
              </Link>
            ) : (
              <Link to="/login" className="text-emerald-600">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">Hotel Dripinn</h3>
              <p className="text-gray-400 text-sm">Your home away from home</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="text-gray-400 hover:text-white">About</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                <li><Link to="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Policies</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/policies" className="text-gray-400 hover:text-white">Cancellation</Link></li>
                <li><Link to="/policies" className="text-gray-400 hover:text-white">Terms</Link></li>
                <li><Link to="/policies" className="text-gray-400 hover:text-white">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <p className="text-gray-400 text-sm">📞 +91-8765432100</p>
              <p className="text-gray-400 text-sm">📧 info@dripinn.com</p>
              <p className="text-gray-400 text-sm">💬 WhatsApp</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 Hotel Dripinn. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
