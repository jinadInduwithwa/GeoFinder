import { addFavorite, removeFavorite, getFavorites } from '../../Controller/favoritesController';
import { StatusCodes } from 'http-status-codes';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import User from '../../models/UserModel.js';

describe('Favorites Controller Integration Tests', () => {
  let mongoServer: MongoMemoryServer;
  let req: any;
  let res: any;
  let userId: string;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Create a test user with all required fields
    const user = new User({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      favorites: ['CAN'],
    });
    await user.save();
    userId = user._id.toString();

    req = {
      user: { userId },
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await User.deleteMany();
    jest.resetAllMocks();
  });

  describe('addFavorite', () => {
    it('should return 400 if cca3 is missing', async () => {
      await addFavorite(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ msg: 'cca3 is required' });
    });

    it('should add cca3 to favorites and return 200', async () => {
      req.body.cca3 = 'USA';

      await addFavorite(req, res);

      const updatedUser = await User.findById(userId);
      expect(updatedUser?.favorites).toContain('USA');
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({ favorites: expect.arrayContaining(['CAN', 'USA']) });
    });

    it('should not add duplicate cca3 and return 200', async () => {
      req.body.cca3 = 'CAN';

      await addFavorite(req, res);

      const updatedUser = await User.findById(userId);
      expect(updatedUser?.favorites.length).toBe(1); // No duplicate
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({ favorites: ['CAN'] });
    });

    it('should return 500 on server error', async () => {
      req.body.cca3 = 'USA';
      jest.spyOn(User, 'findById').mockRejectedValueOnce(new Error('Database error'));

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


    it('should return 500 on server error', async () => {
      req.body.cca3 = 'CAN';
      jest.spyOn(User, 'findById').mockRejectedValueOnce(new Error('Database error'));

      await removeFavorite(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Server error' });
    });
  });

  describe('getFavorites', () => {
   

    it('should return 500 on server error', async () => {
      jest.spyOn(User, 'findById').mockRejectedValueOnce(new Error('Database error'));

      await getFavorites(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Server error' });
    });
  });
});