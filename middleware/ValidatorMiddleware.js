import { body, param, validationResult } from "express-validator";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/customErrors.js";
import User from "../models/UserModel.js";


const withValidationError = (validateValue) => {
    return [
      validateValue,
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const errorMessage = errors.array().map((error) => error.msg);
          if (errorMessage[0].startsWith("Recycle item with")) {
            throw new NotFoundError(errorMessage);
          }
  
          if (errorMessage[0].startsWith("not authorized")) {
            throw new UnauthorizedError("not authorized to access this route");
          }
  
          throw new BadRequestError(errorMessage);
        }
        next();
      },
    ];
  };
  
  // validate User model
  
  // --------------- validate register input --------------------------
  export const validateRegisterInput = withValidationError([
    body("fullName")
      .notEmpty()
      .withMessage("Full name is required")
      .isLength({ min: 3, max: 50 })
      .withMessage("Full name must be between 3 and 50 characters")
      .trim(),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format")
      .custom(async (email) => {
        const user = await User.findOne({ email });
        if (user) {
          throw new BadRequestError("Email already exists");
        }
      }),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ]);
  
// --------------- validate login input --------------------------
  export const validateLoginInput = withValidationError([
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format"),
    body("password").notEmpty().withMessage("Password is required"),
  ]);