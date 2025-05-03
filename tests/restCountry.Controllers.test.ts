import { getAllCountries, getCountryByName, getCountriesByRegion, getCountryByCode, clearAllCaches } from '../Controller/restCountryAPI';
import * as dotenv from 'dotenv';

// Mock dotenv
jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe('Controller Tests', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = { query: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
    clearAllCaches(); // Clear caches before each test to reset state
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getAllCountries', () => {
    it('should return paginated countries with default page and pageSize', async () => {
      const mockCountries = Array.from({ length: 15 }, (_, i) => ({ name: `Country${i + 1}` }));
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockCountries),
      });

      req.query = { page: '1', pageSize: '5', lang: 'fr' };
      await getAllCountries(req, res);

      expect(fetch).toHaveBeenCalledWith(`${process.env.BASE_URL}/all`);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: mockCountries.slice(0, 5),
        total: 15,
        page: 1,
        pageSize: 5,
        totalPages: 3,
        language: 'fr',
      });
    });

    

    it('should use cache if data is already fetched', async () => {
      const mockCountries = [{ name: 'Country1' }];
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockCountries),
      });

      // First call to populate cache
      await getAllCountries(req, res);
      expect(fetch).toHaveBeenCalledTimes(1);

      // Second call should use cache
      await getAllCountries(req, res);
      expect(fetch).toHaveBeenCalledTimes(1); // Fetch not called again
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getCountryByName', () => {
    it('should return country by name', async () => {
      req.params = { name: 'France' };
      req.query = { lang: 'fr' };
      const mockCountry = [{ name: 'France' }];
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockCountry),
      });

      await getCountryByName(req, res);

      expect(fetch).toHaveBeenCalledWith(`${process.env.BASE_URL}/name/France`);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: mockCountry,
        language: 'fr',
      });
    });

    it('should handle not found error', async () => {
      req.params = { name: 'Unknown' };
      const errorMessage = 'Not Found';
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: errorMessage,
        json: async () => {
          throw new Error(errorMessage);
        },
      });

      await getCountryByName(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Country not found: Unknown',
      });
    });

    it('should use cache if country is already fetched', async () => {
      req.params = { name: 'France' };
      const mockCountry = [{ name: 'France' }];
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockCountry),
      });

      // First call to populate cache
      await getCountryByName(req, res);
      expect(fetch).toHaveBeenCalledTimes(1);

      // Second call should use cache
      await getCountryByName(req, res);
      expect(fetch).toHaveBeenCalledTimes(1); // Fetch not called again
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getCountriesByRegion', () => {
    it('should return paginated countries by region', async () => {
      req.params = { region: 'Europe' };
      req.query = { page: '2', pageSize: '5', lang: 'fr' };
      const mockCountries = Array.from({ length: 12 }, (_, i) => ({ name: `Country${i + 1}` }));
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockCountries),
      });

      await getCountriesByRegion(req, res);

      expect(fetch).toHaveBeenCalledWith(`${process.env.BASE_URL}/region/Europe`);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: mockCountries.slice(5, 10),
        total: 12,
        page: 2,
        pageSize: 5,
        totalPages: 3,
        language: 'fr',
        region: 'Europe',
      });
    });

    it('should handle error when fetch fails', async () => {
      req.params = { region: 'Invalid' };
      const errorMessage = 'Region not found';
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: errorMessage,
        json: async () => {
          throw new Error(errorMessage);
        },
      });

      await getCountriesByRegion(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to fetch countries for region: Invalid',
      });
    });

    it('should use cache if region data is already fetched', async () => {
      req.params = { region: 'Europe' };
      const mockCountries = [{ name: 'Country1' }];
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockCountries),
      });

      // First call to populate cache
      await getCountriesByRegion(req, res);
      expect(fetch).toHaveBeenCalledTimes(1);

      // Second call should use cache
      await getCountriesByRegion(req, res);
      expect(fetch).toHaveBeenCalledTimes(1); // Fetch not called again
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getCountryByCode', () => {
    it('should return country by alpha code', async () => {
      req.params = { code: 'FR' };
      req.query = { lang: 'fr' };
      const mockCountry = { name: 'France' };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockCountry),
      });

      await getCountryByCode(req, res);

      expect(fetch).toHaveBeenCalledWith(`${process.env.BASE_URL}/alpha/FR`);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: mockCountry,
        language: 'fr',
      });
    });

    it('should handle not found error', async () => {
      req.params = { code: 'XX' };
      const errorMessage = 'Not Found';
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: errorMessage,
        json: async () => {
          throw new Error(errorMessage);
        },
      });

      await getCountryByCode(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Country not found: XX',
      });
    });

    it('should use cache if country code data is already fetched', async () => {
      req.params = { code: 'FR' };
      const mockCountry = { name: 'France' };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockCountry),
      });

      // First call to populate cache
      await getCountryByCode(req, res);
      expect(fetch).toHaveBeenCalledTimes(1);

      // Second call should use cache
      await getCountryByCode(req, res);
      expect(fetch).toHaveBeenCalledTimes(1); // Fetch not called again
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('clearAllCaches', () => {
    it('should clear all caches', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      clearAllCaches();
      expect(consoleSpy).toHaveBeenCalledWith('All caches cleared');
      consoleSpy.mockRestore();
    });

    it('should clear caches after data is cached', async () => {
      const mockCountries = [{ name: 'Country1' }];
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockCountries),
      });

      // Populate cache
      await getAllCountries(req, res);

      // Clear caches
      clearAllCaches();

      // Fetch again to confirm cache was cleared
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockCountries),
      });
      await getAllCountries(req, res);
      expect(fetch).toHaveBeenCalledTimes(2); // Fetch called again after cache clear
    });
  });
});