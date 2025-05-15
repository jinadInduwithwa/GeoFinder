import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./NavBar";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import { BounceLoader } from "react-spinners";
import { Toaster } from "react-hot-toast";

function Layout() {
  const [loading, setLoading] = useState(false); // Start with false
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 300); // Reduced to 300ms
    return () => clearTimeout(timeout);
  }, [location]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="flex flex-col justify-between min-h-screen font-Mainfront bg-white dark:bg-gray-900">
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#fff",
            color: "#1f2937",
          },
          className: "dark:bg-gray-800 dark:text-gray-100",
        }}
      />

      {loading && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-gray-100/20 dark:bg-gray-900/20 backdrop-blur-md">
          <BounceLoader size={50} color="#34d399" />
        </div>
      )}

      <div className="sticky top-0 z-40">
        <Navbar />
      </div>

      <main className="w-full mx-auto max-w-[1920px]">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default Layout;