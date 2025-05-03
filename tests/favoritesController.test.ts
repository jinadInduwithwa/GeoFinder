import { addFavorite, removeFavorite, getFavorites } from '../Controller/favoritesController.js';
import { StatusCodes } from 'http-status-codes';
import User from '../models/UserModel.js';
import { Types } from 'mongoose';

// Mock the User model
jest.mock('../models/UserModel.js');

describe('Favorites Controller Tests', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      user: { userId: new Types.ObjectId().toString() },
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('addFavorite', () => {
    it('should return 400 if cca3 is missing', async () => {
      await addFavorite(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ msg: 'cca3 is required' });
    });

    it('should return 404 if user is not found', async () => {
      req.body.cca3 = 'USA';
      (User.findById as jest.Mock).mockResolvedValueOnce(null);

      await addFavorite(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ msg: 'User not found' });
    });

    it('should add cca3 to favorites if not present and return 200', async () => {
      req.body.cca3 = 'USA';
      const userMock = {
        _id: req.user.userId,
        favorites: ['CAN'],
        save: jest.fn().mockResolvedValue({ favorites: ['CAN', 'USA'] }),
      };
      (User.findById as jest.Mock).mockResolvedValueOnce(userMock);

      await addFavorite(req, res);

      expect(userMock.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({ favorites: ['CAN', 'USA'] });
    });

    it('should not add duplicate cca3 and return 200', async () => {
      req.body.cca3 = 'USA';
      const userMock = {
        _id: req.user.userId,
        favorites: ['USA'],
        save: jest.fn().mockResolvedValue({ favorites: ['USA'] }),
      };
      (User.findById as jest.Mock).mockResolvedValueOnce(userMock);

      await addFavorite(req, res);

      expect(userMock.save).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({ favorites: ['USA'] });
    });

    it('should return 500 on server error', async () => {
      req.body.cca3 = 'USA';
      (User.findById as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

      await addFavorite(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Server error' });
    });
  });

  describe('removeFavorite', () => {
    it('should return 400 if cca3 is missing', async () => {
      await removeFavorite(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ msg: 'cca3 is required' });
    });

    it('should return 404 if user is not found', async () => {
      req.body.cca3 = 'USA';
      (User.findById as jest.Mock).mockResolvedValueOnce(null);

      await removeFavorite(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ msg: 'User not found' });
    });

    it('should remove cca3 from favorites and return 200', async () => {
      req.body.cca3 = 'USA';
      const userMock = {
        _id: req.user.userId,
        favorites: ['USA', 'CAN'],
        save: jest.fn().mockResolvedValue({ favorites: ['CAN'] }),
      };
      (User.findById as jest.Mock).mockResolvedValueOnce(userMock);

      await removeFavorite(req, res);

      expect(userMock.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({ favorites: ['CAN'] });
    });

    it('should return 200 if cca3 not in favorites', async () => {
      req.body.cca3 = 'USA';
      const userMock = {
        _id: req.user.userId,
        favorites: ['CAN'],
        save: jest.fn().mockResolvedValue({ favorites: ['CAN'] }),
      };
      (User.findById as jest.Mock).mockResolvedValueOnce(userMock);

      await removeFavorite(req, res);

      expect(userMock.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({ favorites: ['CAN'] });
    });

    it('should return 500 on server error', async () => {
      req.body.cca3 = 'USA';
      (User.findById as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

      await removeFavorite(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Server error' });
    });
  });

  describe('getFavorites', () => {
    it('should return 404 if user is not found', async () => {
      (User.findById as jest.Mock).mockResolvedValueOnce(null);

      await getFavorites(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ msg: 'User not found' });
    });

    it('should return 200 with user favorites', async () => {
      const userMock = {
        _id: req.user.userId,
        favorites: ['USA', 'CAN'],
      };
      (User.findById as jest.Mock).mockResolvedValueOnce(userMock);

      await getFavorites(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({ favorites: ['USA', 'CAN'] });
    });

    it('should return 500 on server error', async () => {
      (User.findById as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

      await getFavorites(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Server error' });
    });
  });
});