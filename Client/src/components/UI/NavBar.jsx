import { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MobileNavBar from "./MobileNavBar";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  // Add scroll event listener only for desktop
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    if (isHomePage) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setIsScrolled(true);
    }
  }, [isHomePage]);

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
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block fixed w-full top-0 z-50 transition-all duration-300">
        <div
          className={`${
            isScrolled || !isHomePage
              ? "bg-white/80 backdrop-blur-md shadow-lg"
              : "bg-transparent"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link
                to="/"
                className={`text-2xl font-bold ${
                  isScrolled ? "text-green-600" : "text-white"
                }`}
              >
                GeoFinder
              </Link>

              {/* Desktop Navigation Links */}
              <div className="flex items-center space-x-8">
                <Link
                  to="/countries-list"
                  className={`hover:text-green-600 transition-colors ${
                    isScrolled ? "text-gray-700" : "text-white"
                  }`}
                >
                  Explore
                </Link>
                {user && (
                  <Link
                    to="/favourite"
                    className={`hover:text-green-600 transition-colors ${
                      isScrolled ? "text-gray-700" : "text-white"
                    }`}
                  >
                    Favourite
                  </Link>
                )}
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/signin"
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <MobileNavBar />
    </>
  );
}

export default NavBar;