import { Router } from "express";
const router = Router();

import {
  getAllCountries,
  getCountryByName,
  getCountriesByRegion,
  getCountryByCode,
  clearAllCaches
} from "../Controller/restCountryAPI.js";

// Route to get all countries with pagination and language support
router.get("/all", getAllCountries);

// Route to get a country by name
router.get("/name/:name", getCountryByName);

// Route to get countries by region with pagination and language support
router.get("/region/:region", getCountriesByRegion);

// Route to get a country by alpha code
router.get("/alpha/:code", getCountryByCode);

// Route to clear all caches
router.post("/clear-cache", clearAllCaches);

export default router;