import React from 'react';
import { useCountryContext } from '../context/CountryContext';
import Card from '../components/UI/Card';

const CountryList = () => {
  const {
    countries,
    loading,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
    language,
    setLanguage,
    searchQuery,
    setSearchQuery,
    selectedRegion,
    setSelectedRegion,
    clearCache,
  } = useCountryContext();

  console.log('Countries in CountryList:', countries); // Debug log

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
    setSelectedRegion('');
  };

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
    setCurrentPage(1);
    setSearchQuery('');
  };

  const handleClearCache = () => {
    clearCache();
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Countries</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by country name..."
          className="p-2 border border-gray-300 rounded-lg w-full sm:w-1/3"
        />
        <select
          value={selectedRegion}
          onChange={handleRegionChange}
          className="p-2 border border-gray-300 rounded-lg w-full sm:w-1/4"
        >
          <option value="">All Regions</option>
          <option value="Africa">Africa</option>
          <option value="Americas">Americas</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="Oceania">Oceania</option>
        </select>
        <select
          value={language}
          onChange={handleLanguageChange}
          className="p-2 border border-gray-300 rounded-lg w-full sm:w-1/4"
        >
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
          <option value="de">German</option>
        </select>
        <button
          onClick={handleClearCache}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
        >
          Clear Cache
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {countries.map((country) => (
          <Card key={country.cca3} country={country} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="bg-green-300 hover:bg-green-400 text-gray-800 font-bold py-2 px-4 rounded-l disabled:opacity-50"
          >
            Previous
          </button>
          <span className="py-2 px-4">Page {currentPage} of {totalPages}</span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="bg-green-300 hover:bg-green-400 text-gray-800 font-bold py-2 px-4 rounded-r disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CountryList;