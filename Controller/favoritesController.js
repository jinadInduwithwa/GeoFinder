import { StatusCodes } from 'http-status-codes';
import User from '../models/UserModel.js';

export const addFavorite = async (req, res) => {
  try {
    const { cca3 } = req.body;
    if (!cca3) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'cca3 is required' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'User not found' });
    }

    if (!user.favorites.includes(cca3)) {
      user.favorites.push(cca3);
      await user.save();
    }

    res.status(StatusCodes.OK).json({ favorites: user.favorites });
  } catch (error) {
    console.error('Error in addFavorite:', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.userId,
      cca3: req.body.cca3,
    });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Server error' });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { cca3 } = req.body;
    if (!cca3) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'cca3 is required' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'User not found' });
    }

    user.favorites = user.favorites.filter((code) => code !== cca3);
    await user.save();

    res.status(StatusCodes.OK).json({ favorites: user.favorites });
  } catch (error) {
    console.error('Error in removeFavorite:', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.userId,
      cca3: req.body.cca3,
    });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Server error' });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'User not found' });
    }

    res.status(StatusCodes.OK).json({ favorites: user.favorites });
  } catch (error) {
    console.error('Error in getFavorites:', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.userId,
    });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Server error' });
  }
};