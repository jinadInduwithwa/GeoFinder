import * as dotenv from 'dotenv';
dotenv.config();

// Cache maps for different endpoints
const cachedCountriesByLang = new Map();
const cachedCountryByName = new Map();
const cachedCountriesByRegion = new Map();
const cachedCountryByCode = new Map();

//------------------------- Get all countries -------------------------------------
export const getAllCountries = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const lang = req.query.lang || 'en';

    let countries = cachedCountriesByLang.get(lang);

    if (!countries) {
      console.log('Fetching countries from REST Countries API...');
      const response = await fetch(`${process.env.BASE_URL}/all`);
      if (!response.ok) {
        throw new Error(`Failed to fetch all countries: ${response.statusText}`);
      }
      countries = await response.json();
      cachedCountriesByLang.set(lang, countries);
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = countries.slice(startIndex, endIndex);

    const responseData = {
      data: paginatedData,
      total: countries.length,
      page,
      pageSize,
      totalPages: Math.ceil(countries.length / pageSize),
      language: lang,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error in getAllCountries:', error.message);
    res.status(500).json({ error: 'Failed to fetch countries', details: error.message });
  }
};

//------------------------- Get country by name -------------------------------------
export const getCountryByName = async (req, res) => {
  try {
    const { name } = req.params;
    const lang = req.query.lang || 'en';
    const cacheKey = `${name}:${lang}`;

    let country = cachedCountryByName.get(cacheKey);

    if (!country) {
      const response = await fetch(`${process.env.BASE_URL}/name/${name}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch country: ${name}`);
      }
      country = await response.json();
      cachedCountryByName.set(cacheKey, country);
    }

    res.status(200).json({
      data: country,
      language: lang,
    });
  } catch (error) {
    console.error(`Error fetching country by name: ${error.message}`);
    res.status(404).json({ error: `Country not found: ${req.params.name}` });
  }
};

//------------------------- Get countries by region -------------------------------------
export const getCountriesByRegion = async (req, res) => {
  try {
    const { region } = req.params;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const lang = req.query.lang || 'en';
    const cacheKey = `${region}:${lang}`;

    let countries = cachedCountriesByRegion.get(cacheKey);

    if (!countries) {
      const response = await fetch(`${process.env.BASE_URL}/region/${region}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch countries for region: ${region}`);
      }
      countries = await response.json();
      cachedCountriesByRegion.set(cacheKey, countries);
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = countries.slice(startIndex, endIndex);

    const responseData = {
      data: paginatedData,
      total: countries.length,
      page,
      pageSize,
      totalPages: Math.ceil(countries.length / pageSize),
      language: lang,
      region,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error(`Error fetching countries by region: ${error.message}`);
    res.status(500).json({ error: `Failed to fetch countries for region: ${req.params.region}` });
  }
};

//------------------------- Get country by alpha code -------------------------------------
export const getCountryByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const lang = req.query.lang || 'en';
    const cacheKey = `${code}:${lang}`;

    let country = cachedCountryByCode.get(cacheKey);

    if (!country) {
      const response = await fetch(`${process.env.BASE_URL}/alpha/${code}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch country with code: ${code}`);
      }
      const data = await response.json();
      // Normalize: REST Countries API returns an array, take the first item
      country = Array.isArray(data) ? data[0] : data;
      cachedCountryByCode.set(cacheKey, country);
    }

    res.status(200).json({
      data: country,
      language: lang,
    });
  } catch (error) {
    console.error(`Error fetching country by code: ${error.message}`);
    res.status(404).json({ error: `Country not found: ${req.params.code}` });
  }
};

//------------------------- Clear all caches -------------------------------------
export const clearAllCaches = () => {
  cachedCountriesByLang.clear();
  cachedCountryByName.clear();
  cachedCountriesByRegion.clear();
  cachedCountryByCode.clear();
  console.log('All caches cleared');
};