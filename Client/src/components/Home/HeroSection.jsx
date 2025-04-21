import { motion, AnimatePresence } from "framer-motion";
import Button from "../UI/Button";
import { FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import heroImg from "../../assets/home/heroImage.jpg";

function HeroSection() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Delay to ensure content animates after loader
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="relative min-h-screen bg-cover bg-center w-full flex items-center justify-center"
      style={{
        backgroundImage: `url(${heroImg})`,
      }}
    >
      {/* Dark overlay */}
      <div
        className="absolute"
        style={{
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        ></div>

      {/* Content */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            className="relative max-w-7xl mx-auto px-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Welcome to <span className="text-green-500">GeoFinder</span>
              <br />
              Explore the World,
              <br />
              One Country at a Time
            </motion.h1>
            <motion.p
              className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Discover detailed information about countries, regions, and cultures from across the globe.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <Button to="/countries-list" icon={FaArrowRight}>
                Start Exploring
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HeroSection;