import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { UnauthenticatedError } from '../errors/customErrors.js';

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies.token; // Requires cookie-parser
    if (!token) {
      throw new UnauthenticatedError('Authentication invalid: No token provided');
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId };
    next();
  } catch (error) {
    console.error('Auth middleware error:', {
      message: error.message,
      stack: error.stack,
      token: req.cookies.token ? '[present]' : '[missing]',
    });
    throw new UnauthenticatedError('Authentication invalid');
  }
};