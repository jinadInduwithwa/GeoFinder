import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCountryContext } from "../context/CountryContext";
import { FaHeart, FaArrowLeft, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"; // Import react-leaflet components

// Mock cultural highlights (unchanged)
const mockCulturalHighlights = (countryName) => [
  {
    name: `Traditional ${countryName} Festival`,
    description: `A vibrant celebration of ${countryName}'s heritage with music, dance, and local cuisine.`,
    image: "https://via.placeholder.com/300x200?text=Festival",
  },
  {
    name: `${countryName} Historical Landmark`,
    description: `An iconic site showcasing ${countryName}'s rich history and architecture.`,
    image: "https://via.placeholder.com/300x200?text=Landmark",
  },
];

const CountryDetails = () => {
  const { cca3 } = useParams();
  const { language, fetchCountryByCode, loading, error } = useCountryContext();
  const [country, setCountry] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Load favorite state from localStorage
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favoriteCountries") || "[]");
    setIsFavorite(favorites.includes(cca3));
  }, [cca3]);

  // Save favorite state to localStorage
  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favoriteCountries") || "[]");
    const updatedFavorites = isFavorite
      ? favorites.filter((code) => code !== cca3)
      : [...favorites, cca3];
    localStorage.setItem("favoriteCountries", JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
  };

  // Fetch country data
  useEffect(() => {
    const getCountry = async () => {
      try {
        const response = await fetchCountryByCode(cca3, language);
        if (!response || !response.data) {
          throw new Error("No country data received");
        }
        setCountry(response.data);
      } catch (err) {
        console.error("Error fetching country:", err);
        setCountry(null);
      }
    };
    getCountry();
  }, [cca3, language, fetchCountryByCode]);

  // Formatters
  const formatPopulation = (pop) => {
    const num = Number(pop);
    if (isNaN(num)) return "N/A";
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toString();
  };

  const formatArea = (area) => {
    const num = Number(area);
    if (isNaN(num)) return "N/A";
    return `${num.toLocaleString()} km²`;
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-t-transparent border-indigo-500 rounded-full"
        />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-lg max-w-md">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <Link to="/countries-list" className="mt-4 inline-block text-indigo-600 hover:underline">
            Back to Countries
          </Link>
        </div>
      </div>
    );
  }

  // Render no data state
  if (!country) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow-lg max-w-md">
          <p className="font-bold">No Data</p>
          <p>No country data found for the provided code.</p>
          <Link to="/countries-list" className="mt-4 inline-block text-indigo-600 hover:underline">
            Back to Countries
          </Link>
        </div>
      </div>
    );
  }

  // Safe access to country data
  const displayName =
    language === "en"
      ? country.name?.common || "N/A"
      : country.translations?.[language]?.common || country.name?.common || "N/A";

  const languageList = Object.values(country.languages || {}).join(", ") || "N/A";
  const currencyList = Object.values(country.currencies || {})
    .map((curr) => `${curr.name} (${curr.symbol})`)
    .join(", ") || "N/A";
  const timezoneList = country.timezones?.join(", ") || "N/A";
  const borderList = country.borders?.join(", ") || "None";
  const callingCode = country.idd
    ? `${country.idd.root}${country.idd.suffixes?.[0] || ""}`
    : "N/A";
  const tldList = country.tld?.join(", ") || "N/A";

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Hero Section with Parallax */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative w-full h-72 sm:h-96 md:h-[28rem] rounded-2xl overflow-hidden shadow-2xl"
      >
        <div
          className="absolute inset-0 bg-cover bg-center transform transition-transform duration-300 hover:scale-105"
          style={{ backgroundImage: `url(${country.flags?.png || "https://via.placeholder.com/1200x600"})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent backdrop-blur-sm flex flex-col justify-center items-center text-center p-6">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white drop-shadow-2xl"
          >
            {displayName}
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-100 mt-3"
          >
            {country.name?.official || "N/A"}
          </motion.p>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto mt-12"
      >
        {/* Back Button */}
        <motion.div variants={itemVariants}>
          <Link
            to="/countries-list"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-semibold mb-8 transition-colors duration-300 group"
          >
            <FaArrowLeft className="mr-2 text-xl transform group-hover:-translate-x-1 transition-transform" />
            Back to Countries
          </Link>
        </motion.div>

        {/* Key Info Section */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"
        >
          {/* Flag and Map */}
          <div className="lg:col-span-1">
            <div className="bg-white/40 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl p-6">
              <img
                className="w-full h-48 object-cover rounded-lg mb-4 transition-transform duration-300 hover:scale-105"
                src={country.flags?.png || "https://via.placeholder.com/300x200"}
                alt={country.flags?.alt || `${country.name?.common || "Country"} flag`}
              />
              <div className="h-48 rounded-lg overflow-hidden">
                {country.latlng ? (
                  <MapContainer
                    center={[country.latlng[0], country.latlng[1]]}
                    zoom={5}
                    style={{ height: "100%", width: "100%" }}
                    className="rounded-lg"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[country.latlng[0], country.latlng[1]]}>
                      <Popup>{displayName}</Popup>
                    </Marker>
                  </MapContainer>
                ) : (
                  <div className="h-full bg-gray-100 flex items-center justify-center rounded-lg">
                    <span className="text-gray-500">Map not available</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="lg:col-span-2">
            <div className="bg-white/40 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Key Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { label: "Capital", value: country.capital?.[0] || "N/A", tooltip: "Main administrative city" },
                  { label: "Population", value: formatPopulation(country.population), tooltip: "Total inhabitants" },
                  { label: "Area", value: formatArea(country.area), tooltip: "Land area in square kilometers" },
                  { label: "Continent", value: country.continents?.[0] || "N/A", tooltip: "Geographical continent" },
                  { label: "Region", value: country.region || "N/A", tooltip: "Geopolitical region" },
                ].map((item, index) => (
                  <div key={index} className="group relative">
                    <p className="text-gray-700 text-sm sm:text-base font-medium">
                      <strong>{item.label}:</strong> {item.value}
                    </p>
                    <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-md">
                      {item.tooltip}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Collapsible Detailed Info */}
        <motion.div variants={itemVariants}>
          <div className="bg-white/40 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl p-6 sm:p-8">
            <AnimatePresence>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                id="detailed-info"
                className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm sm:text-base"
              >
                {[
                  { label: "Subregion", value: country.subregion || "N/A" },
                  { label: "Languages", value: languageList },
                  { label: "Currencies", value: currencyList },
                  { label: "Timezones", value: timezoneList },
                  { label: "Bordering Countries", value: borderList },
                  { label: "Calling Code", value: callingCode },
                  { label: "Top-Level Domain", value: tldList },
                  { label: "Independent", value: country.independent ? "Yes" : "No" },
                  { label: "UN Member", value: country.unMember ? "Yes" : "No" },
                  { label: "Coordinates", value: country.latlng ? `${country.latlng[0]}, ${country.latlng[1]}` : "N/A" },
                  { label: "Driving Side", value: country.car?.side || "N/A" },
                ].map((item, index) => (
                  <p key={index} className="text-gray-700 font-medium">
                    <strong>{item.label}:</strong> {item.value}
                  </p>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Cultural Highlights */}
        <motion.div variants={itemVariants} className="mt-12">
          <div className="bg-white/40 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Cultural Highlights</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {mockCulturalHighlights(displayName).map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/60 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <img
                    src={highlight.image}
                    alt={highlight.name}
                    className="w-full h-32 object-cover rounded-md mb-3"
                  />
                  <h3 className="text-lg font-semibold text-gray-800">{highlight.name}</h3>
                  <p className="text-gray-600 text-sm">{highlight.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Sticky Favorites Button */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <button
          onClick={toggleFavorite}
          className={`p-4 rounded-full shadow-xl transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            isFavorite ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
          }`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <FaHeart className="text-xl" />
        </button>
      </motion.div>
    </div>
  );
};

export default CountryDetails;