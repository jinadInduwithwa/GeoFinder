import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { toast } from 'react-hot-toast';
import { useAuthenticationContext } from './AuthContext';

const CountryContext = createContext();

// Simple in-memory cache
const cache = new Map();

export const CountryProvider = ({ children }) => {
  const [countries, setCountries] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [language, setLanguage] = useState('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');

  const { user } = useAuthenticationContext(); // Updated to useAuthenticationContext
  const BASE_URL = '/api/v1/countries';
  const FAVORITES_URL = '/api/v1/favorites';

  // Generate cache key based on request parameters
  const getCacheKey = (endpoint, params) => {
    return `${endpoint}-${JSON.stringify(params)}`;
  };

  // Generic fetch function with caching and ETag support
  const fetchWithCache = async (endpoint, params = {}, options = {}) => {
    const cacheKey = getCacheKey(endpoint, params);
    const cached = cache.get(cacheKey);

    if (cached && cached.expires > Date.now()) {
      return cached.data;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `${BASE_URL}${endpoint}?${new URLSearchParams(params)}`;
      const headers = cached?.etag ? { 'If-None-Match': cached.etag } : {};

      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // Include cookies for auth
      });
      if (response.status === 304) {
        cache.set(cacheKey, { ...cached, expires: Date.now() + 1000 * 60 * 5 });
        setLoading(false);
        return cached.data;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.msg || `Failed to fetch: ${endpoint} (Status: ${response.status})`);
      }

      const data = await response.json();
      const etag = response.headers.get('ETag');

      cache.set(cacheKey, {
        data,
        etag,
        expires: Date.now() + 1000 * 60 * 5,
      });

      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Fetch favorites
  const fetchFavorites = async () => {
    if (!user) return; // Skip if not authenticated
    setLoading(true);
    try {
      const response = await fetch(FAVORITES_URL, {
        credentials: 'include',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to fetch favorites');
      }
      const data = await response.json();
      setFavorites(data.favorites || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add favorite country
const addFavoriteCountry = async (cca3) => {
  if (!user) {
    toast.error('Please sign in to add favorites');
    return;
  }
  try {
    const response = await fetch(FAVORITES_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ cca3 }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Add favorite error:', {
        status: response.status,
        errorData,
        url: FAVORITES_URL,
        cca3,
      });
      throw new Error(errorData.msg || `Failed to add favorite (Status: ${response.status})`);
    }
    setFavorites((prev) => [...prev, cca3]);
    toast.success('Added to favorites');
  } catch (err) {
    toast.error(err.message);
    console.error('Add favorite catch error:', err);
  }
};

  // Remove favorite country
  const removeFavoriteCountry = async (cca3) => {
    if (!user) {
      toast.error('Please sign in to remove favorites');
      return;
    }
    try {
      const response = await fetch(`${FAVORITES_URL}/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ cca3 }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to remove favorite');
      }
      setFavorites((prev) => prev.filter((code) => code !== cca3));
      toast.success('Removed from favorites');
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Fetch all countries (paginated)
  const fetchCountries = async (page = 1, lang = 'en') => {
    const data = await fetchWithCache('/all', { page, pageSize, lang });
    setCountries(data.data);
    setTotalPages(data.totalPages);
    setCurrentPage(data.page);
  };

  // Search countries by name (debounced)
  const searchCountryByName = useCallback(
    debounce(async (name, lang = 'en') => {
      if (!name) return;
      const data = await fetchWithCache(`/name/${encodeURIComponent(name)}`, { lang });
      setCountries(Array.isArray(data.data) ? data.data : [data.data]);
      setTotalPages(1);
      setCurrentPage(1);
    }, 500),
    []
  );

  // Fetch countries by region (paginated)
  const fetchCountriesByRegion = async (region, page = 1, lang = 'en') => {
    if (!region) return;
    const data = await fetchWithCache(`/region/${encodeURIComponent(region)}`, {
      page,
      pageSize,
      lang,
    });
    setCountries(data.data);
    setTotalPages(data.totalPages);
    setCurrentPage(data.page);
  };

  // Fetch country by alpha code
  const fetchCountryByCode = async (code, lang = 'en') => {
    const data = await fetchWithCache(`/alpha/${encodeURIComponent(code)}`, { lang });
    const country = Array.isArray(data.data) ? data.data[0] : data.data;
    return { data: country };
  };

  // Clear cache (client and server)
  const clearCache = async () => {
    try {
      cache.clear();
      const response = await fetch(`${BASE_URL}/clear-cache`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to clear server cache');
      if (searchQuery) {
        searchCountryByName(searchQuery, language);
      } else if (selectedRegion) {
        fetchCountriesByRegion(selectedRegion, currentPage, language);
      } else {
        fetchCountries(currentPage, language);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch favorites on mount if authenticated
  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]); // Clear favorites if not authenticated
    }
  }, [user]);

  // Optimized useEffect for country fetching
  useEffect(() => {
    if (searchQuery) {
      searchCountryByName(searchQuery, language);
    } else if (selectedRegion) {
      fetchCountriesByRegion(selectedRegion, currentPage, language);
    } else {
      fetchCountries(currentPage, language);
    }
    return () => searchCountryByName.cancel();
  }, [currentPage, language, searchQuery, selectedRegion]);

  const value = {
    countries,
    favorites,
    loading,
    error,
    currentPage,
    setCurrentPage,
    pageSize,
    totalPages,
    language,
    setLanguage,
    searchQuery,
    setSearchQuery,
    selectedRegion,
    setSelectedRegion,
    fetchCountries,
    searchCountryByName,
    fetchCountriesByRegion,
    fetchCountryByCode,
    clearCache,
    fetchFavorites,
    addFavoriteCountry,
    removeFavoriteCountry,
  };

  return <CountryContext.Provider value={value}>{children}</CountryContext.Provider>;
};

export const useCountryContext = () => {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error('useCountryContext must be used within a CountryProvider');
  }
  return context;
};