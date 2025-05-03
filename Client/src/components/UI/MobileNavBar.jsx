import { useState, useEffect, useContext } from "react";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  ArrowRightStartOnRectangleIcon,
  ArrowLeftEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
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
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 w-screen z-50 shadow-lg"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
    >
      <div className="mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {/* Home Icon */}
          <Link to="/" className="flex flex-col items-center text-gray-700 hover:text-green-600 transition-colors">
            <HomeIcon className="h-6 w-6" />
            <span className="text-xs">Home</span>
          </Link>

          {/* Explore Icon */}
          <Link
            to="/countries-list"
            className="flex flex-col items-center text-gray-700 hover:text-green-600 transition-colors"
          >
            <MagnifyingGlassIcon className="h-6 w-6" />
            <span className="text-xs">Explore</span>
          </Link>

          {/* Favourite Icon (only if logged in) */}
          {user && (
            <Link
              to="/favourite"
              className="flex flex-col items-center text-gray-700 hover:text-green-600 transition-colors"
            >
              <HeartIcon className="h-6 w-6" />
              <span className="text-xs">Favourite</span>
            </Link>
          )}

          {/* Logout/Sign In Icon */}
          {user ? (
            <button
              onClick={handleLogout}
              className="flex flex-col items-center text-gray-700 hover:text-red-600 transition-colors"
            >
              <ArrowRightStartOnRectangleIcon className="h-6 w-6" />
              <span className="text-xs">Logout</span>
            </button>
          ) : (
            <Link
              to="/signin"
              className="flex flex-col items-center text-gray-700 hover:text-green-600 transition-colors"
            >
              <ArrowLeftEndOnRectangleIcon className="h-6 w-6" />
              <span className="text-xs">Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default MobileNavBar;