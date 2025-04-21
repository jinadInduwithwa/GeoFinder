import { useState, useEffect, useContext } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

function MobileNavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  // Reset menu state when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        setUser(null);
        toast.success("Logged out successfully!");
        navigate("/signin");
      } else {
        toast.error("Failed to log out. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Logout error:", error);
    }
    setIsMenuOpen(false);
  };

  return (
    <nav
      className="md:hidden fixed w-screen top-0 z-50 shadow-lg"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
    >
      <div className="mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-green-600">
            GeoFinder
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 hover:text-green-600 transition-colors"
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="bg-transparent shadow-lg px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/countries-list"
              className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors"
            >
              Explore
            </Link>
            {user && (
              <Link
                to="/countries-list"
                className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors"
              >
                Favourite
              </Link>
            )}
            {user ? (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/signin"
                className="block px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default MobileNavBar;