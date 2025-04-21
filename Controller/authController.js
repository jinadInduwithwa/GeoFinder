import { StatusCodes } from "http-status-codes";
import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import { hashPassword } from "../Utils/passwordUtils.js";
import { UnauthenticatedError } from "../errors/customErrors.js";
import { createJWT } from "../Utils/tokenUtils.js";

//----------- register user -----------------
export const register = async (req, res) => {

  const hashedPassword = await hashPassword(req.body.password);
  req.body.password = hashedPassword;

  const user = await User.create(req.body);
  res.status(StatusCodes.CREATED).json({ msg: "User Created Successfully" });
};

//----------- login user --------------------
export const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const isValidUser =user && (await bcrypt.compare(req.body.password, user.password));

  if (!isValidUser) throw new UnauthenticatedError("Invalid credentials");

  const oneday = 24 * 60 * 60 * 1000;

  const token = createJWT({ userId: user._id });
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneday),
    secure: process.env.NODE_ENV === "production",
  });

  res.status(StatusCodes.OK).json({
    msg: "User logged in",
    user: {
      role: user.role,
      name: user.fullName,
      email: user.email,
    },
  });
};

//----------- logout user -------------------
export const logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "User logged out" });
};

export const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found" });
  }
  res.status(StatusCodes.OK).json({
    user: {
      name: user.fullName,
      email: user.email,
    },
  });
};